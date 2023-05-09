"use client"
import 'tailwindcss/tailwind.css';
import React from "react";
import { supabase } from '../supabaseClient';
import { cookies } from 'next/dist/client/components/headers';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  // const c = cookies();
  // const at=c.get("sb-access-token")?.value as string
  // const { data: user, error } = await supabase.auth.getUser(at);
  // console.log(user.user?.id);

  const [user, setUser] = useState<any>(null);

  useEffect(()=>{
    const sub = async() =>{
      await supabase.auth.getUser().then((u) => setUser(u.data.user))
    }
    sub()
  },[])

  return (
    <div className="Navbar font-sans text-center bg-white shadow-md">
      <ul className="flex justify-center items-center h-16">
        <li className="list-none mx-2 my-1 relative group" key={Math.random()}>
          <a
            href={`/dashboard/${user?.id}`}
            className="py-2 px-6 text-black no-underline text-xl relative group-hover:text-gray-500 transition-all duration-350 ease-in-out"
          >
            Modelos
            <span
              className="absolute top-0 right-0 h-0 w-0 border-t border-r border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform -translate-x-full -translate-y-1/2"
            ></span>
            <span
              className="absolute bottom-0 left-0 h-0 w-0 border-b border-l border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform translate-x-full translate-y-1/2"
            ></span>
          </a>
        </li>
        <li className="list-none mx-2 my-1 relative group" key={Math.random()}>
          <a
            href={`/dashboard/${user?.id}/train`}
            className="py-2 px-6 text-black no-underline text-xl relative group-hover:text-gray-500 transition-all duration-350 ease-in-out"
          >
            Entrenar
            <span
              className="absolute top-0 right-0 h-0 w-0 border-t border-r border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform -translate-x-full -translate-y-1/2"
            ></span>
            <span
              className="absolute bottom-0 left-0 h-0 w-0 border-b border-l border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform translate-x-full translate-y-1/2"
            ></span>
          </a>
        </li>
        <li className="list-none mx-2 my-1 relative group" key={Math.random()}>
          <a
            href="/dashboard/examples"
            className="py-2 px-6 text-black no-underline text-xl relative group-hover:text-gray-500 transition-all duration-350 ease-in-out"
          >
            Ejemplos
            <span
              className="absolute top-0 right-0 h-0 w-0 border-t border-r border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform -translate-x-full -translate-y-1/2"
            ></span>
            <span
              className="absolute bottom-0 left-0 h-0 w-0 border-b border-l border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform translate-x-full translate-y-1/2"
            ></span>
          </a>
        </li>
        <li className="list-none mx-2 my-1 relative group" key={Math.random()}>
          <a
            href="/dashboard/shop"
            className="py-2 px-6 text-black no-underline text-xl relative group-hover:text-gray-500 transition-all duration-350 ease-in-out"
          >
            Tienda
            <span
              className="absolute top-0 right-0 h-0 w-0 border-t border-r border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform -translate-x-full -translate-y-1/2"
            ></span>
            <span
              className="absolute bottom-0 left-0 h-0 w-0 border-b border-l border-black opacity-0 group-hover:opacity-100 group-hover:h-[14px] group-hover:w-[14px] transition-all duration-350 ease-in-out transform translate-x-full translate-y-1/2"
            ></span>
          </a>
        </li>
      </ul>
    </div>
  );
}

