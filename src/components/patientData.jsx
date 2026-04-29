import React,{useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFirstAid, FaCalendar, FaWallet, FaPlus, FaTimes, FaTrash, FaPen, FaReceipt, FaCoins, FaCheckCircle, FaPlusCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { MdAssignment, MdWarning } from "react-icons/md"; 
import { db } from "../config/firebase";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import maleAvatar from '../image/Screenshot 2026-04-25 223920.png'
import femaleAvatar from '../image/Screenshot 2026-04-25 223955.png'

import { FaCirclePlus } from "react-icons/fa6";

export default function PatientData() {
    const navigate = useNavigate();
    const location = useLocation();
    const treatmentsCollectionRef = collection(db,'treatments');
    const patient = location.state?.patient;


    const [navBarType, setNavBarType]= useState('treatments'); // مشان نعرف نوع القسم اللي لازم يضهر على القسم اليميني من الشاشة وقت منضغط على ازرار شريط التنقل اللي موجود بالجهة اليمينية 
    const [visitsType, setVisitsType]= useState('all')

    const [isAdd , setIsAdd] = useState(false); // مشان نعرف اذا ضغطنا على زر اضافة معالجة
    const [isUpdateTreatment, setIsUpdateTreatment]= useState(false) // مشان نعرف اذا ضغطنا على زر التعديل القلم
    const [isAddPayment, setIsAddPayment] = useState(false) // مشان نعرف اذا ضغطنا على زر اضافة دفعة
    const [isDeletingRecord, setIsDeletingRecord]= useState(false)
    const [isUpdateRecord, setIsUpdateRecord]= useState(false)
    const [isAddApointment, setIsAddApointment]= useState(false)
    const [isUpdateAppointment, setIsUpdateAppointment]= useState(false)

    const [totalPayment, setTotalPayment]= useState(''); // بيحتوي على الدفع الكلي اللي عالزبون
    const [totalPaid, setTotalPaid]= useState(''); // بتحتوي على قيمة الدفعات الكلية 

    const [newTreatmentData, setNewTreatmentData]= useState({
        tooth:'',
        cost:'',
        treatmentType:'',
        isDone:false,
        patientName:location.state?.name,
        patientID:location.state?.id,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
    }) // مخزن البيانات المعالجة اللي بدنا نضيفا جديدة وبياخد قيم من حقول الادخال
    const [treatmentDataFromDB, setTreatmentDataFromDB]= useState([]);// مخزن المعالجات وقت منجيبون من الباك
    const [updateTreatmentData, setUpdateTreatmentData]= useState({}) // بيحتوي على بيانات الكائن المعدل
    const [paymentDataFromDB, setPaymentDataFormDB]= useState([]); // بتحتي على بيانات الدفعات المتعلقة بالمريض 
    const [appointmentsFromDB, setAppointmentsFromDb]= useState([])

    const [newPayment, setNewPayment]= useState({
        patientName:patient.name,
        patientID:patient.id,
        year:new Date().getFullYear(),
        month:new Date().getMonth()+1,
        day: new Date().getDate(),
        hour: new Date().getHours(),
        minutes: new Date().getMinutes(),
    }); // بيحتوي على الدفعة الجديدة
    const [newRecordData, setNewRecordData ]=useState({
        ...patient
    })// بيحتوي على بيانات السجل اللي بدنا نعدلو
    const [newAppointment , setNewAppointment] = useState({
        name:patient.name,
        age:patient.age,
        phoneNumber:patient.phoneNumber,
        gander: patient.gander,
        patientID:patient.id,
        date:'',
        time:'',
        details:'',
        isDone:false,

    })// بيحتوي قيم الموعد اللي بدنا نضيفو
    const [newAppointmentForUpdate, setNewAppointmentForUpdate] = useState({})// بيحتوي قيم الموعد اللي بدنا نعدلو

    useEffect(()=>{
        getTreatmentDataFromDB();
        getPaymentFromDB();
        getAppointmentsFromDB();
    },[])

    const getTreatmentDataFromDB= async ()=>{
        let totalPaymentFromTreatments = 0;
        try{
            const data= await getDocs(treatmentsCollectionRef);
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            const filteredDataByPatientID = filteredData.filter((treatment)=> treatment.patientID === patient.id);

            filteredDataByPatientID.map((treatment)=> totalPaymentFromTreatments+=parseFloat(treatment.cost))
            
            setTotalPayment(totalPaymentFromTreatments)
            setTreatmentDataFromDB(filteredDataByPatientID);
        }catch(err){
            console.log(err)
        }
    }// تابع خاص بجلب المعالجات من الباك

    const getPaymentFromDB = async ()=>{
        let getTotalPaymentFromPayment =0 ;
        try{
            const data = await getDocs(collection(db,'paid'));
            const filteredData = data.docs.map((doc)=>({...doc.data(), id:doc.id}));
            const filteredDataByPatientID = filteredData.filter((payment)=> payment.patientID === patient.id );
            filteredDataByPatientID.map((payment)=> getTotalPaymentFromPayment+= parseFloat(payment.pay) );
            setTotalPaid(getTotalPaymentFromPayment);
            setPaymentDataFormDB(filteredDataByPatientID);
        }catch(err){
            console.log(err)
        }
    }// الفورم الخاص بجيب الدفعات المتعلقة بالمريض

    const getAppointmentsFromDB = async()=>{
        try{
            const data = await getDocs(collection(db,'appointments'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}))
            const filteredDataByPatientID = filteredData.filter((appointment)=> appointment.patientID === patient.id)
            setAppointmentsFromDb(filteredDataByPatientID)
        }catch(err){
            console.log(err)
        }
    }//خاص بجلب المواعيد المتعلقة بالمريض

    const titleBar = ()=>{
        return (
            <div className=" bg-indigo-500 flex items-center text-white">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold"> {patient.name.toUpperCase()} Data</h1>
            </div>
        );
    }// بيحتوي على اسم القسم وبيحتوي على زر رجوع
    const navBarInRightSide =()=>{
        return (
            <div className="bg-white p-3 flex justify-center gap-3 rounded-xl">
                
                <div onClick={()=>setNavBarType('treatments')} className={` ${navBarType==='treatments' && 'shadow-lg shadow-indigo-500'} w-[150px] p-4 text-center text-gray-500   rounded-xl cursor-pointer hover:shadow-lg hover:shadow-indigo-500`}>
                    <FaFirstAid className="m-auto"/>
                    <p>Treatments</p>
                </div>
                

                <div onClick={()=>setNavBarType('visits')} className={` ${navBarType==='visits' && 'shadow-lg shadow-indigo-500'} w-[150px] p-4 text-center text-gray-500   rounded-xl cursor-pointer hover:shadow-lg hover:shadow-indigo-500`}>
                    <FaCalendar className="m-auto"/>
                    <p>Visits</p>
                </div>
                

                <div onClick={()=>setNavBarType('payments')} className={` ${navBarType==='payments' && 'shadow-lg shadow-indigo-500'} w-[150px] p-4 text-center text-gray-500   rounded-xl cursor-pointer hover:shadow-lg hover:shadow-indigo-500`}>
                    <FaWallet className="m-auto"/>
                    <p>Payments</p>
                </div>
                
                
                <div onClick={()=>setNavBarType('record')} className={` ${navBarType==='record' && 'shadow-lg shadow-indigo-500'} w-[150px] p-4 text-center text-gray-500   rounded-xl cursor-pointer hover:shadow-lg hover:shadow-indigo-500`}>
                    <MdAssignment  className="m-auto"/>
                    <p>Record</p>
                </div>
                

            </div>
        );
    }// شريط التنقل في الجزء اليميني
    const sideBarInfo =()=>{
        return(
            <div className="h-full w-[300px]  p-2">
                <div className="p-5 bg-white  my-2 text-center">
                    <h1 className="text-lg font-bold text-indigo-500">{patient.name}</h1>
                    <div className="text-sm text-gray-500">{patient.gander} | Age: {patient.age}</div>
                    <div className="text-sm ">{patient.phoneNumber}</div>
                </div>
                <div className="p-5 bg-white  mt-2">
                    <h1 className="text-indigo-500 text-xl font-bold border-b-2 border-gray-500 pb-3">Payment report</h1>
                    <p className="font-bold py-2">Total payment: {totalPayment || 0}$</p>
                    <p className="text-green-500 font-bold py-2">Paid: {totalPaid || 0}$</p>
                    <p className="text-red-500 font-bold py-2 text-[14px]">The remaining payment: { parseFloat(totalPayment)-parseFloat(totalPaid) || 0}$</p>
                </div>
                <div className="p-2 bg-white text-center font-bold text-sm text-gray-500 mb-2 mt-1">
                    Collection rate: {parseInt(parseFloat(totalPaid)/parseFloat(totalPayment)* 100 ) || 0} %
                </div>
            </div>
        );
    }// الجزء اليساري من الشاشة 
    const saveNewTreatment =async ()=>{
        try{
            await addDoc(treatmentsCollectionRef,newTreatmentData);
            setIsAdd(false);
            getTreatmentDataFromDB();
        }catch(err){
            console.log(err)
        }
    }// تابع بيححفظ عملية الاضافة في الباك
    const cancelNewTreatment =()=>{
        setIsAdd(false);
        setNewTreatmentData({
            tooth:'',
            cost:'',
            treatmentType:'',
            isDone:'',
            patientName:location.state?.name,
            patientID:location.state?.id,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
            hour: new Date().getHours(),
            minutes: new Date().getMinutes(),
        })
    }// بيلغي عمليه اضافة معلاج وبيخفي الفورم الخاص بعمليه اضافة المعلاجة
    const addTreatmentForm =()=>{
        return(
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsAdd(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <input  onChange={(e)=>setNewTreatmentData({...newTreatmentData, tooth:e.target.value})} type="text" placeholder="tooth..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input  onChange={(e)=>setNewTreatmentData({...newTreatmentData, cost:e.target.value})} type="text" placeholder="cost..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input  onChange={(e)=>setNewTreatmentData({...newTreatmentData, treatmentType:e.target.value})} type="text" placeholder="type of treatment..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <label className="text-indigo-500 my-3 px-2">Is Done</label>
                        <input  onChange={e=>setNewTreatmentData({...newTreatmentData,isDone:e.target.value})} type="checkbox" className="text-indigo-500 my-3"/>
                        <div className=" flex gap-3 justify-end">
                            <div onClick={saveNewTreatment} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save</div>
                            <div onClick={cancelNewTreatment} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }// الفورم الخاص باضافة معلاجة جديدة
    const deleteTreatmentHandler = async(id)=> {
        const docRef = doc(db,'treatments',id)
        try{
            console.log('shiit')
            await deleteDoc(docRef)
            getTreatmentDataFromDB();
        }catch(err){
            console.log(err)
        }
    }// تابع حذف المعالجة بيتنفز وقت منضغط على الزبالة
    const cancelUpdateTreatment =()=>{
        setIsUpdateTreatment(false);
    }// تابع بيخفي الفورم اللي مخصصة للتعديل وقت منضغط على كانسل
    const updatetreatmentHandler = async()=>{
        try{
            await updateDoc(doc(db,'treatments',updateTreatmentData.id),updateTreatmentData)
            setIsUpdateTreatment(false);
            getTreatmentDataFromDB();
        }catch(err){
            console.log(err)
        }
    }// التابع اللي بيحفظ عملية التعديل في الباك
    const updateTreatmentForm =()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsUpdateTreatment(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <input value={updateTreatmentData.tooth} onChange={(e)=>setUpdateTreatmentData({...updateTreatmentData, tooth:e.target.value})} type="text" placeholder="tooth..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={updateTreatmentData.cost} onChange={(e)=>setUpdateTreatmentData({...updateTreatmentData, cost:e.target.value})} type="text" placeholder="cost..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={updateTreatmentData.treatmentType} onChange={(e)=>setUpdateTreatmentData({...updateTreatmentData, treatmentType:e.target.value})} type="text" placeholder="type of treatment..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <label className="text-indigo-500 my-3 px-2">Is Done</label>
                        <input  value={updateTreatmentData.isDone} onChange={e=>setUpdateTreatmentData({...updateTreatmentData,isDone:e.target.value})} type="checkbox" className="text-indigo-500 my-3"/>
                        <div className=" flex gap-3 justify-end">
                            <div onClick={updatetreatmentHandler} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Update</div>
                            <div onClick={cancelUpdateTreatment} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }// الفورم اللي بيظهر وقت منضغط علة قلم التعديل في العلاج
    
    const treatmentsHandler = ()=>{
        return (
            <div className="max-h-[70vh] w-full bg-white overflow-y-auto p-2 mt-3 rounded-xl">
                <div onClick={()=>setIsAdd(true)} className="bg-indigo-500 text-white flex w-fit p-3 font-bold gap-2 items-center rounded-xl cursor-pointer hover:bg-indigo-600"><FaPlus className=""/> Treatment</div>
                <hr className="my-2 text-indigo-500 font-bold"/>
                {
                    treatmentDataFromDB.length >0 ? 
                    treatmentDataFromDB.map((treatment,index)=>(
                        <div key={index} className="w-full rounded-xl bg-gray-50 shadow-sm p-3 my-3">
                            <div className="pb-5 text-green-500 font-bold">Cost: {treatment.cost} </div>
                            <div className="py-2  font-bold">Tooth: {treatment.tooth}</div>
                            <div className="py-2  font-bold">Date: {treatment.day}/{treatment.month}/{treatment.year}</div>
                            <div className="flex gap-6 justify-end">
                                <FaPen onClick={()=>(setIsUpdateTreatment(true),setUpdateTreatmentData({...treatment,id:treatment.id}))} className="text-yellow-500 cursor-pointer hover:text-yellow-600 "/>
                                <FaTrash onClick={()=>deleteTreatmentHandler(treatment.id)} className="text-red-500 cursor-pointer hover:text-red-600"/>
                            </div>
                        </div>
                    )):<div className="font-bold text-gray-500 p-2">No Treatments Found</div>
                }
            </div>
        );
    }// الجزء اللي بيطلع وقت منضغط على العلاجات

    const addPayHandler = async()=>{
        try{
            await addDoc(collection(db,'paid'),{...newPayment,year:new Date().getFullYear(),
                month:new Date().getMonth()+1,
                day: new Date().getDate(),
                hour: new Date().getHours(),
                minutes: new Date().getMinutes(),}
            );
            setIsAddPayment(false)
            getPaymentFromDB();
        }catch(err){
            console.log(err)
        }
    } // 

    const addPayForm =()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsAddPayment(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <input onChange={(e)=>setNewPayment({...newPayment, pay:e.target.value})} type="text" placeholder="New payment..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>

                        <div className=" flex gap-3 justify-end">
                            <div onClick={addPayHandler} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save</div>
                            <div onClick={()=>setIsAddPayment(false)} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }// الفورم اللي بيظهر وقت نضغط على زر اضافة دفعة


    const paymentHandler =()=>{
        return(
            <div className="w-full  ">
                <div className="bg-white p-2 mt-3 w-full  rounded-xl flex justify-evenly">
                    <div className="bg-gray-50 shadow-sm p-3 rounded-xl w-[32%]">
                        <FaCoins className="text-red-500 my-3"/>
                        <p className="text-[12px] text-gray-500 ">The remaining payment</p>
                        <p className="font-bold text-2xl text-red-500">{ parseFloat(totalPayment)-parseFloat(totalPaid) || 0}$</p>
                    </div>
                    <div className="bg-gray-50 shadow-sm p-3 rounded-xl w-[32%]">
                        <FaWallet className="text-green-500 my-3"/>
                        <p className="text-[12px] text-gray-500 ">Paid</p>
                        <p className="font-bold text-2xl text-green-500">{totalPaid || 0}$</p>
                    </div>
                    <div className="bg-gray-50 shadow-sm p-3 rounded-xl w-[32%]">
                        <FaReceipt className=" my-3"/>
                        <p className="text-[12px] text-gray-500 ">Total Payment</p>
                        <p className="font-bold text-2xl ">{totalPayment || 0}$</p>
                    </div>
                </div>
                <div className="bg-white w-full  rounded-xl p-3 my-1 flex justify-between ">
                    <p className="text-gray-500 "> Collection rate</p>
                    <p className="text-xl font-bold mr-[30px] text-indigo-500"> {parseInt(parseFloat(totalPaid)/parseFloat(totalPayment)* 100 ) || 0}%</p>
                </div>
                <div className="h-[40vh] bg-white w-full  rounded-xl p-3 my-1 overflow-y-auto">
                    <FaPlusCircle onClick={()=>setIsAddPayment(true)} className="text-2xl text-green-500 cursor-pointer hover:text-green-700" />
                    {
                        paymentDataFromDB.length >0 ? 
                            paymentDataFromDB.map((payment,index)=>(
                                <div key={index} className="flex justify-between items-center gap-5 p-3 my-2 rounded-xl bg-gray-100 shadow-sm ">
                                    <div>
                                        <p className="font-bold ">Paid: {payment.pay}$</p>
                                        <p className="font-[12px] text-gray-500 ml-5">{payment.day}/{payment.month}/{payment.year}  |  {payment.hour}:{payment.minutes}</p>
                                    </div>
                                    <FaCheckCircle className="text-green-500"/>
                                </div>
                            )):<div className="text-gray-500 font-bold p-3">No Payment Found</div>

                    }
                </div>
            </div>
        );
    } // الجزء اللي بيطلع وقت بضغط على زر payments

    const startDeleteHandler = async()=>{
        try{
            await deleteDoc(doc(db,'patients', patient.id))
            setIsDeletingRecord(false);
            navigate(-1)
        }catch(err){
            console.log(err)
        }
    }// تابع حذف سجل مريض
    const deleteRecordForm =()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"> 
                        <p className="font-bold text-xl flex gap-3 items-center my-5">You are deleting this patient <MdWarning className="text-red-600"/> </p>
                        <div className=" flex gap-3 justify-evenly mt-10 mb-5 ">
                            <div onClick={startDeleteHandler} className=" w-fit p-3 rounded-lg bg-red-500 text-white font-bold cursor-pointer shadow-lg hover:bg-red-600" >Start Delete</div>
                            <div onClick={()=>setIsDeletingRecord(false)} className=" w-fit p-3 rounded-lg bg-gray-500 text-white cursor-pointer shadow-lg hover:bg-gray-600" >Cancel delete</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } // فورم بيطلع وقت منعطي امر حذف متل تنبيه
    const updateRecordHandler = async()=>{
        try{
            await updateDoc(doc(db,'patients',patient.id),newRecordData);
            setIsUpdateRecord(false);
            navigate(-1);
        }catch(err){
            console.log(err)
        }
    } // التابع اللي بيحفظ التعديل
    const updateRecordForm =()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsUpdateRecord(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <input value={newRecordData.name} onChange={(e)=>setNewRecordData({...newRecordData, name:e.target.value})} type="text" placeholder="New Name..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={newRecordData.age} onChange={(e)=>setNewRecordData({...newRecordData, age:e.target.value})} type="text" placeholder="New age..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <label >male </label>
                        <input checked={newRecordData.gander==='male'   } onClick={(e)=>e.target.checked? setNewRecordData({...newRecordData, gander:'male'}):null} type="checkbox" />
                        <label className="ml-3">female </label>
                        <input checked={newRecordData.gander==='female'   } onClick={(e)=>e.target.checked? setNewRecordData({...newRecordData, gander:'female'}):null} type="checkbox" />
                        <input value={newRecordData.phoneNumber} onChange={(e)=>setNewRecordData({...newRecordData, phoneNumber:e.target.value})} type="text" placeholder="New phone Number..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={newRecordData.treatmentType} onChange={(e)=>setNewRecordData({...newRecordData, treatmentType:e.target.value})} type="text" placeholder="New type of treatment..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={newRecordData.treatmentComments} onChange={(e)=>setNewRecordData({...newRecordData, treatmentComments:e.target.value})} type="text" placeholder="New Comments..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={newRecordData.chronicDiseases} onChange={(e)=>setNewRecordData({...newRecordData, chronicDiseases:e.target.value})} type="text" placeholder="New Chronic Diseases..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={newRecordData.continuousMedications} onChange={(e)=>setNewRecordData({...newRecordData, continuousMedications:e.target.value})} type="text" placeholder="New Continuous Medications..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>

                        <div className=" flex gap-3 justify-end">
                            <div onClick={updateRecordHandler} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Update</div>
                            <div onClick={()=>setIsUpdateRecord(false)} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } // الفورم الخاص بتعديل السجل
    const recordHandler =()=>{
        return(
            <div className="max-h-[70vh] w-full bg-white  p-2 mt-3 rounded-xl">
                <div className="flex gap-3 p-1 justify-end ">
                    <div onClick={()=>setIsUpdateRecord(true)} className="bg-indigo-500 rounded-xl p-3 text-white font-bold flex gap-2 items-center cursor-pointer hover:bg-indigo-600">Update <FaPen /></div>
                    <div onClick={()=>setIsDeletingRecord(true)} className="bg-red-500 rounded-xl p-3 text-white font-bold  flex gap-2 items-center cursor-pointer hover:bg-red-600">Delete <FaTrash /></div>
                </div>
                <hr className="my-2 text-indigo-500 font-bold"/>
                <div className=" h-[55vh] overflow-y-auto flex justify-between items-center">
                    <div className="h-[55vh] w-[58%]  overflow-y-auto">
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Patient Name:</span> {patient.name}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Patient Age:</span> {patient.age}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Patient gander:</span> {patient.gander}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Phone Number:</span> {patient.phoneNumber}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Type Of Treatment:</span> {patient.treatmentType}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Comments:</span> {patient.treatmentComments}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Chronic Diseases:</span> {patient.chronicDiseases}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold ">Continuous Medications:</span> {patient.continuousMedications}</div>
                        <div className=" my-3"><span className="text-indigo-500 font-bold "> {patient.day}/{patient.month}/{patient.year}</span> | <span className="text-indigo-500 font-bold my-2"> {patient.hour}:{patient.minutes}</span></div>
                    </div>
                    <div className="sticky w-[40%] h-[50vh] ">
                        {patient.gander==='male'? <img src={maleAvatar} alt="male img" className="m-auto mt-5" /> : <img src={femaleAvatar} alt="female img" className="m-auto mt-5" />}
                    </div>
                </div>
            </div>
        );
    } // خاص بعرض سجل المريض 
    const addAppointmentHandler = async ()=>{
        try{
            await addDoc(collection(db,'appointments'),newAppointment,)
            setIsAddApointment(false);
            getAppointmentsFromDB()
        }catch(err){
            console.log(err)
        }
    }// تابع حفظ الموعد في الباك
    const addApointmentForm =()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsAddApointment(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        
                        <input onChange={(e)=>setNewAppointment({...newAppointment,date:e.target.value,year:e.target.valueAsDate.getFullYear(),month:e.target.valueAsDate.getMonth()+1,day:e.target.valueAsDate.getDate()})} type="date" className="bg-gray-300 p-3 text-indigo-500 rounded-xl mr-5 my-2"/>
                        <input onChange={e=>setNewAppointment({...newAppointment,time:e.target.value})} type="time" className="bg-gray-300 p-3 text-indigo-500 rounded-xl ml-5 my-2"/>
                        <input onChange={(e)=>setNewAppointment({...newAppointment, details:e.target.value})} type="text" placeholder="Details..." className=" p-2  shadow-lg w-full outline-none border-1 border-indigo-300 text-indigo-500 my-3"/>
                        <label className="text-indigo-500 font-bold mx-2">Done</label>
                        <input onChange={e=>setNewAppointment({...newAppointment,isDone:e.target.value})} type="checkbox" />
                        <div className=" flex gap-3 justify-end">
                            <div onClick={addAppointmentHandler} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save</div>
                            <div onClick={()=>setIsAddApointment(false)} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }// الفورم الخاص باضافة موعد

    const deleteAppointmentHandler = async(id)=>{
        try{
            await deleteDoc(doc(db,'appointments',id))
            getAppointmentsFromDB();
        }catch(err){
            console.log(err)
        }
    }// تابع خاص بحذف موعد
    const updateAppointmentHandler = async()=>{
        try{
            await updateDoc(doc(db,'appointments',newAppointmentForUpdate.id),newAppointmentForUpdate)
            setIsUpdateAppointment(false);
            getAppointmentsFromDB();
        }catch(err){
            console.log(err)
        }
    }// تابع خاص بتعديل الموعد
    const updateAppointmentForm =()=>{
        return(
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsUpdateAppointment(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <input value={newAppointmentForUpdate.date} onChange={(e)=>setNewAppointmentForUpdate({...newAppointmentForUpdate, date:e.target.value})} type="date"  className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={newAppointmentForUpdate.time} onChange={(e)=>setNewAppointmentForUpdate({...newAppointmentForUpdate, time:e.target.value})} type="time"  className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <label className="text-indigo-500 font-bold mx-2">Done</label>
                        <input checked={newAppointmentForUpdate.isDone} onChange={e=>setNewAppointmentForUpdate({...newAppointmentForUpdate,isDone:e.target.value})} type="checkbox" />
                        <div className=" flex gap-3 justify-end">
                            <div onClick={updateAppointmentHandler} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Update</div>
                            <div onClick={()=>setIsUpdateAppointment(false)} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }// الفورم الخاص بتعديل موعد
    const visitsHandler = ()=>{
        
        return (
            <div className="max-h-[70vh] w-full bg-white  p-2 mt-3 rounded-xl">
                <div className="flex justify-between">
                    <p className="text-gray-500 text-xl font-bold mx-3">Visits Record</p>
                    <FaCirclePlus onClick={()=>setIsAddApointment(true)} className="text-3xl text-green-500 mx-3 hover:text-green-600 cursor-pointer"/>
                </div>
                <div className="flex justify-end my-2 ">
                    <p onClick={()=>setVisitsType('all')} className={`${visitsType==='all' ? 'bg-indigo-500/30 ':'border-1 border-gray-300'} text-gray-500 p-2 rounded-xl  m-1 cursor-pointer`}>All</p>
                    <p onClick={()=>setVisitsType('done')} className={`${visitsType==='done' ? 'bg-indigo-500/30 ':'border-1 border-gray-300'} text-gray-500 p-2 rounded-xl  m-1 cursor-pointer`}>Done</p>
                    <p onClick={()=>setVisitsType('not done')} className={`${visitsType==='not done' ? 'bg-indigo-500/30 ':'border-1 border-gray-300'} text-gray-500 p-2 rounded-xl  m-1 cursor-pointer`}>Not Done</p>
                </div>
                <hr className="my-2 text-indigo-500 font-bold"/>
                <div className="overflow-y-auto h-[50vh]">
                    {
                        visitsType==='all' &&(
                            appointmentsFromDB.length > 0 ?
                                appointmentsFromDB.map((appointment,index)=>(
                                    <div key={index} className="bg-blue-200 p-4 rounded-xl m-1 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <FaClock className="text-indigo-500 text-xl"/>
                                            <div className="font-bold">Appointment: {appointment.date} | {appointment.time}</div>
                                        </div>
                                        <div className="flex gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(appointment.id)} className="text-red-500 hover:text-red-600 cursor-pointer"/>
                                            <FaPen onClick={()=>(setIsUpdateAppointment(true), setNewAppointmentForUpdate({...appointment}))} className="text-yellow-500 hover:text-yellow-600 cursor-pointer"/>
                                            {appointment.isDone ? <FaCheckCircle className="text-green-500"/>:<FaTimesCircle className="text-gray-500" />}
                                        </div>
                                    </div>
                                )):
                                <div className="text-2xl text-gray-500 font-bold p-3">No Appointment Found</div>
                        )
                    }
                    {
                        visitsType==='done' &&(
                            appointmentsFromDB.length > 0 ?
                                appointmentsFromDB.map((appointment,index)=>(
                                    appointment.isDone &&
                                    <div key={index} className="bg-blue-200 p-4 rounded-xl m-1 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <FaClock className="text-indigo-500 text-xl"/>
                                            <div className="font-bold">Appointment: {appointment.date} | {appointment.time}</div>
                                        </div>
                                        <div className="flex gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(appointment.id)} className="text-red-500 hover:text-red-600 cursor-pointer"/>
                                            <FaPen onClick={()=>(setIsUpdateAppointment(true), setNewAppointmentForUpdate({...appointment}))} className="text-yellow-500 hover:text-yellow-600 cursor-pointer"/>
                                            {appointment.isDone ? <FaCheckCircle className="text-green-500"/>:<FaTimesCircle className="text-gray-500" />}
                                        </div>
                                    </div>
                                )):
                                <div className="text-2xl text-gray-500 font-bold p-3">No Appointment Found</div>
                        )
                    }
                    {
                        visitsType==='not done' &&(
                            appointmentsFromDB.length > 0 ?
                                appointmentsFromDB.map((appointment,index)=>(
                                    !appointment.isDone &&
                                    <div key={index} className="bg-blue-200 p-4 rounded-xl m-1 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <FaClock className="text-indigo-500 text-xl"/>
                                            <div className="font-bold">Appointment: {appointment.date} | {appointment.time}</div>
                                        </div>
                                        <div className="flex gap-5">
                                            <FaTrash onClick={()=>deleteAppointmentHandler(appointment.id)} className="text-red-500 hover:text-red-600 cursor-pointer"/>
                                            <FaPen onClick={()=>(setIsUpdateAppointment(true), setNewAppointmentForUpdate({...appointment}))} className="text-yellow-500 hover:text-yellow-600 cursor-pointer"/>
                                            {appointment.isDone ? <FaCheckCircle className="text-green-500"/>:<FaTimesCircle className="text-gray-500" />}
                                        </div>
                                    </div>
                                )):
                                <div className="text-2xl text-gray-500 font-bold p-3">No Appointment Found</div>
                        )
                    }

                </div>
            </div>
        );
    }// خاص بعرض سجل الزيارات وقت منضغط على زر الزيارات 

    const rightSide = ()=>{
        return (
            <div className="h-full w-[calc(100%-310px)]  p-2">
                {navBarInRightSide()}
                {navBarType==='treatments' && treatmentsHandler()}
                {navBarType==='payments' && paymentHandler()}
                {navBarType=== 'record' && recordHandler()}
                {navBarType=== 'visits' && visitsHandler()}
            </div>

        );
    }// الجزء الايمن من الشاشة بيحتوي على النافبار

    

    return(
        <div className="relative">
            {titleBar()}
            <div className="w-full h-[90vh] bg-gray-200 flex justify-between">
                {sideBarInfo()}
                {rightSide()}
            </div>
            {isAdd && addTreatmentForm()}
            {isUpdateTreatment && updateTreatmentForm()}
            {isAddPayment && addPayForm()}
            {isDeletingRecord && deleteRecordForm() }
            {isUpdateRecord && updateRecordForm()}
            {isAddApointment && addApointmentForm()}
            {isUpdateAppointment && updateAppointmentForm()}
        </div>
    );
}