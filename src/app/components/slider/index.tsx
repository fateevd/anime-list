"use client"
import {ReactElement, ReactNode, useCallback, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import useQueryParams from "@/app/utils/useQueryParams";

interface SideScrollProps {
  items: ReactNode[];
}

function SideScroll({items}: SideScrollProps) {
  const [scrollX, setScrollX] = useState(0);
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
            <div className="scroll-item " key={index}>
              {item}
            </div>

          )}
        </div>
      </div>
      <div className={max()}>
        <button className="scroll-button left" onClick={scrollRight}>
          &lt;
        </button>
      </div>
    </div>
  );
}

export default SideScroll