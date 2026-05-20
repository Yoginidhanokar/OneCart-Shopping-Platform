import React, { useState } from 'react'
import ai from '../assets/ai.png'
import { useContext } from 'react'
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from "../assets/open.mp3"

function Ai() {
    let {showSearch, setShowSearch} = useContext(shopDataContext)
    let navigate = useNavigate()
    let [activeAi,setActiveAi] = useState(false)
    let openingSound = new Audio(open)

    function speak(message){
        let utterence = new SpeechSynthesisUtterance(message)
        window.speechSynthesis.speak(utterence)
    }

    const speechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new speechRecognition()
    if(!recognition){
        console.log("not supported")
    }

    recognition.onresult = (e) =>{
        const transcript = e.results[0][0].transcript.trim();
        if(transcript.toLowerCase().includes("search") && transcript.toLowerCase().includes("open") && !showSearch){
            speak("opening search")
            setShowSearch(true)
            navigate("/collection")
        }
        else if(transcript.toLowerCase().includes("search") && transcript.toLowerCase().includes("close") && showSearch){
            speak("closing search")
            setShowSearch(false)
        }
        else if(transcript.toLowerCase().includes("collection") || transcript.toLowerCase().includes("collections") || transcript.toLowerCase().includes("product") || transcript.toLowerCase().includes("products")){
            speak("opening collection page")
            navigate("/collection")
        }
        else if(transcript.toLowerCase().includes("about") || transcript.toLowerCase().includes("aboutpage")){
            speak("opening about page")
            navigate("/about")
            setShowSearch(false)
        }
        else if(transcript.toLowerCase().includes("home") || transcript.toLowerCase().includes("homepage")){
            navigate("/about")
            setShowSearch(false)
        }
        else if(transcript.toLowerCase().includes("cart") || transcript.toLowerCase().includes("kaat") || transcript.toLowerCase().includes("caat")){
            speak("opening your cart")
            navigate("/cart")
            setShowSearch(false)
        }
        else if(transcript.toLowerCase().includes("contact")){
            speak("opening contact page")
            navigate("/contact")
            setShowSearch(false)
        }
        else if(transcript.toLowerCase().includes("order") || transcript.toLowerCase().includes("myorders") || transcript.toLowerCase().includes("orders") || transcript.toLowerCase().includes("my order")){
            speak("opening your orders page")
            navigate("/order")
            setShowSearch(false)
        }
        else{
            toast.error("Try Again")
        }
    }
    recognition.onend=()=>{
        setActiveAi(false)
    }
  return (
    <div className='fixed lg:bottom-5 md:bottom-6 bottom-16 left-3' onClick={()=>{recognition.start();
    openingSound.play()
    setActiveAi(true)
    }}>
      <img
        src={ai}
        alt="AI assistant"
        className={`cursor-pointer transition-transform duration-300 ${activeAi ? 'translate-x-[10%] translate-y-[-10%] scale-110' : 'translate-x-0 translate-y-0 scale-100'}`}
        style={{
          width: 80,
          height: 80,
          opacity: 0.85,
          filter: activeAi
            ? 'drop-shadow(0 0 10px rgba(0,0,0,0.22)) brightness(0.75) saturate(0.45) grayscale(0.15)'
            : 'drop-shadow(0 0 6px rgba(0,0,0,0.14)) brightness(0.7) saturate(0.35) grayscale(0.25)',
        }}
      />
    </div>
  )
}

export default Ai
