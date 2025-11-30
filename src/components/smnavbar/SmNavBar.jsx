"use client"
import React from 'react';
import { useState } from 'react';
import { FaRegUser } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import Image from "next/image";
import { IoMenu } from "react-icons/io5";
import { ImCancelCircle } from "react-icons/im";
import { CiGlobe } from "react-icons/ci";
import { HiOutlineShoppingCart } from "react-icons/hi";



const SmNavBar = () => {

  const [isMenuOpen, setIsMenuOpen] =useState(false)

  const handleMenuClick = () =>{
    setIsMenuOpen(prev => !prev);
 };

 const handleMenuClose = () =>{
   setIsMenuOpen(false);
};
  return (
    <div className="bg-white  ">
       <div>



       <div className="flex justify-between items-center bg-green-800 text-white w-full p-3">

           <div className="flex items-center  gap-2">
               <div>
               <div className="relative">
               <ul
                 className='flex items-center gap-1 hover:border hover:border-gray-300 p-1 cursor-pointer'
                 onClick={handleMenuClick}
               >
                <li> <IoMenu /></li>
                <li>All</li>
              </ul>
  
              {/* The backdrop overlay */}
              {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/70 bg-opacity-30 transition-opacity duration-300 ease-in-out"></div>
              )}

            {/* The dropdown menu bar */}
           <div className={`fixed top-0 left-0 h-screen w-[200px] z-50 bg-white text-black transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div>
              <div className="w-full bg-gray-800 h-10 text-white p-4 flex justify-between items-center z-50"> 
               <div className="bg-white rounded-full h-[35px] w-[35px] flex items-center justify-center">
               <Image 
                src="/image11.png"
                alt="text"
                width={30}
                height={30}
                 
                 />
               </div>
               <div> <h1 className="font-bold ">hello, sign in</h1></div>
               <div onClick={handleMenuClose} ><ImCancelCircle /></div>
              </div>
                  
                  <div className="flex flex-col  h-screen  overflow-y-scroll">
                <div className="p-4 ">
                  <h2 className="font-bold "> Shop By Category</h2>
                  
                  <div className="border-b border-gray-400">
                       <div 
                              className="w-full p-2 hover:bg-gray-100 cursor-pointer" 
                            onClick={() => handleSelectCategory("electronics")}
                            >
                            Food Crops
                            </div>
                            <div 
                              className="w-full p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleSelectCategory("fashion")}
                            >
                            Cash Crops
                            </div>

                            <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                            Industrial & Plantation Crops
                           </div>

                           <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                           Forest & Non-Timber Products
                           </div>

                           <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                            Fruits & Horticultural Products
                           </div>

                           <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                           Livestock & Animal Products
                           </div>
                     </div>

                </div>
                
                <div className="p-4">
                <h2 className="font-bold "> Help & And Settings</h2>
                     
                <div className="border-b border-gray-400">
                       <div 
                              className="w-full p-2 hover:bg-gray-100 cursor-pointer" 
                           
                            >
                            your account
                            </div>
                            <div 
                              className="w-full p-2 hover:bg-gray-100 cursor-pointer"
                             
                            >
                            {/* Cash Crops */}
                            </div>

                            <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                            <ul className='flex items-center gap-1 p-1 '> 
                             <li>
                             <CiGlobe /> 
                           </li>
                          <li>Cameroon</li>
           
                          </ul>
                           </div>

                           <div className="w-full p-2 hover:bg-gray-100 cursor-pointer">
                           <ul className='flex  gap-1 p-1 '> 
                             <li>
                              <Image 
                                src="/flag.png"
                                alt="text"
                                width={30}
                                height={30}
                              loading="lazy"
            
                             />
                           </li>
                          <li >FR</li>
           
                          </ul>
                           </div>

                           <div className="w-full p-4 hover:bg-gray-100 cursor-pointer">
                            sign in
                           </div>

                          
                     </div>
                </div>

                </div>
                
              </div>
             
            </div>
         </div>
               </div>

                <div>
               <div className=' '>
              <div className='flex flex-col items-center justify-center'>
               <h1 className='font-bold text-xs'>Adela</h1>
                  <div className='flex iterms-center justify-center'>
                 {/* <Image 
                  src="/logo.png"
                   alt="text"
                   width={30}
                   height={30}
            
                     /> */}

                      </div>
                     
                     </div>
           
                  </div>
               </div>
             </div>

            <div className="flex items-center gap-2 "> 
           <div className="flex items-center"><span className="text-white text-xs">signin</span> <FaRegUser /></div>
             <div>
             <div className="flex-1  p-1">
        <div className="flex items-center flex-col justify-center">
      <div className="relative">
        <ul className="flex items-center">
          <li className="relative">
            <HiOutlineShoppingCart className="text-3xl" />
            {/* Absolute badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                0
              </span>
                </li>
             <li className="font-bold ml-2">Cart</li>
              </ul>
             </div>
             </div>
        </div>
             </div>
          <div>
            
          </div>
         </div>

      </div>
       
          

      <div className="flex   items-center   w-full bg-white rounded-md h-10">

      <div className='flex-6  bg-white'>
            <input type="text" placeholder='enter product' className='w-full text-black p-1 rounded-md' />
          </div>
          <div className='flex-1 p-2 bg-amber-500 h-full rounded-md flex items-center justify-center' >
          <CiSearch  color='black'/>
          </div>
      </div>
  

      {/* <div className="w-full bg-green-500 overflow-x-auto scrollbar-hide py-1">
  <ul className="flex space-x-4 text-white">
    <li className="flex-shrink-0">Food Crops</li>
    <li className="flex-shrink-0">Cash Crops</li>
    <li className="flex-shrink-0">Industrial & Plantation Crops</li>
    <li className="flex-shrink-0">Forest & Non-Timber Products</li>
    <li className="flex-shrink-0">Fruits & Horticultural Products</li>
    <li className="flex-shrink-0">Livestock & Animal Products</li>
    <li className="flex-shrink-0">chickens</li>
  </ul>
</div> */}




       </div>
    </div>
  );
}

export default SmNavBar; 