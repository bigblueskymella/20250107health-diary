import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useDiary from '../hooks/useDiary'
import Header from '../component/Header'
import {emotionList} from "../util"
//🟡 동적 경로 설정 URL파라미터 값 불러오기
//(해당id)에 해당하는 일기 불러오기 (상세페이지)

const Diary = () => {
  const {id} = useParams()
  const data = useDiary(id)//커스텀 훅
  console.log("diary의data",data)
  const navigate = useNavigate()
  const goBack=()=>{navigate(-1)}
  const goEdit=()=>{navigate(`/edit/${id}`)}
  
  if(!data){
    return <div>일기를 불러오고 있습니다...</div>
  }else{
    const {date, emotionId, content} = data; //🏀
    const HealthItem = emotionList.find((item)=>item.id===emotionId)
    console.log("아이템", HealthItem)
  return (
    <div>
      <Header title={date +"기록"}
        leftChild={<button onClick={goBack}>뒤로가기</button>}
        // rightChild={<button onClick={goEdit}>수정하기</button>}
        rightChild={<button onClick={goEdit}>수정하기</button>}
      />
      <div>{id}번째 일기 Diary</div>
      <div>Diary 페이지 입니다</div>
      {/* 일기 내용 보여주기 */}
      <div>{content}</div>
      {/* 이미지 보여주기 */}
      <img src={HealthItem.img}
       alt={HealthItem.name}
       style={{ width: '200px'}}
      />
    </div>
  )
}
}
export default Diary
//517