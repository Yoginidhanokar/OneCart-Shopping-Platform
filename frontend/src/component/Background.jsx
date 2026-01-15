import React from 'react'
import back1 from "../assets/back1.png"
import back2 from "../assets/back2.png"
import back3 from "../assets/back3.png"
import back4 from "../assets/back4.png"

function Background({ heroCount }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 flex justify-end">
      {heroCount === 0 && (
        <img src={back2} alt="" className="h-full object-contain" />
      )}

      {heroCount === 1 && (
        <img src={back1} alt="" className="h-full object-cover" />
      )}

      {heroCount === 2 && (
        <img src={back3} alt="" className="h-full object-cover" />
      )}

      {heroCount === 3 && (
        <img src={back4} alt="" className="h-full object-cover" />
      )}
    </div>
  )
}

export default Background

