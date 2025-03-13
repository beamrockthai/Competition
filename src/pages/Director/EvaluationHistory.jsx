import axios from "axios"
import { PATH_API } from "../../constrant"
import { useEffect, useState } from "react"

export const EvaluationHistoryPage = () =>{
    const [evaluationAnswer,setEvaluationAnswer]=useState()
    const getEvaluationAnswer = async ()=>{
        const data = await axios.get(PATH_API+`/evaluation_answers/getbyteam/20/52/1/1`)
        console.log("getEvaluationAnswer",data);
        setEvaluationAnswer(data.data)
    }
    useEffect(()=>{
        getEvaluationAnswer()
    },[])
    return(
        <>
        {JSON.stringify(evaluationAnswer)}
        </>
    )
}