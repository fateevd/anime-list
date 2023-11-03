"use client"
import {MediaCard} from "@/app/components/mediaCard";
import {A} from "@/app/components/mediaBanner";
import {Media} from "@/generated/graphql";
import {Fragment, useEffect, useMemo, useState} from "react";
import {TypeSearchParams} from "@/app/types";

function Other({media, searchParams}: {media: Media[], searchParams: TypeSearchParams}) {
  const initialValue = typeof window !== "undefined" ? Math.floor(window.innerWidth / 350) : 5;
  const [slice, setSlice] = useState<number>(() => initialValue);

  useEffect(() => {

    const resizeEvent = () => {
      const count = Math.floor(window.innerWidth / 350);
      if (count !== slice) {
        setWidth(window.innerWidth)
      }
    }
    
    
    addEventListener("resize", resizeEvent);

    return () => {
      removeEventListener("resize", resizeEvent)
    }

  }, [slice])

  const setWidth = (width: number) => {
    setSlice(Math.floor(width / 350))
  }

  const render = useMemo(() => {
    const resultSliceOfArray: Media[][] = [];
    if (!media) {
      return resultSliceOfArray;
    }
    for (let i = 0; i < media.length; i += slice) {
      resultSliceOfArray.push(media.slice(i, i + slice));
    }
    return resultSliceOfArray;
  }, [media, slice]);


  return (
    <div className="flex flex-wrap ">
      {render.map((item, index) =>
        <Fragment key={index}>
          <div className="w-11/12 mr-auto ml-auto flex flex-wrap justify-center ">
            {item.map(info =>
              <MediaCard key={info?.id} item={info} section={`other_${index}`}/>
            )}
          </div>
          {searchParams.section && <A params={searchParams} section={`other_${index}`}/>}
        </Fragment>
      )}
    </div>
  );
}

export default Other;