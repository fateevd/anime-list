"use client";

import {PropsWithChildren} from "react";
import {AiOutlineClose} from "react-icons/ai";
import {useRouter} from "next/navigation";

export default function InnerAlert({children}: PropsWithChildren) {
  const {push} = useRouter()
  return (
    <div className="absolute sm:w-2/3 xl:w-[370px]  top-1/2 left-1/2" style={{transform: 'translate(-50%, -50%)'}}>
      <div className="p-10 bg-mainBackground rounded-3xl w-full relative">
        <div className="h-full absolute right-8 top-6 cursor-pointer" aria-label="button" onClick={() => push('/')}>
          <AiOutlineClose size="25"/>
        </div>
        <div/>
        {children}
      </div>
    </div>
  )
}
