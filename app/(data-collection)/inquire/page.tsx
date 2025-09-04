import NumberCollection from '@/components/pages/inquire/NumberCollection'
import React from 'react'

function page() {
  return (
     <div className="relative min-h-screen flex justify-center items-center">
          {/* 🔹 Background Overlay */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/assets/home/pattern.png')" }}
          ></div>

          <NumberCollection/>
         
        </div>
  )
}

export default page