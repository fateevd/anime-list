"use client"
import {ReactNode, useCallback, useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import store from "@/app/store";
import {Media} from "@/generated/graphql";

interface SideScrollProps {
  items: ReactNode[];
  data?: unknown[];
}

function SideScroll({items, data}: SideScrollProps) {
  const [scrollX, setScrollX] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      let newScrollX = scrollX + container.clientWidth; // Измените эту величину по вашему усмотрению
      const maxScroll = 0;
      if (newScrollX >= maxScroll) {
        newScrollX = 0;
      }
      setScrollX(newScrollX);
    }
  };

  const [visible, setVisible] = useState(false);
  const {add, replace} = store(state => state);

  useEffect(() => {
    if (data) {
      add(data as Partial<Media>[])
    }

    setTimeout(() => {
      setVisible((scrollContainerRef?.current?.scrollWidth || 0) > window.innerWidth);
    }, 200);

    return () => {
      if (data) {
        replace();
      }
    }

  }, [replace, add, data]);

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      let newScrollX = scrollX - container.clientWidth;
      const minScroll = container.clientWidth - container.scrollWidth;
      if (newScrollX <= minScroll) {
        newScrollX = minScroll;
      }
      setScrollX(newScrollX);
    }
  };


  const max = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const minScroll = container.clientWidth - container.scrollWidth;
      if (scrollX === minScroll) {
        return "hidden"
      }
    }
    return ''
  }, [scrollContainerRef, scrollX]);



  return (
    <div className="side-scroll ">
      <div className={scrollX === 0 ? 'hidden' : ''}>
        <button className="scroll-button right" onClick={scrollLeft}>
          &gt;
        </button>
      </div>
      <div className="overflow-hidden">
        <div className="scroll-container" style={{transform: `translateX(${scrollX}px)`}} ref={scrollContainerRef}>
          {items.map((item, index) =>
            <div className="scroll-item  " key={index}>
              {item}
            </div>
          )}
        </div>
      </div>
      <div className={`${max()} ${visible ? '' : 'hidden'}`}>
        <button className="scroll-button left" onClick={scrollRight}>
          &lt;
        </button>
      </div>
    </div>
  );
}

export default SideScroll