import React, { useEffect, useState } from 'react';
import SideBar from "./sideBar";
import { FaSearchLocation, 
    FaPhone, 
    FaUserCircle, 
    FaPlus, 
    FaUser,
    FaArrowAltCircleLeft, 
    FaArrowAltCircleRight} from "react-icons/fa";
import {db} from '../config/firebase';
import { addDoc, collection, getDocs,  } from 'firebase/firestore';
import MyImage from '../image/Screenshot 2026-04-20 171618.png';
import MyImage1 from '../image/Screenshot 2026-04-20 204849.png';
import MyImage2 from '../image/Screenshot 2026-04-20 204825.png';
import MyImage3 from '../image/Screenshot 2026-04-20 204733.png';

const NaveBar =()=>{
    return(
        <div className=" p-5 m-3 rounded-full bg-indigo-200 text-indigo-600 text-lg flex flex-wrap gap-3 justify-around"> 
            <div className="flex gap-1 w-[40%] border-l-1 border-l-indigo-500 p-1 pl-2">
                <FaUser className=""/>
                <h1 >Name: <span className="text-gray-500">DR.Ammar Salmo</span></h1>
            </div>
            <div className="flex gap-1 w-[40%] border-l-1 border-l-indigo-500 p-1 pl-2">
                <FaSearchLocation />
                <h1>Address: <span className="text-gray-500">Lattakia</span></h1>
            </div>
            <div className="flex gap-1 w-[40%] border-l-1 border-l-indigo-500 p-1 pl-2">
                <FaPhone />
                <h1>Phone Number: <span className="text-gray-500">099 999 9999</span></h1>
            </div>
            <div className=" w-[40%] ">
                <div className="flex gap-1 w-fit border-1 border-indigo-500 py-1 px-3 cursor-pointer text-white bg-indigo-500 rounded-full hover:bg-indigo-600 ">
                    <FaPlus className="pt-1"/>
                    <p>Book An Appointment</p>
                </div>
            </div>
        </div>
    );
}



