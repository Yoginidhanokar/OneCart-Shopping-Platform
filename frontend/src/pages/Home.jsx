import React, { useEffect, useState } from 'react'
import Background from '../component/Background'
import Hero from '../component/Hero'
import Nav from '../component/Nav'
import Product from './Product'
import OurPolicy from '../component/OurPolicy'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'

function Home() {
  let heroData = [
    { text1: "30% OFF Limited Offer", text2: "Style that" },
    { text1: "Discover the Best of Bold Fashion", text2: "Limited Time Only!" },
    { text1: "Explore Our Best Collection", text2: "Shop Now" },
    { text1: "Choose your Perfect Fashion Fit", text2: "Now on Sale!" }
  ]

  let [heroCount, setHeroCount] = useState(0)

  useEffect(() => {
    let interval = setInterval(() => {
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {/* Navbar - Fixed positioning */}
      <Nav />
      
      {/* Main Content */}
      <div className='pt-[70px]'> {/* This padding pushes content below fixed navbar */}
        
        {/* Hero Section Only - Fixed height */}
        <div className='relative w-full lg:h-screen md:h-[80vh] sm:h-[60vh] bg-gradient-to-l from-[#141414] to-[#0c2025] overflow-hidden'>
          <Background heroCount={heroCount} />
          <Hero
            heroCount={heroCount}
            setHeroCount={setHeroCount}
            heroData={heroData[heroCount]}
          />
        </div>
        
        {/* Products Section Below Hero */}
        <div className='w-full'>
          <Product />
          <OurPolicy/>
          <NewLetterBox/>
          <Footer/>
        </div>
        
      </div>
    </div>
  )
}

export default Home