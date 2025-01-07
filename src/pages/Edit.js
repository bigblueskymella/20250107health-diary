import React, { useContext } from 'react'
import Header from '../component/Header'
import useDiary from '../hooks/useDiary'
import {useNavigate, useParams} from 'react-router-dom'
import Editor from '../component/Editor'
import { DiaryDispatchContext } from '../App'
import Button from '../component/Button'

const Edit = () => {
  const {id} = useParams()
  const data = useDiary(id)
  const navigate = useNavigate()
  const {onUpdate, onDelete} = useContext(DiaryDispatchContext)

  const onSubmit = (data) => {
    console.log("데이타제출", data)
    if(window.confirm("일기를 정말 수정할까요?")){
      const{date, content, emotionId} = data;
      onUpdate(id, date, content, emotionId); // onUpdate는 dispatch 호출
      navigate("/", {replace:true})
    }
  }
  const onClickDelete = () => {
    if(window.confirm("일기를 정말 삭제할까요?")){
      onDelete(id);
      navigate("/", {replace:true}) // replace:true 뒤로가지 않기
    }
  }

  return (
    <div>
      <Header title={"일기 수정하기"}
      leftChild={<Button text={"<뒤로가기"} onClick={()=>navigate(-1)}/>}
      rightChild={<Button text={"X삭제하기"} onClick={onClickDelete}/>}  
      />
      {/* 🏀initData 추가 */}
      <Editor initData={data} onSubmit={onSubmit}/> 
    </div>
  )
}

export default Edit