export default function Home() {
    const [opinionsFromDB, setOpinionsFromDB] = useState([]);
    const opinionCollectionRef = collection(db, "customers-opinion");

    const [activeOpinion, setActiveOpinion] = useState(0);
    const [activeWork, setActiveWork] = useState(0);

    const [opinion,setOpinion] = useState('')
    const [dataForWorkDept, setDataForWorkDept] = useState([
            { 
                id: 1, 
                name: "Braces", 
                description: "Braces are dental appliances used to correct misaligned teeth and jaws. They consist of brackets, wires, and bands that work together to gradually move teeth into their proper positions.",
                image:MyImage1
            },
            { 
                id: 2, 
                name: "Lee", 
                description: "Lee are dental appliances used to correct misaligned teeth and jaws",
                image:MyImage2
            },
            {
                id: 3,
                name: "Jee",
                description: "Jee are dental appliances used to correct misaligned teeth and jaws",
                image:MyImage3
            }
        ]
    );
    
    useEffect(() => {
        getOpinionsFromDB();
    },[])

    const getOpinionsFromDB = async()=>{
        try{
            const data = await getDocs(opinionCollectionRef);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setOpinionsFromDB(filteredData);
        }catch(err){
            console.log(err)
        }
    }

    const saveOpinionHandler = async()=>{
        try{
            await addDoc(opinionCollectionRef,{
                opinion: opinion,
                year : new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                addBy:'ali'
            });
            setOpinion('');
            getOpinionsFromDB();
        }catch(err){
            console.log(err)
        }
    }

    const aboutDoctor =()=>{
        return(
            <div className=" overflow-y-auto h-[68vh]  rounded-xl flex justify-around items-center ">
                <div className="w-[40%] ">
                    <h1 className="text-3xl text-indigo-500 font-bold ">About Doctor .</h1>
                    <ul className="list-disc list-inside ml-3">
                        <li className="text-gray-500 mt-3 text-sm"> Lorem ipsum dolor sit amet consectetur adipisicing elit.</li>
                        <li className="text-gray-500 mt-3 text-sm"> Lorem ipsum dolor sit amet consectetur adipisicing elit adipisicing elit.</li>
                        <li className="text-gray-500 mt-3 text-sm "> Lorem ipsum dolor sit amet consectetur .</li>
                        <li className="text-gray-500 mt-3 text-sm "> Lorem ipsum dolor sit amet consectetur .</li>
                    </ul>
                    <div className="text-xl text-gray-500 pt-3 font-bold " >Working hours: <span className=" text-indigo-500">8 Am - 6 Pm</span> </div>
                </div>
                
                <img src={MyImage} alt='Doctor' className=" h-[55vh] rounded-xl" />
            </div>
        );
    }

    const arrowLeftHandlerInCustomerOpinino =(e)=>{
        e.preventDefault()
        if(activeOpinion === 0){
            setActiveOpinion(opinionsFromDB.length-1);
        }else{
            setActiveOpinion(activeOpinion - 1);
        }
    }

    const arrowRightHandlerInCustomerOpinino =(e)=>{
        e.preventDefault()
        if(activeOpinion === opinionsFromDB.length-1){
            setActiveOpinion(0);
        }else{
            setActiveOpinion(activeOpinion+1);
        }
    }

    const customerOpinion = ()=>{
        return(
            <div className=" overflow-y-auto min-h-[68vh] text-center rounded-xl ">
                <h1 className="text-3xl text-indigo-500 font-bold mt-9 mb-5 ">Customer Opinion .</h1>
                <div className='flex w-[80%] m-auto'>
                    <input 
                        value={opinion}
                        onChange={e=>setOpinion(e.target.value)}
                        type="text" 
                        placeholder="New Customer Opinion..."
                        className=" w-[90%] p-3 rounded-l-xl bg-indigo-500 outline-none mb-5 border-r-2 border-black"
                    />
                    <div 
                        className=" p-3 rounded-r-xl bg-indigo-500 outline-none cursor-pointer hover:bg-indigo-600 mb-5"
                        onClick={saveOpinionHandler}
                    >save</div>
                </div>

                {
                    opinionsFromDB.length > 0 &&
                    <div className="border-1 border-indigo-500 rounded-xl w-[60%] m-auto">
                        <div className='flex gap-3 justify-between p-3'>
                            <div  className='flex gap-3'>
                                <FaUserCircle className=" text-xl  text-indigo-500 "/>
                                <p>{opinionsFromDB[activeOpinion].addBy}</p>
                            </div>
                            <p className='text-sm text-gray-400'>{opinionsFromDB[activeOpinion].day}/{opinionsFromDB[activeOpinion].month}/{opinionsFromDB[activeOpinion].year}</p>
                        </div>
                        <hr className="my-2 border-indigo-500 font-bold text-4xl w-[80%] m-auto" />
                        <p className="text-gray-700 mt-3  p-8 "> {opinionsFromDB[activeOpinion].opinion}</p>
                    </div>
                }


                <p className="w-[60%] m-auto  flex justify-end mt-3 mb-6 text-indigo-500 ">
                    <FaArrowAltCircleLeft onClick={e=>arrowLeftHandlerInCustomerOpinino(e)} className="text-3xl cursor-pointer hover:text-indigo-700"/>
                    <FaArrowAltCircleRight onClick={e=>arrowRightHandlerInCustomerOpinino(e)} className="ml-3 text-3xl cursor-pointer hover:text-indigo-700"/>
                </p>
            </div>
        );
    }


    const arrowLeftHandlerInWork =(e)=>{
        e.preventDefault()
        if(activeWork === 0){
            setActiveWork(dataForWorkDept.length-1);
        }else{
            setActiveWork(activeWork - 1);
        }
        console.log(activeWork)
    }
    const arrowRightHandlerInWork =(e)=>{
        e.preventDefault()
        if(activeWork === dataForWorkDept.length-1){
            setActiveWork(0);
        }else{
            setActiveWork(activeWork+1);
        }
        console.log(activeWork)
    }

    const works = ()=>{
        
        return(
            <div className="  overflow-y-auto min-h-[68vh] text-center rounded-xl ">
                <h1 className="text-3xl text-indigo-500 font-bold mt-9 mb-5 ">Works .</h1>
                
                <div className=" rounded-xl w-[60%] m-auto">
                    <img src={dataForWorkDept[activeWork].image}  alt='Doctor' className=" w-[80%] h-[150px] m-auto rounded-xl border-2 border-indigo-500" />
                    <p className="text-gray-700 mt-3  p-4 ">{dataForWorkDept[activeWork].description}</p>
                </div>
                <p className="w-[60%] m-auto  flex justify-end mt-3 mb-6 text-indigo-500 ">
                    <FaArrowAltCircleLeft onClick={e=>arrowLeftHandlerInWork(e)} className="text-3xl cursor-pointer hover:text-indigo-700"/>
                    <FaArrowAltCircleRight onClick={e=>arrowRightHandlerInWork(e)} className="ml-3 text-3xl cursor-pointer hover:text-indigo-700"/>
                </p>
            </div>
        );
    }



    return(
        
        <div className="h-screen">
            <div className="flex h-[93vh]">
                <SideBar />

                <div className=" w-full ">
                    {NaveBar()}

                    <div className="bg-white overflow-y-auto h-[68vh] m-3 rounded-xl">
                        
                        {aboutDoctor()}
                        <hr className="my-3 border-indigo-500 font-bold text-4xl w-[80%] m-auto" />
                        {customerOpinion()}
                        <hr className="my-3 border-indigo-500 font-bold text-4xl w-[80%] m-auto" />
                        {works()}
                    </div>
                </div>
                
            </div>
            <div className="bg-indigo-500 h-[7vh] w-full"> 
                <p className="text-center text-white p-2">Copyright @ 2026</p>
            </div>
        </div>
    );
}