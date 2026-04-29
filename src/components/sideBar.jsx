import { FaTooth,FaHome } from "react-icons/fa";
import { LayoutDashboard } from 'lucide-react';

import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className={` ${location.pathname === '/home/dashbord' ? "h-screen ":""} sideBar w-[300px] h-[93vh] bg-indigo-200`}>
            <h1  className="w-fit  text-center py-3 px-6 rounded-xl mt-2 m-auto flex gap-1 text-indigo-500 text-2xl">
                <FaTooth  />
                <p>Dental Clinic </p>
            </h1>
            <ul className=" m-2 text-center text-white">
                <li onClick={()=>navigate('/')} className={` ${location.pathname === '/' ? "bg-indigo-700":"bg-indigo-300"}  py-3 m-1 rounded-full flex gap-2 justify-center items-center cursor-pointer hover:bg-indigo-700`}> 
                    <FaHome />
                    <p >Home</p>
                </li>
                <li onClick={()=>navigate('/home/dashbord')} className={` ${location.pathname === '/home/dashbord' ? "bg-indigo-700 ":"bg-indigo-300"}  py-3 m-1 rounded-full flex gap-2 justify-center items-center cursor-pointer hover:bg-indigo-700`}> 
                    <LayoutDashboard />
                    Dashbord
                </li>
            </ul>
            
        </div>
    );
}