import { FaBoxArchive, FaArrowLeft  } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { FaPlus, FaPen, FaTrash, FaMinusCircle } from "react-icons/fa";
import { MdWarning } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase"
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

export default function SmartStore (){
    const navigate = useNavigate();
    const [isAdd , setIsAdd] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false);
    const categoriesCollectionRef = collection(db, "category")
    const [listType, setListType] = useState('all')
    const [categoryLength, setCategoryLength]=useState(0);
    const [outOfStockLength, setOutOfStockLength]=useState(0)
    const [listLength, setListLength]= useState(0)
    const [searchTerm , setSearchTerm] = useState('')
    const [newCategory, setNewCategory] = useState({
        title:"",
        amount:0,
        warningAt:0
    })
    const [categoryList, setCategoryList] = useState([]);
    const [updateCategoryData, setUpdateCategoryData]= useState({})

    useEffect(()=>{
        getCategories();
    },[])

    const getCategories = async()=>{
        let allCategoryAmount=0;
        let amountOfCategory =0;
        try {
            const data = await getDocs(categoriesCollectionRef);
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id:doc.id
            }))
            setListLength(filteredData.length);
            filteredData.map((category)=>{
                // setCategoryLength(parseInt(category.amount) + categoryLength )
                allCategoryAmount +=parseInt(category.amount) 
                if(category.warningAt >= category.amount ){
                    amountOfCategory+=1;
                }
            })
            setOutOfStockLength(amountOfCategory)
            setCategoryLength(allCategoryAmount)
            setCategoryList(filteredData);
        } catch (error) {
            console.log(error);
        }
    }

    const updateFormHandler = ()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsUpdated(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <h1 className="text-center text-indigo-500 text-2xl font-bold"> Update</h1>
                        <input value={updateCategoryData.title} onChange={(e)=>setUpdateCategoryData({...updateCategoryData, title:e.target.value})} type="text" placeholder="Category Name..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={updateCategoryData.amount} onChange={(e)=>setUpdateCategoryData({...updateCategoryData, amount:e.target.value})} type="number" placeholder="Amount..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input value={updateCategoryData.warningAt} onChange={(e)=>setUpdateCategoryData({...updateCategoryData, warningAt:e.target.value})} type="number" placeholder="warning at...." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3" />
                        <div className=" flex gap-3 justify-end">
                            <div onClick={saveUpdateCategory} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save Update</div>
                            <div onClick={cancelUpdateHandler} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel Update</div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
    const saveUpdateCategory = async ()=>{
        try{
            await updateDoc(doc(db,'category',updateCategoryData.id),updateCategoryData)
            getCategories()
            setIsUpdated(false)
        }catch(err){
            console.log(err)
        }
    }
    const saveAddCategory = async()=>{
        try {
            await addDoc(categoriesCollectionRef, newCategory);
            setIsAdd(false);
            getCategories();
        } catch (error) {
            console.log(error);
        }
    }
    const cancelAddHandler = ()=>{
        setIsAdd(false);
        setNewCategory({
            title:"",
            amount:0,
            warningAt:0
        })
    }
    const cancelUpdateHandler =()=>{
        setUpdateCategoryData({});
        setIsUpdated(false);
    }
    const updateByMinues = async(id)=>{
        try{
            const categoryDoc = doc(db, "category", id);
            const categoryToUpdate = categoryList.find((category)=>category.id === id);
            await updateDoc(categoryDoc, {amount: parseInt(categoryToUpdate.amount) - 1})
            getCategories();
        }catch(error){
            console.log(error);
        }
    }

    const deleteCategory = async(id)=>{
        try {
            await deleteDoc(doc(db, "category", id));
            getCategories();
        } catch (error) {
            console.log(error);
        }
    }

    const addFormHandler = ()=>{
        return (
            <div className="h-screen  absolute top-0 w-full ">
                <div className="bg-gray-700/50 w-full h-screen ">
                    <div className=" m-auto w-[400px] bg-white z-index-10 p-5 rounded-lg shadow-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <FaTimes onClick={()=>setIsAdd(false)} className=" text-2xl cursor-pointer text-gray-500 hover:text-gray-700" />
                        <input onChange={(e)=>setNewCategory({...newCategory, title:e.target.value})} type="text" placeholder="Category Name..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input onChange={(e)=>setNewCategory({...newCategory, amount:e.target.value})} type="number" placeholder="Amount..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3"/>
                        <input onChange={(e)=>setNewCategory({...newCategory, warningAt:e.target.value})} type="number" placeholder="warning at...." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500 my-3" />
                        <div className=" flex gap-3 justify-end">
                            <div onClick={saveAddCategory} className=" w-fit p-3 rounded-lg bg-indigo-500 text-white cursor-pointer shadow-lg hover:bg-indigo-600" >Save</div>
                            <div onClick={cancelAddHandler} className=" w-fit p-3 rounded-lg bg-red-500 text-white cursor-pointer shadow-lg hover:bg-red-600" >Cancel</div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }

    const titleBar = ()=>{
        return (
            <div className=" bg-indigo-500 flex items-center text-white">
                <FaArrowLeft onClick={()=>navigate(-1)} className=" text-2xl cursor-pointer"/>
                <h1 className="p-4 w-fit m-auto font-bold">Smart Store </h1>
            </div>
        );
    }

    const SearchBar =()=>{
        return(
            <div className=" p-3 flex gap-3">
                <div className=" w-fit px-2 rounded-lg flex items-center gap-5 shadow-lg bg-white ">
                    <div className="">
                        <p className="text-2xl text-indigo-500">{categoryLength}</p>
                        <p className="text-[10px] ">Stored</p>
                    </div>
                    <p className="text-xl font-bold text-indigo-500">#</p>
                </div>

                <div className=" w-fit px-2 rounded-lg flex items-center gap-5 shadow-lg bg-white">
                    <div className="">
                        <p className="text-2xl text-red-500">{outOfStockLength}</p>
                        <p className="text-[10px] ">Needed</p>
                    </div>
                    <MdWarning className="text-xl font-bold text-red-500 " />
                </div>

                <div className=" w-fit px-2 rounded-lg flex items-center gap-5 shadow-lg bg-white">
                    <div className="">
                        <p className="text-2xl text-green-500">{listLength}</p>
                        <p className="text-[10px] ">Total</p>
                    </div>
                    <FaBoxArchive className="text-xl font-bold text-green-500 " />
                </div>


                <input onChange={(e)=>setSearchTerm(e.target.value)} type="text" placeholder="Search..." className=" p-2  shadow-lg w-full outline-none border-b-1 border-indigo-300 text-indigo-500"/>
            </div>
        );
    }

    const transitionBar =()=>{
        return(
            <div className=" p-2 flex gap-3">
                <div onClick={()=>setIsAdd(true)} className="bg-indigo-500 w-fit p-3 rounded-lg text-white font-bold cursor-pointer hover:bg-indigo-600"> <FaPlus className="inline-block" /> Add Category </div>
                <div onClick={()=>setListType('all')} className={`${listType==='all' ? "bg-indigo-200 hover:bg-indigo-300" :"bg-white hover:bg-gray-200"} w-fit p-3 rounded-lg text-indigo-500 shadow-lg  cursor-pointer hover:bg-gray-200`}>All Category</div>
                <div onClick={()=>setListType('out of stock')} className={` ${listType==='out of stock' ? "bg-indigo-200 hover:bg-indigo-300" :"bg-white hover:bg-gray-200"} w-fit p-3 rounded-lg text-indigo-500 shadow-lg  cursor-pointer hover:bg-gray-200`}>Out of stock</div>
            </div>
        );
    }

    const cards =()=>{
        return(
            <div className=" h-[65vh] w-full bg-gray-100 overflow-y-scroll mt-3 p-2 ">
                {
                    listType ==='all' ?
                    categoryList.map((category)=>(
                        <div key={category.id} className="bg-white shadow-lg  w-[400px] inline-flex justify-between p-3 rounded-lg py-12 m-2">
                            <div>
                                <div className="flex gap-3 items-center">
                                    <FaBoxArchive className="text-indigo-500 text-xl"/>
                                    <p>{category.title}</p>
                                </div>
                                <p className="text-[11px] text-gray-500">warning at :{category.warningAt}</p>
                            </div>
                            <div className="">
                                <p className={`text-4xl pb-4 ${parseInt(category.amount) <= parseInt(category.warningAt) ? "text-red-500":""}`}>{category.amount} {parseInt(category.amount) <= parseInt(category.warningAt) && <MdWarning className="inline-block"/>} </p>
                                <div className="flex gap-3">
                                    <FaTrash onClick={()=>deleteCategory(category.id)} className="text-red-600 cursor-pointer hover:text-red-400"/>
                                    <FaPen onClick={()=>(setUpdateCategoryData(category), setIsUpdated(true))} className="text-indigo-600 cursor-pointer hover:text-indigo-400" />
                                    <FaMinusCircle onClick={()=>updateByMinues(category.id)} className="text-yellow-600 cursor-pointer hover:text-yellow-400" />
                                </div>
                            </div>
                        </div>
                            
                    )):
                    categoryList.map((category)=>(
                        category.amount <= category.warningAt &&
                        <div key={category.id} className="bg-white shadow-lg  w-[400px] inline-flex justify-between p-3 rounded-lg py-12 m-2">
                            <div>
                                <div className="flex gap-3 items-center">
                                    <FaBoxArchive className="text-indigo-500 text-xl"/>
                                    <p>{category.title}</p>
                                </div>
                                <p className="text-[11px] text-gray-500">warning at :{category.warningAt}</p>
                            </div>
                            <div className="">
                                <p className={`text-4xl pb-4 ${parseInt(category.amount) <= parseInt(category.warningAt) ? "text-red-500":""}`}>{category.amount} {parseInt(category.amount) <= parseInt(category.warningAt) && <MdWarning className="inline-block"/>} </p>
                                <div className="flex gap-3">
                                    <FaTrash onClick={()=>deleteCategory(category.id)} className="text-red-600 cursor-pointer hover:text-red-400"/>
                                    <FaPen onClick={()=>(setUpdateCategoryData(category), setIsUpdated(true))} className="text-indigo-600 cursor-pointer hover:text-indigo-400" />
                                    <FaMinusCircle onClick={()=>updateByMinues(category.id)} className="text-yellow-600 cursor-pointer hover:text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
    const searchResult = ()=>{
        return(
            <div className=" h-[65vh] w-full bg-gray-100 overflow-y-scroll mt-3 p-2 ">
                {
                    
                    searchTerm.trim() !== '' ?
                        categoryList.map((category)=>(
                            (category.title.includes(searchTerm.trim()) || category.amount== searchTerm.trim()) && 
                                <div key={category.id} className="bg-white shadow-lg  w-[400px] inline-flex justify-between p-3 rounded-lg py-12 m-2">
                                    <div>
                                        <div className="flex gap-3 items-center">
                                            <FaBoxArchive className="text-indigo-500 text-xl"/>
                                            <p>{category.title}</p>
                                        </div>
                                        <p className="text-[11px] text-gray-500">warning at :{category.warningAt}</p>
                                    </div>
                                    <div className="">
                                        <p className={`text-4xl pb-4 ${parseInt(category.amount) <= parseInt(category.warningAt) ? "text-red-500":""}`}>{category.amount} {parseInt(category.amount) <= parseInt(category.warningAt) && <MdWarning className="inline-block"/>} </p>
                                        <div className="flex gap-3">
                                            <FaTrash onClick={()=>deleteCategory(category.id)} className="text-red-600 cursor-pointer hover:text-red-400"/>
                                            <FaPen onClick={()=>(setUpdateCategoryData(category), setIsUpdated(true))} className="text-indigo-600 cursor-pointer hover:text-indigo-400" />
                                            <FaMinusCircle onClick={()=>updateByMinues(category.id)} className="text-yellow-600 cursor-pointer hover:text-yellow-400" />
                                        </div>
                                    </div>
                                </div>
                        )):null
                        
                }
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {titleBar()}
            {SearchBar()}
            {transitionBar()}
            {searchTerm.trim() !==''? searchResult():cards()}
            {isAdd && addFormHandler()}
            {isUpdated && updateFormHandler()}
        </div>
    );
}