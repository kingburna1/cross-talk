"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import React from "react";
import { IoSearch } from "react-icons/io5";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";
import { MdTrendingUp } from "react-icons/md";
import Link from "next/link";
import {
  FaHome,
  FaUser,
  FaCog,
  FaBell,
  FaEnvelope,
  FaChartBar,
  FaShoppingCart,
  FaSignOutAlt,
  FaTruck,
  FaUsers,
  FaCashRegister,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useSearchStore } from "../../store/searchStore";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/image1.jpg");
  const [notificationCount, setNotificationCount] = useState(0);

   const { search, setSearch } = useSearchStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch admin profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const user = await response.json();
          if (user.imageSrc) {
            setProfileImage(user.imageSrc);
          }
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      if (event.detail?.imageSrc) {
        setProfileImage(event.detail.imageSrc);
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch('/api/notifications', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const notifications = await response.json();
          // Count unread notifications
          const unreadCount = notifications.filter(n => !n.isRead).length;
          setNotificationCount(unreadCount);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotificationCount();

    // Refresh notification count every 5 seconds for real-time updates
    const interval = setInterval(fetchNotificationCount, 5000);

    // Listen for notification page visits to reset count
    const handleNotificationReset = () => {
      setNotificationCount(0);
    };

    // Listen for new notifications to immediately refresh count
    const handleNewNotification = () => {
      fetchNotificationCount();
    };

    window.addEventListener('notificationsViewed', handleNotificationReset);
    window.addEventListener('newNotificationCreated', handleNewNotification);

    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsViewed', handleNotificationReset);
      window.removeEventListener('newNotificationCreated', handleNewNotification);
    };
  }, []);
  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { icon: <FaHome />, label: "Home", href: "/dashboard/home" },
    { icon: <FaUser />, label: "Profile", href: "/dashboard/profile" },
    {
      icon: <FaBell />,
      label: "Notifications",
      href: "/dashboard/notifications",
    },
    { icon: <FaEnvelope />, label: "Messages", href: "/dashboard/messages" },
    { icon: <FaTruck />, label: "Products", href: "/dashboard/products" },
    {
      icon: <FaCashRegister />,
      label: "Products Records",
      href: "/dashboard/productrecords",
    },
    {
      icon: <MdTrendingUp />,
      label: "Total Stocks Value",
      href: "/dashboard/total-stocks-value",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Total Stocks Profit",
      href: "/dashboard/home",
    },
    { icon: <FaUsers />, label: "Suppliers", href: "/dashboard/sellers" },
    { icon: <FaChartBar />, label: "Analytics", href: "/dashboard/analytics" },
    { icon: <FaShoppingCart />, label: "Orders", href: "/dashboard/orders" },
    { icon: <FaCog />, label: "Settings", href: "/dashboard/settings" },
    { icon: <FaSignOutAlt />, label: "Logout", href: "/dashboard/home" },
  ];
  return (
    <div className="flex gap-5 bg-gray-100 p-4 justify-center   items-center shadow-2xl">
      <div className="md:hidden">
        {/* Mobile menu button */}
        <button onMouseEnter={handleMenuClick}>
          <IoMenu className="text-2xl" />
        </button>

        {/* The backdrop overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 bg-opacity-30 transition-opacity duration-300 ease-in-out"></div>
        )}

        {/* The dropdown menu bar */}
        <motion.div
          initial={{ x: "-100%" }} // start hidden off-screen
          animate={{ x: isMenuOpen ? 0 : "-100%" }} // animate in/out
          transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-screen w-[200px] z-50 bg-white text-black shadow-lg"
        >
          <div>
            <div className="w-full bg-green-400 h-10 text-white p-4 flex justify-between items-center z-50">
              <div className="bg-white rounded-full h-[35px] w-[35px] overflow-hidden flex items-center justify-center">
                <Image
                  src={profileImage}
                  alt="text"
                  width={35}
                  height={35}
                  className="object-cover"
                />
              </div>

              <div>
                <h1 className="font-bold ">Welcome back</h1>
              </div>
              <div onMouseEnter={handleMenuClose}>
                <GiCancel />
              </div>
            </div>

            {/* contents of menu */}
            <nav className="flex-1 mt-4 h-screen overflow-y-auto flex flex-col scrollbar-hide ">
              {menuItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  onClick={handleMenuClose} 
                  className="flex items-center gap-3 px-3 py-3 hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-xl">{item.icon}</span>

                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-2 items-center">
        <div>
          <Image src="/image3.png" alt="Logo" width={30} height={20} />
        </div>
        <h3 className="text-xs md:text-lg">Cross-Talk</h3>
      </div>

      <div className=" hidden md:flex flex-1 items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or sellers name"
          className="px-4 py-2 w-full outline-none"
        />
        <button className="bg-green-600 p-3 text-white flex items-center justify-center hover:bg-green-400 transition-all duration-300">
          <IoSearch size={20} />
        </button>
      </div>

      <div className="md:hidden">
        {/* Trigger button */}
        <button
          onClick={() => setOpen(true)}
          className="bg-gray-100 p-3 flex items-center justify-center hover:bg-gray-200 transition-all duration-300 rounded-full"
        >
          <IoSearch size={30} className="text-gray-600" />
        </button>

        {/* Overlay */}
        {open && (
          <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center  z-50">
            {/* Popup container */}
            <div className="bg-white w-11/12 max-w-md rounded-xl shadow-lg p-4">
              <div className="flex items-center top-0 border border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="text"
                   value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products or sellers name"
                  className="px-4 py-2 w-full outline-none"
                />
                <button className="bg-green-600 p-3 text-white flex items-center justify-center"
                    onClick={() => setOpen(false)}
                >
                  <IoSearch size={20} />
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={() => setOpen(false)}
                className="mt-4 w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 items-center text-gray-600 ">
        <div className="relative">
          <PiShoppingCartSimpleBold className="text-2xl" />
          <div className="absolute top-0 right-0 bg-red-700 rounded-full w-3 h-3 flex justify-center items-center text-white text-xs">
            <p>1</p>
          </div>
        </div>
        <Link href="/dashboard/notifications" className="relative">
          <IoMdNotificationsOutline className="text-2xl" />
          {notificationCount > 0 && (
            <div className="absolute top-0 right-0 bg-red-700 rounded-full min-w-[12px] h-3 px-1 flex justify-center items-center text-white text-xs">
              <p>{notificationCount > 9 ? '9+' : notificationCount}</p>
            </div>
          )}
        </Link>
        <Link href="/dashboard/profile" className="bg-white rounded-full h-[35px] w-[35px] overflow-hidden flex items-center justify-center">
          <Image
            src={profileImage}
            alt="text"
            width={35}
            height={35}
            className="object-cover"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;
