import React,{useState, useEffect} from "react";
import { FaArrowLeft, FaCalendar, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import maleAvatar from '../image/Screenshot 2026-04-25 223920.png'
import femaleAvatar from '../image/Screenshot 2026-04-25 223955.png'
import { db } from "../config/firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaCircleCheck } from "react-icons/fa6";

export default function Appointment(){
    const navigate = useNavigate();

    const [patientDataFromDB, setPatientDataFromDB]= useState([]);
    const [searchTerm, setSearchTerm] = useState('')

    const [appointmentType, setAppointmentType] = useState('all')

    useEffect(()=>{
        getpatientDataFromDB();
    },[])
    const getpatientDataFromDB =async ()=>{
        try{
            const data = await getDocs(collection(db,'appointments'));
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}))
            setPatientDataFromDB(filteredData)
        }catch(err){
            console.log(err)
        }
    }
    const titleBar = ()=>{
        return (
            <div className=" bg-indigo-500 flex items-center text-white">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold">Appointments</h1>
            </div>
        );
    }// بيحتوي على اسم القسم وبيحتوي على زر رجوع

    const navBar = ()=>{
        return(
            <div className=" flex justify-evenly m-2 ">
                <div className="bg-gray-50 rounded-xl shadow-sm px-8 p-2 flex items-center gap-3 "><FaCalendar className="text-yellow-500"/> {patientDataFromDB.length || 0}</div>
                <input onChange={(e)=>setSearchTerm(e.target.value.trim())} type="text" placeholder="Search By Name..." className="p-2 bg-gray-100 outline-none text-gray-500 shadow-sm w-[70%]" />
                <div onClick={()=>setAppointmentType('all')} className={`${appointmentType==='all'? "bg-indigo-500 text-white":"bg-gray-50 text-gray-500 "} rounded-xl shadow-sm px-4 p-2  cursor-pointer hover:text-white hover:bg-indigo-500`}>All</div>
                <div onClick={()=>setAppointmentType('done')} className={`${appointmentType==='done'? "bg-indigo-500 text-white":"bg-gray-50 text-gray-500 "} rounded-xl shadow-sm px-4 p-2 cursor-pointer hover:text-white hover:bg-indigo-500`}>Done</div>
                <div onClick={()=>setAppointmentType('not done')} className={`${appointmentType==='not done'? "bg-indigo-500 text-white":"bg-gray-50 text-gray-500 "} rounded-xl shadow-sm px-4 p-2 cursor-pointer hover:text-white hover:bg-indigo-500`}>Not Done</div>

            </div>
        );
    }

    const deleteAppointmentHandler =async (id)=>{
        try{
            await deleteDoc(doc(db,'appointments',id))
            getpatientDataFromDB()
        }catch(err){
            console.log(err)
        }
    }

    const appointmentList =()=>{
        return ( 
            <div className="w-[60%] p-2 h-[75vh] overflow-y-auto m-auto">
                
                

                {
                    searchTerm==='' &&
                    patientDataFromDB.length>0  &&
                        patientDataFromDB.map((patient,index)=>(
                            <div key={index} className="w-full p-3 rounded-xl bg-white shadow-lg flex gap-3 my-2">
                                <div className="w-[100px] h-[100px] bg-blue-200 " > <img src={patient.gander==='male'? maleAvatar: femaleAvatar} alt="image avatar"/></div>
                                <div className="flex justify-between w-[calc(100%-100px)] ">
                                    <div className="">
                                        <p className="text-indigo-500 font-bold mt-1">Name: <span className="text-gray-500">{patient.name}</span></p>
                                        <p className="text-indigo-500 font-bold my-2">Age: <span className="text-gray-500">{patient.age}</span></p>
                                        <p className="text-indigo-500 font-bold mb-1">Phone Number: <span className="text-gray-500">{patient.phoneNumber}</span></p>
                                    </div>
                                    <div className=" ">
                                        <p className="text-gray-500 font-bold mt-1">{patient.time}</p>
                                        <p className="text-gray-500 font-bold my-2">{patient.date}</p>
                                        <p className="text-indigo-500 font-bold mt-5 flex justify-end gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(patient.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>

                                            <FaCircleCheck className={`${patient.isDone? "text-green-500 ":"text-yellow-500 "}  `}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
                {   
                    searchTerm !==''&&
                    patientDataFromDB.length>0 && 
                        patientDataFromDB.map((patient,index)=>(
                            patient.name.toLowerCase().includes(searchTerm)&&
                            <div key={index} className="w-full p-3 rounded-xl bg-white shadow-lg flex gap-3 my-2">
                                <div className="w-[100px] h-[100px] bg-blue-200 " > <img src={patient.gander==='male'? maleAvatar: femaleAvatar} alt="image avatar"/></div>
                                <div className="flex justify-between w-[calc(100%-100px)] ">
                                    <div className="">
                                        <p className="text-indigo-500 font-bold mt-1">Name: <span className="text-gray-500">{patient.name}</span></p>
                                        <p className="text-indigo-500 font-bold my-2">Age: <span className="text-gray-500">{patient.age}</span></p>
                                        <p className="text-indigo-500 font-bold mb-1">Phone Number: <span className="text-gray-500">{patient.phoneNumber}</span></p>
                                    </div>
                                    <div className=" ">
                                        <p className="text-gray-500 font-bold mt-1">{patient.time}</p>
                                        <p className="text-gray-500 font-bold my-2">{patient.date}</p>
                                        <p className="text-indigo-500 font-bold mt-5 flex justify-end gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(patient.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>

                                            <FaCircleCheck className={`${patient.isDone? "text-green-500 ":"text-yellow-500 "}  `}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
                {

                }

                {
                    searchTerm==='' && patientDataFromDB.length ===0 && <div className="text-gray-500 font-bold">No Appointment Found</div>
                }
            </div>
        );
    }

    const appointmentListForDone =()=>{
        return ( 
            <div className="w-[60%] p-2 h-[75vh] overflow-y-auto m-auto">
                
                

                {
                    searchTerm==='' &&
                    patientDataFromDB.length>0  &&
                        patientDataFromDB.map((patient,index)=>(
                            patient.isDone &&
                            <div key={index} className="w-full p-3 rounded-xl bg-white shadow-lg flex gap-3 my-2">
                                <div className="w-[100px] h-[100px] bg-blue-200 " > <img src={patient.gander==='male'? maleAvatar: femaleAvatar} alt="image avatar"/></div>
                                <div className="flex justify-between w-[calc(100%-100px)] ">
                                    <div className="">
                                        <p className="text-indigo-500 font-bold mt-1">Name: <span className="text-gray-500">{patient.name}</span></p>
                                        <p className="text-indigo-500 font-bold my-2">Age: <span className="text-gray-500">{patient.age}</span></p>
                                        <p className="text-indigo-500 font-bold mb-1">Phone Number: <span className="text-gray-500">{patient.phoneNumber}</span></p>
                                    </div>
                                    <div className=" ">
                                        <p className="text-gray-500 font-bold mt-1">{patient.time}</p>
                                        <p className="text-gray-500 font-bold my-2">{patient.date}</p>
                                        <p className="text-indigo-500 font-bold mt-5 flex justify-end gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(patient.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>

                                            <FaCircleCheck className={`${patient.isDone? "text-green-500 ":"text-yellow-500 "}  `}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
                {   
                    searchTerm !==''&&
                    patientDataFromDB.length>0 && 
                        patientDataFromDB.map((patient,index)=>(
                            patient.name.toLowerCase().includes(searchTerm)&& patient.isDone &&
                            <div key={index} className="w-full p-3 rounded-xl bg-white shadow-lg flex gap-3 my-2">
                                <div className="w-[100px] h-[100px] bg-blue-200 " > <img src={patient.gander==='male'? maleAvatar: femaleAvatar} alt="image avatar"/></div>
                                <div className="flex justify-between w-[calc(100%-100px)] ">
                                    <div className="">
                                        <p className="text-indigo-500 font-bold mt-1">Name: <span className="text-gray-500">{patient.name}</span></p>
                                        <p className="text-indigo-500 font-bold my-2">Age: <span className="text-gray-500">{patient.age}</span></p>
                                        <p className="text-indigo-500 font-bold mb-1">Phone Number: <span className="text-gray-500">{patient.phoneNumber}</span></p>
                                    </div>
                                    <div className=" ">
                                        <p className="text-gray-500 font-bold mt-1">{patient.time}</p>
                                        <p className="text-gray-500 font-bold my-2">{patient.date}</p>
                                        <p className="text-indigo-500 font-bold mt-5 flex justify-end gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(patient.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>

                                            <FaCircleCheck className={`${patient.isDone? "text-green-500 ":"text-yellow-500 "}  `}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
                {

                }

                {
                    searchTerm==='' && patientDataFromDB.length ===0 && <div className="text-gray-500 font-bold">No Appointment Found</div>
                }
            </div>
        );
    }

    const appointmentListForNotDone =()=>{
        return ( 
            <div className="w-[60%] p-2 h-[75vh] overflow-y-auto m-auto">
                
                

                {
                    searchTerm==='' &&
                    patientDataFromDB.length>0  &&
                        patientDataFromDB.map((patient,index)=>(
                            !patient.isDone &&
                            <div key={index} className="w-full p-3 rounded-xl bg-white shadow-lg flex gap-3 my-2">
                                <div className="w-[100px] h-[100px] bg-blue-200 " > <img src={patient.gander==='male'? maleAvatar: femaleAvatar} alt="image avatar"/></div>
                                <div className="flex justify-between w-[calc(100%-100px)] ">
                                    <div className="">
                                        <p className="text-indigo-500 font-bold mt-1">Name: <span className="text-gray-500">{patient.name}</span></p>
                                        <p className="text-indigo-500 font-bold my-2">Age: <span className="text-gray-500">{patient.age}</span></p>
                                        <p className="text-indigo-500 font-bold mb-1">Phone Number: <span className="text-gray-500">{patient.phoneNumber}</span></p>
                                    </div>
                                    <div className=" ">
                                        <p className="text-gray-500 font-bold mt-1">{patient.time}</p>
                                        <p className="text-gray-500 font-bold my-2">{patient.date}</p>
                                        <p className="text-indigo-500 font-bold mt-5 flex justify-end gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(patient.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>

                                            <FaCircleCheck className={`${patient.isDone? "text-green-500 ":"text-yellow-500 "}  `}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
                {   
                    searchTerm !==''&&
                    patientDataFromDB.length>0 && 
                        patientDataFromDB.map((patient,index)=>(
                            patient.name.toLowerCase().includes(searchTerm)&& !patient.isDone &&
                            <div key={index} className="w-full p-3 rounded-xl bg-white shadow-lg flex gap-3 my-2">
                                <div className="w-[100px] h-[100px] bg-blue-200 " > <img src={patient.gander==='male'? maleAvatar: femaleAvatar} alt="image avatar"/></div>
                                <div className="flex justify-between w-[calc(100%-100px)] ">
                                    <div className="">
                                        <p className="text-indigo-500 font-bold mt-1">Name: <span className="text-gray-500">{patient.name}</span></p>
                                        <p className="text-indigo-500 font-bold my-2">Age: <span className="text-gray-500">{patient.age}</span></p>
                                        <p className="text-indigo-500 font-bold mb-1">Phone Number: <span className="text-gray-500">{patient.phoneNumber}</span></p>
                                    </div>
                                    <div className=" ">
                                        <p className="text-gray-500 font-bold mt-1">{patient.time}</p>
                                        <p className="text-gray-500 font-bold my-2">{patient.date}</p>
                                        <p className="text-indigo-500 font-bold mt-5 flex justify-end gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(patient.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>

                                            <FaCircleCheck className={`${patient.isDone? "text-green-500 ":"text-yellow-500 "}  `}/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                }
                {

                }

                {
                    searchTerm==='' && patientDataFromDB.length ===0 && <div className="text-gray-500 font-bold">No Appointment Found</div>
                }
            </div>
        );
    }


    return(
        <div>
            {titleBar()}
            {navBar()}
            <hr className="m-auto w-[80%] my-4 text-indigo-500 text-xl"/>
            {appointmentType==='all' && appointmentList()}
            {appointmentType==='done' && appointmentListForDone()}
            {appointmentType==='not done' && appointmentListForNotDone()}
        </div>
    );
}