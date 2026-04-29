import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddPatient() {
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState({
        name: '',
        age: '',
        gander:'',
        phoneNumber: '',
        treatmentType: 'no',
        treatmentComments: 'no',
        chronicDiseases: 'no',
        continuousMedications: 'no',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
    });

    const titleBar = ()=>{
        return (
            <div className=" bg-indigo-500 flex items-center text-white">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold">Add Patient</h1>
            </div>
        );
    }
    const resetProcess =()=>{
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        setPatientData({
            name: '',
            age: '',
            phoneNumber: '',
            cost: '',
            treatmentType: '',
            treatmentComments: 'no',
            chronicDiseases: 'no',
            continuousMedications: 'no',
            diseaseComments: 'no',
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
        })
    }
    const addPatient = async()=>{
        try{
            await addDoc(collection(db,'patients'),{...patientData,year: new Date().getFullYear(),
                                                        month: new Date().getMonth() + 1,
                                                        day: new Date().getDate(),
                                                        hour: new Date().getHours(),
                                                        minutes: new Date().getMinutes(),
                                                    }
                        );
            resetProcess();
        }
        catch(err){
            console.log(err)
        }
    }
    const form=()=>{
        return(
            <div className="w-[50%] max-h-[90vh] m-auto mt-8 flex justify-evenly gap-3 items-evenly flex-wrap bg-gray-200 p-3 rounded-xl shadow-xl">
                <div className="w-[49%]  bg-white  p-3 rounded-xl">
                    <h1 className="text-indigo-500 text-xl font-bold">Patient Data</h1>
                    <input onChange={(e)=>setPatientData({...patientData,name:e.target.value})} type="text" placeholder='Name...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                    <input onChange={(e)=>setPatientData({...patientData,age:e.target.value})} type="text" placeholder='Age...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                    {/* <div> */}
                        <label >male </label>
                        <input onClick={(e)=>e.target.checked? setPatientData({...patientData, gander:'male'}):null} type="checkbox" />
                        
                        <label className="ml-3">female </label>
                        <input onClick={(e)=>e.target.checked? setPatientData({...patientData, gander:'female'}):null} type="checkbox" />
                        
                    {/* </div> */}
                    <input onChange={(e)=>setPatientData({...patientData,phoneNumber:e.target.value})} type="text" placeholder='Phone Number...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                </div>
                
                
                <div className="w-[49%] bg-white p-3 rounded-xl">
                    <h1 className="text-indigo-500 font-bold">Treatment procedures</h1>
                    
                    <input onChange={(e)=>setPatientData({...patientData,treatmentType:e.target.value})} type="text" placeholder='Type of treatment...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                    <input onChange={(e)=>setPatientData({...patientData,treatmentComments:e.target.value})} type="text" placeholder='Comments...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                </div>
                <div className="w-[49%] bg-white p-3 rounded-xl">
                    <h1 className="text-indigo-500 font-bold">More information About Patient</h1>
                    <input onChange={(e)=>setPatientData({...patientData,chronicDiseases:e.target.value})} type="text" placeholder='Chronic diseases...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                    <input onChange={(e)=>setPatientData({...patientData,continuousMedications:e.target.value})} type="text" placeholder='Continuous medications...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400"/>
                </div>
                <div className="w-[49%]  p-3 rounded-xl">
                    <div onClick={addPatient} className="bg-green-500 w-full p-3 my-2 font-bold text-white text-center cursor-pointer rounded-xl">Add Patient</div>
                    <div onClick={()=>navigate(-1)} className="bg-red-500 w-full p-3 my-2 font-bold text-white text-center cursor-pointer rounded-xl">cancel Process</div>
                    <div onClick={resetProcess} className="bg-indigo-500 w-full p-3 my-2 font-bold text-white text-center cursor-pointer rounded-xl">reset Process</div>
                    
                </div>
            </div>
        )
    }

    return(
        <div >
            {titleBar()}
            {form()}
            
        </div>
    );
}