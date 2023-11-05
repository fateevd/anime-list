'use client';
import React from "react";
import {AiOutlineHeart, AiOutlineSmile} from "react-icons/ai";
import {useRouter} from "next/navigation";
import useQueryParams from "@/app/hook/useQueryParams";

type Props = {
  item: any;
  section: string;
};


export function MediaCard({item, section}: Props) {
  const {push} = useRouter()
  const {kino} = useQueryParams();
  const te = () => push(`?kino=${item.id}&type=${item.type}&section=${section}`, {scroll: false});

  const selected = item.id === Number(kino);

  return (
    <div className="m-4 w-[270px]  relative t z-1000">
      <div className="flex flex-col  w-full">
        <div onClick={te} className={`relative w-full`}>
          <img
            className="object-contain w-full h-[300px]  "
            src={item?.coverImage?.large ?? ''}
            alt={item?.title?.english ?? ''}
          />
          {/*/TODO: сделать разделение на блоки, добавить разнообразия для отображени/*/}
          <div className="text-[13px] flex absolute top-0 justify-between items-center w-full  pt-2 pr-11 pl-11">
            <div className="bg-nice pr-1.5 pl-1.5 flex items-center">
              <span className="mr-1">{item.meanScore / 10}</span>
              <AiOutlineSmile/>
            </div>
            <div className="bg-sakura pr-1.5 pl-1.5 flex items-center ">
              <AiOutlineHeart/>
              <span className="ml-1">{item.favourites}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-2 text-center mt-1">
        <h4 style={{color: item?.coverImage?.color ?? ''}}
            className="font-medium text-lg  h-6 overflow-hidden hover:text-white ">{item?.title?.english ?? item.title?.native}</h4>
      </div>
      {selected &&
          <div className="w-full flex justify-center">
              <div className="absolute  choosen w-[80%]  h-full bottom-[10px]"></div>
              <div className="absolute flex justify-center w-full">
                  <div className="step4"></div>
              </div>
          </div>
      }
    </div>
  )
}