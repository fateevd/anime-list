"use client";
import {Media} from "@/generated/graphql";
import React, {FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {AiOutlineClose} from "react-icons/ai";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {namedTypes} from "ast-types";


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

  return <MediaBanner data={data} loading={loading}/>
}

const media = `query media($id: Int, $type: MediaType) {
  Media(id: $id, type: $type) {
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

export default function MediaBanner({isStartBanner, data, loading = false}: any) {


  const {push} = useRouter();


  const elementToScroll = React.useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (elementToScroll.current && !isStartBanner) {
      elementToScroll.current.scrollIntoView({block: 'center', behavior: 'smooth'});
      elementToScroll.current.classList.add('expanded');
    }

  }, [data, isStartBanner]);

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
  }, [isStartBanner, push]);


  const content = useMemo(() => {
    if (loading || !data) {
      return <Loading/>
    }

    return <Banner media={data.Media as Media} closeBanner={closeBanner}/>

  }, [closeBanner, data, loading]);


  return (
    <div className={`w-full overflow-hidden relative anim ${isStartBanner && 'expanded'}`} ref={elementToScroll}>
      {content}
    </div>
  )
}

type y = {
  closeBanner: React.JSX.Element,
  media: Media,
}

const Banner = ({media, closeBanner}: y) => {


  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Об аниме', content: <TabsContent key={1}>
        <div className=" text-white w-[32%] h-2/3 overflow-hidden flex flex-col justify-center">
          <div className="d-flex justify-center">
          </div>
          <div>
            {/*{info}*/}
          </div>
          <div className="h-[4.5rem] overflow-hidden" dangerouslySetInnerHTML={{__html: media?.description ?? ''}}/>
        </div>
      </TabsContent>
    },
    {
      label: 'Связаное аниме', content: <TabsContent key={2}>
        <div className=" text-white w-[32%] h-2/3 overflow-hidden flex flex-col justify-center">
          <div className="d-flex justify-center">
          </div>
          <div>
            {/*{info}*/}
          </div>
          <div className="h-[4.5rem] overflow-hidden" dangerouslySetInnerHTML={{__html: media?.description ?? ''}}/>
        </div>
      </TabsContent>
    },
    {
      label: 'Детали', content: <TabsContent key={3}>
        <div className=" text-white w-[32%] h-2/3 overflow-hidden flex flex-col justify-center">
          <div className="d-flex justify-center">
          </div>
          <div>
            {/*{info}*/}
          </div>
          <div className="h-[4.5rem] overflow-hidden" dangerouslySetInnerHTML={{__html: media?.description ?? ''}}/>
        </div>
      </TabsContent>
    },
  ];

  // console.log(tabContainer)

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const style = activeTab ? {
    backdropFilter: 'blur(12px)',
    background: 'radial-gradient(circle, rgba(237,237,237,0.9416141456582633) 0%, rgba(0,0,0,0.6474964985994398) 0%)',
  } : {
    background: 'linear-gradient(90deg, rgb(0, 0, 0) 29%, rgb(255, 255, 255, 0))',
  }

  return (
    <div className="relative h-full w-full ">
      <div className="relative z-10  w-full h-full pl-16 pr-16 pt-3 pb-3"
           style={style}>
        <div className="flex w-100 pt-4 justify-center">
          <Tabs tabs={tabs} callback={handleTabClick} active={activeTab}/>
        </div>
        {closeBanner}
        <h1 className={`title ${activeTab ? 'not-main' : 'is-main'}`}
            style={{color: media?.coverImage?.color ?? '#fff'}}>{media?.title?.english ?? media?.title?.native}</h1>
        {tabs[activeTab].content}

      </div>

      <div className="card w-[100vh] absolute top-0 z-0 p-0 "
           style={{
             background: `url(${media?.bannerImage ?? media?.coverImage?.extraLarge}) no-repeat`,
           }}
      />
    </div>
  );
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
    <div className="tab-content h-full myText">
      {children}
    </div>
  );
};


