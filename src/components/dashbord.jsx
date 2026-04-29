import SideBar from "./sideBar";
import Store from "./smartStore";
import { FaHome, FaPlus, FaSearch, FaCalendar, FaTrash } from "react-icons/fa";
import { FaPersonCirclePlus,FaFileInvoiceDollar , FaCalendarMinus, FaFilterCircleDollar, FaCircleDollarToSlot, FaCircleCheck } from "react-icons/fa6";
import { MdGroup ,MdTrendingUp, MdAttachMoney, MdEdit, MdEditNote, MdWarning } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import femaleAvatar from '../image/Screenshot 2026-04-25 223955.png'
import maleAvatar from '../image/Screenshot 2026-04-25 223920.png'

export default function Dashboard() {
    const navigate = useNavigate()
    const categoriesCollectionRef = collection(db,'category');


    const [smartStoreList, setSmartStoreList]=useState([])//مخزن الموارد الناقصة
    const [appointmentsForToday, setAppointmentsForToday]= useState([]); // مخزن المواعيد اللي بتنتمي لليوم الحالي
    const [patientDataFromDB, setPatientDataFromDB]= useState([]);// جبنا المرضى مشان نعرف عددون مشان نظهرو بشريط التنقل



    const [searchTerm, setSearchTerm]= useState('');
    const [visitForThisMonth, setVisitForThisMonth]=useState(0);
    const [dailyIncoming, setDailyIncoming]=useState(0)
    const [monthlyIncoming, setMonthlyIncoming]=useState(0)
    const [totalIncomingFromDB, setTotalIncomingFromDB]=useState(0);
    const [totalValueOfWorkPerformed, setTotalValueOfWorkPerformed] = useState(0)

    useEffect(()=>{
        getCategories();
        getAppointmentsFromDB();
        getPatientDataFromDB();
        getIncomingFromDB();
        getTreatmentsFromDB();
    },[])

    const getCategories = async ()=>{
        try{
            const data = await getDocs(categoriesCollectionRef);
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            const filteredByOutOfStock = filteredData.filter((category)=> category.amount <= category.warningAt)
            setSmartStoreList(filteredByOutOfStock)
        }catch(err){
            console.log(err)
        }
    }

    const getPatientDataFromDB =async ()=>{
        try{
            const data = await getDocs(collection(db,'patients'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            setPatientDataFromDB(filteredData);
        }catch(err){
            console.log(err)
        }
    }

    const getAppointmentsFromDB =async ()=>{
        let monthlyVisit = 0;
        try{
            const data =await getDocs(collection(db,'appointments'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            const filteredDataByTodayAppointments = filteredData.filter((appointment)=>
                parseInt(appointment.year)===parseInt(new Date().getFullYear()) && parseInt(appointment.month) === parseInt(new Date().getMonth()+1) && parseInt(appointment.day) === parseInt(new Date().getDate())
            )
            filteredData.map((appointment)=>
                (parseInt(appointment.year)===parseInt(new Date().getFullYear()) && parseInt(appointment.month) === parseInt(new Date().getMonth()+1) ) ? monthlyVisit+=1:null
            )
            setVisitForThisMonth(monthlyVisit)
            setAppointmentsForToday(filteredDataByTodayAppointments);
        }catch(err){
            console.log(err);
        }
    }

    const getIncomingFromDB=async()=>{
        let dailyIncom=0;
        let monthlyIncome=0;
        let totalIncoming=0;
        try{
            const data = await getDocs(collection(db,'paid'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            filteredData.map((income)=>(
                (parseInt(income.year)===parseInt(new Date().getFullYear()) && parseInt(income.month) === parseInt(new Date().getMonth()+1) ) ? monthlyIncome+=parseInt(income.pay) :null,
                (parseInt(income.year)===parseInt(new Date().getFullYear()) && parseInt(income.month) === parseInt(new Date().getMonth()+1) && parseInt(income.day) === parseInt(new Date().getDate()) ) ? dailyIncom+=parseInt(income.pay) :null,
                totalIncoming+=parseFloat(income.pay)
            ))
            setDailyIncoming(dailyIncom);
            setMonthlyIncoming(monthlyIncome);
            setTotalIncomingFromDB(totalIncoming)
        }catch(err){
            console.log(err)
        }
    }

    const getTreatmentsFromDB=async()=>{
        let totalCostOfTreatments=0;
        try{
            const data = await getDocs(collection(db,'treatments'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            filteredData.map((treatment)=>totalCostOfTreatments+=parseFloat(treatment.cost))
            setTotalValueOfWorkPerformed(totalCostOfTreatments);
        }catch(err){
            console.log(err)
        }
    }

    const navBar =()=>{
        return (
            <div className="flex  justify-center gap-2 py-3">
                <div className="bg-red-800 w-[175px] h-[100px] rounded-xl flex p-2 ">
                    <div className="w-full h-full p-2">
                        <p className="text-white">Total Debts</p>
                        <p className="text-xl font-bold pl-2 pt-2">{totalValueOfWorkPerformed-totalIncomingFromDB}$</p>
                    </div>
                    <FaFileInvoiceDollar className="h-full text-2xl text-white text-indigo-500"/>
                </div>

                <div className="bg-indigo-200 w-[175px]  h-[100px]  rounded-xl flex  pt-2 p-1 border-2 border-indigo-500">
                    <div className="w-full h-full p-2">
                        <p className="text-gray-500 text-[15px]">patient records</p>
                        <p className="text-4xl pl-2 pt-2">{patientDataFromDB.length}</p>
                    </div>
                    <MdGroup className="h-full text-5xl text-indigo-500"/>
                </div>
                <div className="bg-indigo-200 w-[175px] h-[100px]  rounded-xl flex p-2 border-2 border-indigo-500">
                    <div className="w-full h-full p-2">
                        <p className="text-gray-500 text-[15px]">Monthly visits</p>
                        <p className="text-4xl pl-2 pt-2">{visitForThisMonth}</p>
                    </div>
                    <FaCalendarMinus className="h-full text-3xl text-indigo-500 "/>
                </div>

                
                <div className="bg-indigo-200 w-[175px] h-[100px]  rounded-xl flex p-2 border-2 border-indigo-500">
                    <div className="w-full h-full p-2">
                        <p className="text-gray-500 text-[15px]">Daily income</p>
                        <p className="text-xl pl-2 pt-2 font-bold">{dailyIncoming}$</p>
                    </div>
                    <MdAttachMoney className="h-full text-6xl text-indigo-500 "/>
                </div>

                <div className="bg-indigo-200 w-[175px] h-[100px] rounded-xl flex p-2 border-2 border-indigo-500">
                    <div className="w-full h-full p-2">
                        <p className="text-gray-500 text-[14px]">Monthly income</p>
                        <p className="text-xl pl-2 pt-2 font-bold">{monthlyIncoming}$</p>
                    </div>
                    <MdTrendingUp className="h-full text-3xl text-indigo-500 "/>
                </div>
            </div>
        );
    }

    const smartStore =()=>{
        return (
            <div className=" h-full w-[45%] rounded-xl ">
                <h1 className=" text-center p-3 text-indigo-500 text-xl font-bold">Smart Store</h1>
                <div onClick={()=>navigate('/home/smartstore')} className="bg-indigo-300  py-3 px-5 rounded-2xl mb-2 text-center text-indigo-600 hover:bg-indigo-400 cursor-pointer">Show Store</div>
                <div className="bg-gray-200 shadow-lg h-[300px] overflow-y-auto rounded-2xl ">
                    
                    {
                        smartStoreList.map((category)=>(
                            <div key={category.id} className="bg-white py-2 px-5 m-2 rounded-xl flex justify-between items-center">
                                <div className="font-bold "> {category.title} | <span className="pl-3 text-red-500">{ category.amount}</span></div>
                                <MdWarning className="text-3xl  text-yellow-500" />
                            </div>
                        ))
                    }

                </div>
                
            </div>
        );
    }

    const updateAppointmentHandler =async (id)=>{
        try{
            await updateDoc(doc(db,'appointments',id),{isDone:true})
            getAppointmentsFromDB()
        }catch(err){
            console.log(err)
        }
    }
    const patientAppointments =()=>{
        return (
            <div className=" h-full w-[45%] rounded-xl ">
                <h1 className=" text-center p-3 text-indigo-500 text-xl font-bold">Patient Appointment</h1>
                <input 
                    type="text" 
                    placeholder="Search By Name..."
                    onChange={(e)=>setSearchTerm(e.target.value)}
                    className="w-full h-10 rounded-2xl px-3 mb-3 outline-none bg-gray-200 text-indigo-500"
                />
                <div className="bg-gray-200 shadow-lg h-[300px] overflow-y-auto rounded-2xl ">

                    {
                        searchTerm ==='' && 
                        appointmentsForToday.length >0 &&
                            appointmentsForToday.map((appointment,index)=>(
                                <div key={index} className="bg-white py-2 px-5 m-2 rounded-xl flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img src={appointment.gander==='female'? femaleAvatar:maleAvatar} alt='img avatar' className="w-[50px] h-[50px] "/>
                                        <div>
                                            <p className=" text-gray-500 font-bold">{appointment.name}</p>
                                            <p className="  text-[11px] ">{appointment.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className=" text-xl font-bold ">{appointment.time}</div>
                                        <FaCircleCheck onClick={()=>updateAppointmentHandler(appointment.id)} className={`${appointment.isDone ? 'text-green-500 hover:text-green-600': "text-red-500 hover:text-red-600"} cursor-pointer`}/>
                                    </div>
                                </div> 
                            ))
                    }
                    {   
                        searchTerm !==''&&
                        appointmentsForToday.length >0 &&
                            appointmentsForToday.map((appointment,index)=>(
                                appointment.name.toLowerCase().includes(searchTerm.trim()) &&
                                    <div key={index} className="bg-white py-2 px-5 m-2 rounded-xl flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <img src={appointment.gander==='female'? femaleAvatar:maleAvatar} alt='img avatar' className="w-[50px] h-[50px] "/>
                                            <div>
                                                <p className=" text-gray-500 font-bold">{appointment.name}</p>
                                                <p className="  text-[11px] ">{appointment.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className=" text-xl font-bold ">{appointment.time}</div>
                                            <FaCircleCheck onClick={()=>updateAppointmentHandler(appointment.id)} className={`${appointment.isDone ? 'text-green-500 hover:text-green-600': "text-red-500 hover:text-red-600"} cursor-pointer`}/>
                                        </div>
                                    </div> 
                            ))
                    }
                    { appointmentsForToday.length === 0 && <div className="p-3 text-xl font-bold text-gray-500">No Appointments Found For Today</div> }

                </div>
            </div>
        )
    }

    const footerBar = ()=>{
        return (
            <div className="w-full flex gap-3 justify-center items-center mt-4">
                <div onClick={()=>navigate('/home/addpatient')} className="text-indigo-500 w-[125px] rounded-xl shadow-2xl bg-white p-4 text-center cursor-pointer hover:bg-gray-200">
                    <p className="">Add Patient</p>
                    <FaPlus className="h-full text-xl  text-green-800 m-auto"/>
                </div>
                <div onClick={()=>navigate('/home/addappointments')} className="text-indigo-500 w-[125px] rounded-xl shadow-2xl bg-white p-4 text-center cursor-pointer hover:bg-gray-200">
                    <p className=" ">Apointment</p>
                    <FaPlus className="h-full text-xl  text-green-800 m-auto"/>
                </div>
                <div onClick={()=>navigate('/home/patientsList')} className="text-indigo-500 w-[125px] rounded-xl shadow-2xl bg-white p-4 text-center cursor-pointer hover:bg-gray-200 ">
                    <p className=" ">Patient list</p>
                    <MdGroup className="h-full text-xl  text-pink-500 m-auto"/>
                </div>
                
                <div onClick={()=>navigate('/home/appointments')}  className="text-indigo-500 w-[125px] rounded-xl shadow-2xl bg-white p-4 text-center cursor-pointer hover:bg-gray-200">
                    <p className=" ">Apointments</p>
                    <FaCalendar className="h-full text-xl  text-yellow-500 m-auto"/>
                </div>
                <div className="text-indigo-500 w-[125px] rounded-xl shadow-2xl bg-white p-4 text-center cursor-pointer hover:bg-gray-200">
                    <p className=" ">Deleted</p>
                    <FaTrash className="h-full text-xl  text-red-800 m-auto"/>
                </div>
                <div onClick={()=>navigate('/home/finance')} className="text-indigo-500 w-[125px] rounded-xl shadow-2xl bg-white p-4 text-center cursor-pointer hover:bg-gray-200">
                    <p className=" ">Finance</p>
                    <FaCircleDollarToSlot className="h-full text-xl  text-green-500 m-auto"/>
                </div>

            </div>
        )
    }

    return (
        <div className="flex">
            <SideBar />
            <div className="  h-screen w-full bg-gray-100 ">
                {navBar()}
                <div className="w-full  h-[65vh] m-auto rounded-xl mt-1 flex justify-evenly">
                    {patientAppointments()}
                    {smartStore()}
                </div>
                {footerBar()}
            </div>
        </div>
    );
}