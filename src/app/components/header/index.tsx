'use client';
import React, {Fragment, PropsWithChildren, useEffect, useState} from 'react';
import Link from "next/link";
import {BsSearch} from "react-icons/bs";
import {AiOutlineClose} from "react-icons/ai";

export default function Header({children}: PropsWithChildren) {
  const initialValue = typeof window !== "undefined" ? window.pageYOffset : 0;
  const [position, setPosition] = useState(initialValue);
  useEffect(() => {
    const handleScroll = () => {
      let moving = window.pageYOffset
      if (moving > 35) {
        setPosition(moving * -1)
      }
      if (moving > -100) {
        setPosition(moving * -1)
      }
    };
    window.addEventListener("scroll", handleScroll);
    return (() => {
      window.removeEventListener("scroll", handleScroll);
    })
  }, []);

  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);

  return (
    <header className="flex items-center p-5 fixed ttt w-full  z-50 bg-[black]" style={{top: position}}>
      <div className="flex justify-center items-center w-full h-[42px]">
        {!isSearchMode ?
          <>
            {["Главное", "Мое", "Манга", "Социал"].map(item =>
              <Fragment key={item}>
                <Link className="mr-10" href='/'>
                  {item}
                </Link>
              </Fragment>
            )}
            <button type="button" className="cursor-pointer" onClick={() => setIsSearchMode(true)}>
              <BsSearch size="20" />
            </button>
          </>
          :
          !position &&
            <>
              {children}
                <button type="button" className="ml-3 cursor-pointer hover:text-[white]" onClick={() => {
                  setIsSearchMode(false)
                }}>
                    <AiOutlineClose color="#868686" size="21" />
                </button>
            </>
        }
      </div>
    </header>
  )
    ;
};

