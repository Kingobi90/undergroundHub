"use client";

import React, { useState, useEffect } from 'react';
import { FaLock, FaChevronRight, FaSmile, FaMeh, FaFrown, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [morale, setMorale] = useState(78);
  const [userVoted, setUserVoted] = useState(false);
  const [votes, setVotes] = useState(243);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Handle scroll event to hide/show the morale bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Get morale color based on value
  const getMoraleColor = () => {
    if (morale >= 70) return 'bg-green-500';
    if (morale >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get morale icon based on value
  const getMoraleIcon = () => {
    if (morale >= 70) return <FaSmile className="text-green-500 text-xl" />;
    if (morale >= 40) return <FaMeh className="text-yellow-500 text-xl" />;
    return <FaFrown className="text-red-500 text-xl" />;
  };
  
  // Get morale text based on value
  const getMoraleText = () => {
    if (morale >= 85) return "Ecstatic";
    if (morale >= 70) return "Happy";
    if (morale >= 55) return "Good";
    if (morale >= 40) return "Meh";
    if (morale >= 25) return "Low";
    return "Depressed";
  };

  const handleVote = (isPositive: boolean) => {
    if (userVoted) return;
    
    // Calculate new morale based on vote
    const moraleChange = isPositive ? 1 : -1;
    const newMorale = Math.max(0, Math.min(100, morale + moraleChange));
    
    setMorale(newMorale);
    setUserVoted(true);
    setVotes(votes + 1);
  };

  // Mock data for the ticker
  const tickerItems = [
    { icon: '💰', content: '50% Off at Campus Bookstore - Today Only!', type: 'deal' },
    { icon: '🔥', content: 'Breaking: Dean announces extended library hours', type: 'trending' },
    { icon: '🎉', content: 'Hackathon registration closes tomorrow!', type: 'event' },
    { icon: '🍕', content: 'Free pizza in the quad at 1PM', type: 'deal' },
  ];

  // Mock data for anonymous posts - expanded with more posts for auto-scrolling
  const anonymousPosts = [
    { id: 1, content: 'Just saw the president of the university eating ramen in the cafeteria. He\'s just like us!', likes: 234, comments: 45, time: '10m' },
    { id: 2, content: 'The CS department is secretly planning to make all finals open-book next semester. My TA just confirmed.', likes: 189, comments: 32, time: '25m' },
    { id: 3, content: 'Found out which professor has been leaving those inspirational sticky notes in the library. It\'s Professor Johnson from Philosophy!', likes: 156, comments: 28, time: '30m' },
    { id: 4, content: 'The vending machine on the 3rd floor of the science building gives double snacks if you press B2 twice. You\'re welcome.', likes: 122, comments: 19, time: '1h' },
    { id: 5, content: 'Just overheard the Dean say they\'re adding a new gaming lounge to the student center next semester. Priorities!', likes: 98, comments: 15, time: '1h' },
    { id: 6, content: 'PSA: The coffee shop in the library is giving free refills today if you bring your own mug. I\'m on my fifth cup.', likes: 87, comments: 12, time: '2h' },
    { id: 7, content: 'Anyone else notice they changed the WiFi password in the dorms? It\'s now "GoFightWin2025" - you\'re welcome.', likes: 76, comments: 23, time: '2h' },
    { id: 8, content: 'The bio lab has a new pet snake and they named it "Midterm" because it\'s terrifying but actually harmless once you get to know it.', likes: 145, comments: 34, time: '3h' },
  ];

  // Mock data for carousel
  const carouselItems = [
    { 
      id: 1, 
      title: 'Campus Uncensored', 
      description: '→ Say it all. No name, no filter.',
      image: '/banners/campus-uncensored.png',
      date: 'Now Live'
    },
    { 
      id: 2, 
      title: 'Real-Time Study Map', 
      description: '→ Know crowded spots before you go.',
      image: '/banners/real-time-map.png',
      date: 'Popular'
    },
    { 
      id: 3, 
      title: 'Study Tools', 
      description: '→ Pomodoro, planner, shared flashcards, and more.',
      image: '/banners/study-tools.png',
      date: 'New'
    },
    { 
      id: 4, 
      title: 'Club Feed', 
      description: '→ Join, track, or discover every campus society.',
      image: '/banners/club-news.png',
      date: 'Updated'
    },
    { 
      id: 5, 
      title: 'Campus Events', 
      description: '→ Never miss what matters on campus.',
      image: '/banners/campus-events.jpg',
      date: 'This Week'
    },
  ];

  // Countdown timer to finals week
  useEffect(() => {
    const finalsDate = new Date('2025-08-15T00:00:00'); // Example finals date
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = finalsDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Finals have started
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    // Update immediately and then every second
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // We don't need the auto-scroll effect anymore as we're using CSS animation
  
  // Rotate ticker items
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prevIndex) => (prevIndex + 1) % tickerItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Live Notification Bar - Fixed at the very top */}
      <div style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100}} className="bg-[#111] border-b border-gray-700 py-2 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded mr-3">
              LIVE
            </span>
            <div className="flex items-center overflow-hidden">
              <div
                key={tickerIndex}
                className="flex items-center animate-fade-in"
              >
                <span className="text-2xl mr-2">{tickerItems[tickerIndex].icon}</span>
                <span className="font-medium text-yellow-400">
                  {tickerItems[tickerIndex].content}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-transparent hover:bg-gray-800 px-4 py-1 rounded-full text-sm font-medium border border-gray-700">
              Log in
            </button>
            <button className="bg-white hover:bg-gray-200 text-black px-4 py-1 rounded-full text-sm font-medium">
              Sign up
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content with padding for the fixed notification bar */}
      <main className="min-h-screen bg-primary-bg pt-[38px] relative z-0">
        {/* Status Bars inside the main content */}
        <div className="bg-[#111] border-b border-gray-800 mt-[-1px]">  {/* Added negative margin to remove gap */}
          <div className="container mx-auto px-4 py-3">
            {/* Campus Morale Section */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getMoraleIcon()}
                <span className="text-sm font-medium text-yellow-400">Campus Morale</span>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div 
                    className={`${getMoraleColor()} h-4 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center`}
                    style={{ width: `${morale}%` }}
                  >
                    <span className="text-xs font-bold text-black drop-shadow-sm">{getMoraleText()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-300 mr-1">How's it going?</span>
                <button 
                  onClick={() => handleVote(false)} 
                  disabled={userVoted}
                  className={`p-1 rounded-full ${userVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-900 hover:bg-opacity-30'}`}
                >
                  <FaThumbsDown className="text-red-500" />
                </button>
                <button 
                  onClick={() => handleVote(true)} 
                  disabled={userVoted}
                  className={`p-1 rounded-full ${userVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-900 hover:bg-opacity-30'}`}
                >
                  <FaThumbsUp className="text-green-500" />
                </button>
                <span className="text-xs text-gray-300 ml-1">{votes}</span>
              </div>
            </div>
            
            {/* Campus Updates Section */}
            <div className="flex items-center justify-between text-sm border-t border-gray-800 pt-3">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <span className="text-yellow-400 font-medium mr-2">Crowd Update:</span>
                  <span className="text-gray-300">LB 4th floor 91% full</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-400 font-medium mr-2">Poll Result:</span>
                  <span className="text-gray-300">78% want nap pods in EV</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-green-400 font-medium mr-2">Finals Week:</span>
                <div className="flex space-x-2">
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="font-mono font-bold">{countdown.days}</span>
                    <span className="text-xs text-gray-400 ml-1">d</span>
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="font-mono font-bold">{countdown.hours}</span>
                    <span className="text-xs text-gray-400 ml-1">h</span>
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="font-mono font-bold">{countdown.minutes}</span>
                    <span className="text-xs text-gray-400 ml-1">m</span>
                  </div>
                  <div className="bg-gray-900 px-2 py-1 rounded">
                    <span className="font-mono font-bold">{countdown.seconds}</span>
                    <span className="text-xs text-gray-400 ml-1">s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:w-1/2">
              <h1 className="text-6xl font-extrabold mb-4">Campus Underground</h1>
              <p className="text-xl text-gray-400 mb-8 max-w-md">
              Everything you need to SURVIVE and THRIVE on campus.
              </p>
              
              <div className="flex space-x-4 mb-12">
                <button className="bg-white hover:bg-gray-200 text-black px-6 py-3 rounded-full text-lg font-bold w-32">
                  Log in
                </button>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-bold w-32">
                  Sign up
                </button>
              </div>
              
              {/* Carousel */}
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4">Campus Essentials</h2>
                <Swiper
                  modules={[Pagination, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1.2}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000 }}
                  className="rounded-xl overflow-hidden"
                >
                  {carouselItems.map((item) => (
                    <SwiperSlide key={item.id} className="bg-gray-900 rounded-xl overflow-hidden">
                      <div className="relative h-64 w-full">
                        {/* Banner Image */}
                        <div className="absolute inset-0 w-full h-full">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                        <div className="absolute bottom-0 left-0 p-6 z-20">
                          <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                          <p className="text-gray-300 mb-2">{item.description}</p>
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-sm font-medium">{item.date}</span>
                            <FaChevronRight className="text-yellow-400 ml-2" size={12} />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            
            {/* Right Column - Anonymous Posts */}
            <div className="lg:w-1/2">
              <div className="bg-[#111] rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6">Campus Uncensored</h2>
                
                <div className="h-[500px] overflow-hidden relative z-0">
                  {/* Container for continuous scrolling animation */}
                  <div className="animate-continuous-scroll">
                    {/* First set of posts */}
                    <div className="space-y-4">
                      {anonymousPosts.map((post) => (
                        <div 
                          key={`first-${post.id}`} 
                          className="bg-[#1a1a1a] rounded-lg p-4"
                        >
                          <p className="text-gray-300 mb-3">{post.content}</p>
                          
                          <div className="flex justify-between text-sm text-gray-500">
                            <div className="flex space-x-4">
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                            </div>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Duplicate set of posts for seamless looping */}
                    <div className="space-y-4">
                      {anonymousPosts.map((post) => (
                        <div 
                          key={`second-${post.id}`} 
                          className="bg-[#1a1a1a] rounded-lg p-4"
                        >
                          <p className="text-gray-300 mb-3">{post.content}</p>
                          
                          <div className="flex justify-between text-sm text-gray-500">
                            <div className="flex space-x-4">
                              <span>{post.likes} likes</span>
                              <span>{post.comments} comments</span>
                            </div>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Gradient overlays for smooth fade effect */}
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#111] to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111] to-transparent z-10"></div>
                </div>
                
                <div className="mt-6 flex items-center justify-center">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full text-base font-bold flex items-center">
                    <span className="mr-2">Submit a post</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Login to scroll manually and see more posts
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
