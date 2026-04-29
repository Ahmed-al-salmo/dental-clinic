import React,{useState, useEffect} from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import femaleImage from '../image/Screenshot 2026-04-25 223955.png'
import maleImage from '../image/Screenshot 2026-04-25 223920.png'

export default function PatientList() {
    const navigate = useNavigate();

    useEffect(()=>{getPatients()},[])
    const [patientsList, setPatientsList] = useState([]);
    const patientsCollectionRef = collection(db,'patients');

    const getPatients = async()=>{
        try{
            const data = await getDocs(patientsCollectionRef);
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            setPatientsList(filteredData)
        }catch(err){
            console.log(err)
        }
    }

    const titleBar = ()=>{
        return (
            <div className=" bg-indigo-500 flex items-center text-white">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold">Patients List</h1>
            </div>
        );
    }

    const PatientsList =()=>{
        return (
            <div className="w-full max-h-[70vh] overflow-y-auto p-2 ">
                {patientsList.map((patient)=>{
                    return (
                        <div onClick={()=>navigate('/home/patientsList/patientData', {state:{patient:patient}})} key={patient.id} className="w-full  border-2 border-gray-500 rounded-xl p-3 my-2 cursor-pointer flex justify-between items-center">
                            <div className="flex items-center">
                                <img src={patient.gander==='male'? maleImage:femaleImage} alt='photo about gander' className="w-[50px] h-[50px] "/>
                                <div className="">
                                    <h1 className="text-lg font-bold text-indigo-500">{patient.name}</h1>
                                    <p className="text-gray-500 text-sm">Age: {patient.age}</p>
                                </div>
                            </div> 
                            <p className="text-gray-500 text-sm">Phone: {patient.phoneNumber}</p>
                        </div>
                    );
                })}
            </div>
        );  
    }

    return(
        <div>
            {titleBar()}
            <div className="w-[60%] m-auto mt-5 border-b-2 border-gray-500 mb-3 p-2 flex justify-between items-center">
                    <h1 className="text-indigo-500 text-xl font-bold">Patients List</h1>
                    <div onClick={()=>navigate('/home/addpatient')} className="bg-green-500 text-white font-bold w-fit p-3 rounded-xl flex gap-2 cursor-pointer hover:bg-green-600 items-center"> <FaPlus /> Add Patient </div>
            </div>
            <div className="w-[60%] max-h-[70vh]  gap-3  m-auto overflow-y-auto flex flex-wrap p-2 ">
                {patientsList.length > 0 ? <PatientsList /> : <p className="text-gray-500 text-lg font-bold">No patients found</p>}
            </div>
        </div>

        
    );
}