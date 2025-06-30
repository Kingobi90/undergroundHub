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

  // Mock data for anonymous posts
  const anonymousPosts = [
    { id: 1, content: 'Just saw the president of the university eating ramen in the cafeteria. He\'s just like us!', likes: 234, comments: 45, time: '10m' },
    { id: 2, content: 'The CS department is secretly planning to make all finals open-book next semester. My TA just confirmed.', likes: 189, comments: 32, time: '25m' },
    { id: 3, content: 'Found out which professor has been leaving those inspirational sticky notes in the library. It\'s not who you think...', likes: 156, comments: 28, time: 'locked' },
    { id: 4, content: 'The vending machine on the 3rd floor of the science building gives double snacks if you press B2 twice. You\'re welcome.', likes: 122, comments: 19, time: '1h' },
  ];

  // Mock data for carousel
  const carouselItems = [
    { id: 1, title: 'Summer Hackathon', description: 'Join the biggest coding event of the summer. $5000 in prizes!', date: 'July 15-17' },
    { id: 2, title: 'Internship Fair', description: 'Over 50 companies looking for summer interns. Bring your resume!', date: 'July 10' },
    { id: 3, title: 'Campus Construction', description: 'South dorms will be closed for renovation starting next week', date: 'Starts July 5' },
    { id: 4, title: 'New Course Offerings', description: 'Fall registration opens with 15 new electives across all departments', date: 'Register by July 20' },
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

  // Rotate ticker items
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prevIndex) => (prevIndex + 1) % tickerItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Custom Morale Bar - Fixed at the very top */}
      <div className={`bg-secondary-bg border border-accent w-full py-2 px-4 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {getMoraleIcon()}
              <span className="text-sm font-medium text-accent">Campus Morale</span>
            </div>
            
            <div className="flex-1 relative">
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className={`${getMoraleColor()} h-4 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center`}
                  style={{ width: `${morale}%` }}
                >
                  <span className="text-xs font-bold text-black drop-shadow-sm">{getMoraleText()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 min-w-[180px]">
              <span className="text-xs text-text-secondary mr-1">How's it going?</span>
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
              <span className="text-xs text-text-secondary ml-1">{votes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Updates Bar */}
      <div className="bg-[#0a0a0a] border-b border-gray-800 fixed top-[56px] left-0 right-0 z-40 py-2 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-sm">
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

      {/* Main content with padding to account for fixed MoraleBar and Campus Updates */}
      <main className="min-h-screen bg-primary-bg pt-[112px]">
        {/* Top banner with ticker and login buttons */}
        <div className="bg-[#111] border-b border-gray-800 py-2">
          <div className="container mx-auto px-4 flex items-center">
            <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded mr-3">
              LIVE
            </span>
            <div className="flex items-center overflow-hidden">
              <div
                key={tickerIndex}
                className="flex items-center animate-fade-in"
              >
                <span className="text-2xl mr-2">{tickerItems[tickerIndex].icon}</span>
                <span className={`font-medium ${tickerItems[tickerIndex].type === 'deal' ? 'text-green-400' : 
                                tickerItems[tickerIndex].type === 'event' ? 'text-yellow-400' : 'text-blue-400'}`}>
                  {tickerItems[tickerIndex].content}
                </span>
              </div>
            </div>
            <div className="ml-auto flex space-x-3">
              <button className="bg-transparent hover:bg-gray-800 px-4 py-1 rounded-full text-sm font-medium border border-gray-700">
                Log in
              </button>
              <button className="bg-white hover:bg-gray-200 text-black px-4 py-1 rounded-full text-sm font-medium">
                Sign up
              </button>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:w-1/2">
              <h1 className="text-6xl font-extrabold mb-4">Happening now</h1>
              <p className="text-xl text-gray-400 mb-8 max-w-md">
                Post anonymously to Campus Uncensored and see what's REALLY happening.
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
                
                <div className="space-y-4">
                  {anonymousPosts.map((post) => (
                    <div 
                      key={post.id} 
                      className={`bg-[#1a1a1a] rounded-lg p-4 ${post.time === 'locked' ? 'relative overflow-hidden' : ''}`}
                    >
                      {post.time === 'locked' ? (
                        <>
                          <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
                            <FaLock className="text-yellow-400 text-2xl mb-2" />
                            <p className="text-center font-medium">Log in to reveal this post</p>
                          </div>
                          <p className="text-gray-300 mb-3">{post.content}</p>
                        </>
                      ) : (
                        <p className="text-gray-300 mb-3">{post.content}</p>
                      )}
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                        <span>{post.time === 'locked' ? 'Hidden' : post.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 bg-transparent hover:bg-gray-800 border border-gray-700 rounded-lg py-3 font-medium">
                  View more posts
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
