'use client';
import React from "react";
import {AiFillHeart, AiOutlineSmile} from "react-icons/ai";
import {useRouter} from "next/navigation";
import useQueryParams from "@/app/hook/useQueryParams";
import getTitle from "@/app/utils/getTitle";
import {FaRegGrinHearts, FaRegSadCry} from "react-icons/fa";

type Props = {
  item: any;
  section: string;
};

const faceRating = {
  6: <FaRegSadCry/>,
  7: <AiOutlineSmile/>,
  8: <FaRegGrinHearts/>,
}

const round = (number: number) => {
  const result = number / 10;

  let reaction = faceRating[7];
  if (result < 6.) {
    reaction = faceRating[6];
  } else if (result >= 8) {
    reaction = faceRating[8];
  }

  return (
    <div className="bg-nice pr-1.5 pl-1.5 flex items-center rounded-xl ">
      <span className="mr-1">{result.toFixed(1)}</span>
      {reaction}
    </div>
  )
}

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
            alt={getTitle(item.title ?? undefined)}
          />
          <div className="text-[13px] flex absolute top-0 justify-between items-center w-full  pt-2 pr-11 pl-11">
            {round(item.meanScore)}
            <div className="bg-sakura pr-1.5 pl-1.5 flex items-center rounded-xl ">
              <AiFillHeart/>
              <span className="ml-1">{item.favourites}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-2 text-center mt-1">
        <h4 style={{color: item?.coverImage?.color ?? ''}}
            className="font-medium text-lg  h-6 overflow-hidden hover:text-white ">{getTitle(item.title ?? undefined)}</h4>
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