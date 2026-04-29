import React,{useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { db } from "../config/firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function AddAppointment(){
    const navigate = useNavigate();
    const [patientsFromDB, setPatientFromDB] = useState([]);
    const [activeSaveButton, setActiveSaveButton] =useState(false)
    const [newAppointment, setNewAppointment] = useState({
        name:'',
        age:'',
        phoneNumber:'',
        gander: '',
        patientID:'',
        date:'',
        time:'',
        details:'',
        isDone:false,
        year:'',
        month:'',
        day:'',
    })


    useEffect(()=>{
        getPatientFromDB();
    },[])

    const getPatientFromDB = async ()=>{
        try{
            const data = await getDocs(collection(db,'patients'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            setPatientFromDB(filteredData);
        }catch(err){
            console.log(err)
        }
    }

    const titleBar = ()=>{
        return (
            <div className=" bg-indigo-500 flex items-center text-white mb-2">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold">Add Appointment</h1>
            </div>
        );
    }// بيحتوي على اسم القسم وبيحتوي على زر رجوع

    const addAppointmentHandler = async ()=>{
        try{
            await addDoc(collection(db,'appointments'),newAppointment);
            setNewAppointment({
                name:'',
                age:'',
                phoneNumber:'',
                gander: '',
                patientID:'',
                date:'',
                time:'',
                details:'',
                isDone:false,
                year:'',
                month:'',
                day:'',
            })
            navigate(-1);

        }catch(err){
            console.log(err)
        }
    }// تابع حفظ الموعد في الباك
    
    const getPatientData= async(id)=>{
        console.log(id)
        try{
            const data = await getDocs(collection(db,'patients'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            console.log(filteredData)
            const patientData = filteredData.filter((patient)=> patient.id === id);
            console.log(patientData)
            setNewAppointment({...newAppointment,
                name:patientData[0].name,
                age:patientData[0].age,
                phoneNumber:patientData[0].phoneNumber,
                gander:patientData[0].gander, 
                patientID:patientData[0].id
            })
            
            setActiveSaveButton(true)
        }catch(err){
            console.log(err)
        }
    } // تابع بجيب معلومات المريض اللي اخترنا اسمو

    const addappointmentForm =()=>{
        return(
            <div className="bg-white shadow-lg px-4 py-8 mt-[50px]  w-[30%] max-h-[90vh] m-auto rounded-xl">
                <label className='text-gray-500 font-bold'>Name</label>
                <select onChange={()=>(event.target.value===''? setActiveSaveButton(false):getPatientData(event.target.value) )}  className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400">
                    <option value="">Select Patient</option>
                    {
                        patientsFromDB.length>0 && 
                            patientsFromDB.map((patient,index)=>(
                                <option 
                                    key={index}
                                    value={patient.id}
                                >{patient.name}</option>
                            ))
                    }
                </select>
                <label  className='text-gray-500 font-bold'>Date</label>
                <input onChange={(e)=>setNewAppointment({...newAppointment,date:e.target.value,year:e.target.valueAsDate.getFullYear(),month:e.target.valueAsDate.getMonth()+1,day:e.target.valueAsDate.getDate()})} type='date' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400" />
                <label className='text-gray-500 font-bold'>Time</label>
                <input onChange={(e)=>setNewAppointment({...newAppointment,time:e.target.value})} type='time' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400" />
                <label className='text-gray-500 font-bold'>Details</label>
                <input onChange={(e)=>setNewAppointment({...newAppointment,details:e.target.value})} type='text' placeholder='Details...' className="w-full bg-gray-100 outline-none p-2 my-2 text-indigo-400" />
                
                <div className=" flex gap-3 justify-end">
                    {
                        activeSaveButton? 
                            <div onClick={addAppointmentHandler} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save</div>:
                            <div  className=" w-fit p-3 rounded-lg bg-gray-200 text-gray-500  shadow-lg " >Plaese select Patient Name</div>
                        
                        }
                    <div onClick={()=>navigate(-1)} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                </div>

            </div>
        );
    }

    return (
        <div className='bg-gray-200 h-screen'>
            {titleBar()}
            {addappointmentForm()}
        </div>
    );
}