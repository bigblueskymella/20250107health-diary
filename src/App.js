import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import React, { useEffect, useReducer, useRef, useState } from "react";

export const DiaryStateContext = React.createContext(); //상태
export const DiaryDispatchContext = React.createContext(); //실행

// 리렌더 필요없는 목데이터 외부에 입력
const mockData = [
  {
    id: "mock1",
    date: new Date().toLocaleDateString(),
    content: "샘플1",
    emotionId: 1,
  },
  {
    id: "mock2",
    date: new Date().toLocaleDateString(),
    content: "샘플2",
    emotionId: 2,
  },
  {
    id: "mock3",
    date: new Date().toLocaleDateString(),
    content: "샘플3",
    emotionId: 3,
  },
];

// 🟡App외부에 작성한다 reducer상태변화함수
function reducer(state, action) {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const newState = [action.data, ...state]; //바뀐내용, 기존의 내용
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "UPDATE": {
      // 🔴{...item, ...action.data}
      const newState = state.map((item) => {
        // String(item.id) === String(action.data.id) ? {...item, ...action.data} : item
        if (String(item.id) === String(action.data.id)) {
          return { ...item, ...action.data };
        } else {
          return item;
        }
      })
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "DELETE": {
      const newState = state.filter(
        (item) => String(item.id) !== String(action.targetId)
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }

    default: {
      return state;
    }
  }
}

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0); //🟡배열 형태의 일기 리스트 id부여

  useEffect(() => {
    const rawData = localStorage.getItem("diary");
    if(!rawData){
      setIsDataLoaded(true);
      return;
    }
    const localData = JSON.parse(rawData)
    if(localData.length===0){
      setIsDataLoaded(true)
      return;
    }
    idRef.current = localData[0].id+1;
    dispatch({type: "INIT", data: localData}); //🎃mock을 바꿔준다
    setIsDataLoaded(true);
  }, []);

  const onCreate = (date, content, emotionId) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current,
        date: new Date(date).toLocaleDateString(),
        content,
        emotionId,
      },
    });
    idRef.current += 1;
  };
  const onUpdate = (targetId, date, content, emotionId) => {
    dispatch({
      type: "UPDATE",
      data: {
        id: targetId, //🔴id:targetId 
        date: new Date(date).toLocaleDateString(),
        content,
        emotionId,
      },
    });
  };
  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  };

  if (!isDataLoaded) {
    return <div>데이터를 불러오는 중입니다...</div>;
  } else {
    return (
      // StateContext 상태: 일기state
      // DispatchContext 함수: update함수
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onDelete, onUpdate }}>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/diary/:id" element={<Diary />} />
              <Route path="/edit/:id" element={<Edit />} />
            </Routes>
          </div>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    );
  }
}

export default App;
