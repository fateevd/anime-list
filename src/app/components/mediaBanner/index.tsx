"use client";
import {Media} from "@/generated/graphql";
import React, {FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Unit} from "@/types";
import {AiOutlineClose} from "react-icons/ai";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";

export const dynamic = "force-dynamic";

// type Props = {
//   Media: Media;
// };


type Props = {
  params: {
    kino: string;
    type: string;
    section: string;
  };
  section?: string;
};


export const A = ({params, section}: Props) => {

  const {data, loading} = useQuery(t, {
    variables: {
      type: params.type,
      id: params.kino,
      $isAdult: "false",
    }
  });

  if (params.section !== section) {
    return <div className="test a"/>
  }


  if (loading) {
    return (
      <div className="w-full text-primary anime  expanded h-[717px] ">
        <Loading/>
      </div>
    )
  }

  return <MediaBanner data={data}/>
}


const media = `query media($id: Int, $type: MediaType, $isAdult: Boolean) {
  Media(id: $id, type: $type, isAdult: $isAdult) {
    id
    type
    title {
      english
      native
    }
    coverImage {
      extraLarge
      color
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description
    seasonYear
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    meanScore
    averageScore
    popularity
    favourites
    countryOfOrigin
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    trailer {
      id
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
     relations {
      edges {
        id
        relationType(version: 2)
        node {
          id
          title {
            userPreferred
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
      }
    }
  }
}
`
const t = gql`${media}`

export default function MediaBanner({data, isStartBanner}: any) {
  const {push} = useRouter();

  const {Media} = data as Unit<Media>;
  const elementToScroll = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementToScroll.current && !isStartBanner) {
      elementToScroll.current.scrollIntoView({block: 'center', behavior: 'smooth'});
      elementToScroll.current.classList.add('expanded');
    }
  }, [Media]);

  const tabs = [
    {label: 'О аниме', content: <div>Content for Tab 1</div>},
    {label: 'Связаное аниме', content: <div>Content for Tab 3</div>},
    {label: 'Детали', content: <div>Content for Tab 2</div>},
  ];


  const closeBanner = useMemo(() => {

    if (isStartBanner) {
      return <></>
    }

    return (
      <div className="absolute right-20 top-8 z-10 t" onClick={() => {
        elementToScroll?.current?.classList.remove('expanded');
        elementToScroll?.current?.removeChild(elementToScroll?.current.children[0])
        elementToScroll?.current?.classList.add('h-0');
        setTimeout(() => {
          push('/', {scroll: false});
        }, 500);
      }}>
        <AiOutlineClose size="30"/>
      </div>
    )
  }, [isStartBanner]);


  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };


  const info = useMemo(() => {

    const array = [Number(Media.averageScore) / 10, Media.seasonYear, Number(Media.favourites) / 100, Media.type, Media.type, Media.popularity];


  }, [])

  return (
    <>
      <div className={`w-full overflow-hidden relative anim ${isStartBanner && 'expanded'}`} ref={elementToScroll}>
        <div className="relative h-full w-full ">
          <div className="relative z-10  w-full h-full pl-16 pr-16 pt-3 pb-3"
               style={{background: 'linear-gradient(90deg, rgb(0, 0, 0) 29%, rgb(255, 255, 255, 0))'}}>
            <div className="flex w-100 pt-4 justify-center">
              <Tabs tabs={tabs} callback={handleTabClick} active={activeTab}/>
            </div>
            {closeBanner}
            <TabsContent>
              <div className=" text-white w-[32%] h-2/3 overflow-hidden flex flex-col justify-center">
                <div className="d-flex justify-center">
                  <h1 className="title"
                      style={{color: Media.coverImage?.color ?? '#fff'}}>{Media.title?.english ?? Media.title?.native}</h1>
                </div>
                <div>
                  {info}
                </div>
                <div className="h-[4.5rem] overflow-hidden" dangerouslySetInnerHTML={{__html: Media.description}}/>
              </div>
            </TabsContent>

          </div>

          <div className="card w-[100vh] absolute top-0 z-0 p-0 "
               style={{
                 background: `url(${Media.bannerImage ?? Media.coverImage?.extraLarge}) no-repeat`,
               }}
          />
        </div>
      </div>
    </>
  )
}


interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  callback: (index: number) => void;
  active: number;
}

const Tabs: FC<TabsProps> = ({tabs, active, callback}) => {
  return (
    <div className="tabs">
      <ul className="tab-list cursor-pointer flex justify-between">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`tab-item ${index === active ? 'active' : ''}`}
            onClick={() => callback(index)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const TabsContent: FC<PropsWithChildren> = ({children}) => {
  return (
    <div className="tab-content h-full">
      {children}
    </div>
  );
};


