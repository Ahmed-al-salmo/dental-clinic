import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowUp, FaArrowDown,FaPlus, FaUsers, FaBox, FaWrench, FaTimes    } from "react-icons/fa";
import { MdAccountBalance , MdTrendingUp,   } from "react-icons/md";
import { db } from "../config/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";


export default function Finance(){
    const navigate= useNavigate()

    const [isAddFinance, setIsAddFinance]= useState(false)

    const [FinanceType, setFinanceType]= useState('');
    const [newFinance, setNewFinance]= useState({
        reasonForPay:'',
        details:'',
        cost:'',
        year:'',
        month:'',
        day:'',
    })
    const [expenses, setExpenses] = useState(0)
    const [totalIncomeRecieved, setTotalIncomeRecieved] = useState(0)
    const [totalValueOfWorkPerformed, setTotalValueOfWorkPerformed] = useState(0)
    const [financeFromDB, setFinanceFromDb] = useState([]);

    useEffect(()=>{
        getFinanceFromDB();
        getPaidFromDB();
        getTreatmentsFromDB();
    },[])

    const getFinanceFromDB = async()=>{
        let totalExpenses =0;
        try{
            
            const data = await getDocs(collection(db,'finance'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            filteredData.map((finance)=>totalExpenses+=parseFloat(finance.cost))
            setFinanceFromDb(filteredData);
            setExpenses(totalExpenses)
        }catch(err){
            console.error(err)
        }
    }

    const getPaidFromDB = async()=>{
        let totalRecieved=0;
        try{
            const data = await getDocs(collection(db,'paid'));
            const filteredData = data.docs.map((doc)=>({...doc.data(),id:doc.id}));
            filteredData.map((paid)=>totalRecieved+=parseFloat(paid.pay))
            setTotalIncomeRecieved(totalRecieved);
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

    const titleBar = ()=>{
        return (
            <div className=" bg-gray-200 flex items-center text-indigo-500 border-b-2 border-indigo-500 font-bold ">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold">Finance</h1>
            </div>
        );
    }// بيحتوي على اسم القسم وبيحتوي على زر رجوع

    const naveBar =()=>{
        return (
            <div className="bg-white w-full flex reverse text-gray-500 font-bold justify-center my-1">
                <div onClick={()=>setFinanceType('one month')} className={`${FinanceType==='one month'? "bg-indigo-500 text-white":"bg-gray-200"} py-3 px-6 shadow-sm m-1 rounded-lg cursor-pointer hover:text-white hover:bg-indigo-500`}>Month</div>
                <div onClick={()=>setFinanceType('three month')} className={`${FinanceType==='three month'? "bg-indigo-500 text-white":"bg-gray-200"} py-3 px-6 shadow-sm m-1 rounded-lg cursor-pointer hover:text-white hover:bg-indigo-500`}>3 Months</div>
                <div onClick={()=>setFinanceType('six month')} className={`${FinanceType==='six month'? "bg-indigo-500 text-white":"bg-gray-200"} py-3 px-6 shadow-sm m-1 rounded-lg cursor-pointer hover:text-white hover:bg-indigo-500`}>6 Months</div>
                <div onClick={()=>setFinanceType('year')} className={`${FinanceType==='year'? "bg-indigo-500 text-white":"bg-gray-200"} py-3 px-6 shadow-sm m-1 rounded-lg cursor-pointer hover:text-white hover:bg-indigo-500`}>Year</div>
            </div>
        );
    }

    const financeReport = ()=>{
        return (
            <div className="flex flex-wrap gap-2 bg-white shadow-lg py-2 justify-evenly m-1 rounded-lg ">

                <p className="w-full px-5 font-bold">Total Profit: <span className="text-green-400 ">{totalIncomeRecieved-expenses}$</span></p>

                <div className="w-[48%] bg-gray-200 p-3 rounded-lg flex gap-3">
                    <FaArrowUp className="text-[22px] text-green-400 rotate-[45deg]"/>
                    <div className="">
                        <p className="text-gray-500 text-sm">Expenses</p>
                        <p className="font-bold text-xl">{expenses}$</p>
                    </div>
                </div>
                
                
                <div className="w-[48%] bg-gray-200 p-3 rounded-lg flex gap-3">
                    <FaArrowDown className="text-[22px] text-green-400 -rotate-[45deg]"/>
                    <div className="">
                        <p className="text-gray-500 text-sm">Income received</p>
                        <p className="font-bold text-xl">{totalIncomeRecieved}$</p>
                    </div>
                </div>
                
                
                <div className="w-[48%] bg-gray-200 p-3 rounded-lg flex gap-3">
                    <MdAccountBalance  className="text-[22px] text-green-400 "/>
                    <div className="">
                        <p className="text-gray-500 text-sm">The value of the work performed</p>
                        <p className="font-bold text-xl">{totalValueOfWorkPerformed}$</p>
                    </div>
                </div>
                
                
                <div className="w-[48%] bg-gray-200 p-3 rounded-lg flex gap-3">
                    <MdTrendingUp className="text-[22px] text-green-400 "/>
                    <div className="">
                        <p className="text-gray-500 text-sm">Result</p>
                        <p className="font-bold text-xl">{totalIncomeRecieved-expenses}$</p>
                    </div>
                </div>
                
                
                
            </div>
        );
    }
    const listOfExpenses =()=>{
        return (
            <div>
                <div className="h-[50vh]  w-full overflow-y-auto p-2 ">

                    {
                        financeFromDB.length > 0 && 
                            financeFromDB.map((finance)=>(
                                <div className="bg-white shadow-lg p-2 m-2 rounded-lg flex gap-3 justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        {finance.reasonForPay === 'tools' && <FaBox className="text-lime-400" /> }
                                        {finance.reasonForPay === 'repairs' && <FaWrench className="text-yellow-400" /> }
                                        {finance.reasonForPay === 'wage' && <FaUsers className="text-indigo-400" /> }
                                        <div>
                                            <p className="font-bold">{finance.reasonForPay}</p>
                                            <p className="text-sm text-gray-500">{finance.details}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-red-500">{finance.cost} $</div>
                                        <div className="text-sm text-gray-400">{finance.day}/{finance.month}/{finance.year}</div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
                <div onClick={()=>setIsAddFinance(true)} className="bg-indigo-500/50 py-3 px-6 mt-1 ml-2 w-fit rounded-xl shadow-lg shadow-indigo-500 font-bold flex items-center gap-3 hover:bg-indigo-500 cursor-pointer"> <FaPlus className="" /> Add Finance</div>
            </div>
        )
    }
    const saveFinanceInDB =async()=>{
        try{
            await addDoc(collection(db,'finance'),newFinance)
            setIsAddFinance(false);
            setNewFinance({
                reasonForPay:'',
                details:'',
                cost:'',
                year:'',
                month:'',
                day:'',
            })
            getFinanceFromDB();
        }catch(err){
            console.log(err)
        }
    }
    const addFinanceForm =()=>{
        return(
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsAddFinance(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <select onChange={(e)=>setNewFinance({...newFinance,reasonForPay:e.target.value})} className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3">
                            <option value=''>Reason of Pay</option>
                            <option value='wage'>Wage</option>
                            <option value='tools'>tools</option>
                            <option value='repairs'>repairs</option>
                        </select>

                        <input onChange={(e)=>setNewFinance({...newFinance,details:e.target.value})} type="text" placeholder="details..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input onChange={(e)=>setNewFinance({...newFinance,cost:e.target.value})} type="text" placeholder="cost..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input onChange={(e)=>setNewFinance({...newFinance,year:e.target.valueAsDate.getFullYear(), month:e.target.valueAsDate.getMonth()+1 , day:e.target.valueAsDate.getDate()})} type="date" placeholder="cost..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <div className=" flex gap-3 justify-end">
                            <div onClick={saveFinanceInDB} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save</div>
                            <div onClick={()=>setIsAddFinance(false)} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <div className="bg-gray-100 h-screen relative">
            {titleBar()}
            {/* {naveBar()} */}
            {financeReport()}
            {listOfExpenses()}
            {isAddFinance && addFinanceForm()}
        </div>
    );
}