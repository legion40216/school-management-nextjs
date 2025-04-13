"use client"
import React from 'react'
import NavLeft from './navbar/nav-left'
import NavMain from './navbar/nav-main'
import NavRight from './navbar/nav-right'
import { currentUser } from '@/hooks/use-current-user'

export default function Navbar() {
    const user = currentUser()
  return (
    <div>
      <div className=' flex items-center justify-between 
      container mx-auto py-2 px-4 border-b'
      >
        <div className='flex gap-2 items-center'>
          <NavLeft/>
          <div className='flex gap-4 items-center'>
            <h1 className=' font-extrabold text-xl'>Welcome, {user?.name}</h1>
            <div className='flex items-center gap-1'>
              <div className=' rounded-full w-2 h-2 bg-green-500'></div>
              <span className=' text-xs text-green-500'>{user?.role}</span>
            </div>
          </div>
        </div>

        <div className='hidden md:block'>
          <NavMain/>
        </div>
        
        <NavRight/>
      </div>
    </div>
  )
}
