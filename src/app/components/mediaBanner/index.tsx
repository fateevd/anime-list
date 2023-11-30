"use client";
import {FuzzyDate, Media, MediaEdge} from "@/generated/graphql";
import React, {FC, Fragment, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import useClientQuery from "@/app/hook/useClientQuery";
import getTitle from "@/app/utils/getTitle";
import {fragmentAllInfoOfMedia, fragmentTitle} from "@/app/fragment";
import {DateInfo} from "@/app/utils";
import SideScroll from "@/app/components/slider";
import {MdOutlineBookmarkAdd} from "react-icons/md";
import {FaRegStar} from "react-icons/fa";

type Props = {
  params: {
    kino: string;
    type: string;
    section: string;
  };
  section?: string;
};


const query = `
query media($id: Int, $type: MediaType) {
  Media(id: $id, type: $type) {
    ...allMedia
  }
}
${fragmentTitle}
${fragmentAllInfoOfMedia}
`


export const A = ({params, section}: Props) => {

  const {data, loading} = useClientQuery({
    query,
    variables: {
      type: params.type,
      id: params.kino,
    }
  });

  if (params.section !== section) {
    return <div className="test a"/>
  }

  return <MediaBanner data={data} loading={loading}/>
}


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
        }, 750);
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

function formatDate({year, day, month}: FuzzyDate) {
  return new DateInfo().formatStartZero([day, month, year] as number[]);
}

const colorOfScore = (score: number) => {
  const result = score / 10;
  const color = '#ad9c72';

  return <span style={{color}}>{result.toFixed(1)}</span>
}

const info = (media: Media) => {
  const {
    type, meanScore, genres,
    startDate, endDate, countryOfOrigin
    , duration, format, episodes, season, streamingEpisodes
  } = media;
  const date = `c ${formatDate(startDate as FuzzyDate)} - ${formatDate(endDate as FuzzyDate)}`;
  const textInfo = [
    {
      key: 'score',
      value: colorOfScore(meanScore as number)
    },
    {
      key: 'episodes',
      value: Number(duration) * Number(episodes) + ' минут'
    },
    {
      key: 'type',
      value: type
    },
    {
      key: 'genres',
      value: genres?.join(', ').toLowerCase()
    },
    {
      key: 'countryOfOrigin',
      value: countryOfOrigin
    },
    {
      key: 'date',
      value: date
    }];

  return (
    <ul className="flex items-center flex-wrap ">
      {textInfo.map(item =>
        <li key={item.key} className="mr-1.5 text-[15px]">
          {item.value}
        </li>
      )}
    </ul>
  )
}

const renderSlider = (items: MediaEdge[]) => {
  return items?.map((info, mapIndex) => {
      const {node} = info as MediaEdge;
      if (!node) return <></>
      const {push} = useRouter();
      return (
        <Fragment key={info.id}>
          <div className="m-4 relative z-1000 info-block cursor-pointer " area-label="link"
               onClick={() => push(`/${node?.type}/${node?.id}`)}>
            <div className="flex  items">
              <div className="flex  w-full">
                <div className="relative w-full flex ttttttttt ">
                  <div className="">
                    <img
                      className=" w-[210px] h-[300px]"
                      src={node.coverImage?.large ?? ''}
                      alt={getTitle(node.title ?? undefined)}
                    />
                  </div>

                  <div className={`h-[300px] text-info bg-primary relative rounded-r-xl tes`}>
                    <div className="">123123</div>
                    <div
                      className="p-1.5 text-white h-full overflow-hidden hover:overflow-auto  text-sm"
                      dangerouslySetInnerHTML={{__html: node.description ?? ''}}/>
                    <div className="w-full bg-nice absolute bottom-0 flex items-center">
                      {node?.genres?.map((item, index) => {
                          if (index < 2) {
                            return (
                              <div key={item} className="mr-2 bg-gold pb-0.5 pt-0.5 pr-2.5 pl-2.5 rounded-xl ">
                                <p className="text-sm">{item}</p>
                              </div>
                            )
                          }
                        }
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className=" mb-2 text-center mt-1 w-full">
              <h4 style={{color: node.coverImage?.color ?? ''}}
                  className="font-medium text-lg  h-6 overflow-hidden ">{getTitle(node.title ?? undefined)}</h4>
            </div>
          </div>
        </Fragment>
      )
    }
  )
}


const test = ({edges, staff, studios}: any) => {
  const voice = edges.reduce((acc, val) => {
    acc.push({node: val.voiceActorRoles[0]?.voiceActor});
    return acc;
  }, []);
  return [
    {
      title: 'Герои',
      list: edges,
    },
    {
      title: 'Голоса героев',
      list: voice,
    },
    {
      title: 'Команда',
      list: staff,
    },
    {
      title: ' Студия',
      list: studios,
    },
  ].map(item =>
    <div key={item.title}>
      <p className="mt-2">{item.title}</p>
      {item.list?.map((item, index) => {
          if (!item || index > 6) return <></>
          return (
            <div key={item?.id}
                 className="w-[200px] mt-0.5">{typeof item.node?.name === "object" ? getTitle(item.node?.name) : item.node?.name}</div>
          )
        }
      )}
    </div>
  )
}

const Banner = ({media, closeBanner}: y) => {

  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    {
      label: 'Об аниме', content:
        <TabsContent key={1}>
          <div className=" text-white w-[40%] h-[70%] flex  flex-col justify-center">
            <div className="d-flex justify-center">
            </div>
            <div className="font-xl text-gray">
              {info(media)}
            </div>
            <div className="h-[4.5rem] overflow-hidden" dangerouslySetInnerHTML={{__html: media?.description ?? ''}}/>
            <div className="flex items-center mt-3">
              {media.trailer &&
                <button type="button" area-label="link" onClick={() => {
                  window.open(`https://www.youtube.com/watch?v=${media.trailer?.id}`)
                }}
                        className="bg-[#272727] pr-5 pl-5 pt-2.5 pb-2.5 rounded-xl flex items-center mr-2">
                  <span className="mr-1.5">Трейллер</span>
                </button>
              }
              <button type="button" onClick={console.log}
                      className="bg-[#272727] pr-5 pl-5 pt-2.5 pb-2.5 rounded-full mr-2">
                <MdOutlineBookmarkAdd size={27}/>
              </button>
              <button type="button" onClick={console.log}
                      className="bg-[#272727] pr-5 pl-5 pt-2.5 pb-2.5 rounded-full flex items-center">
                <span className="block mr-1">Оценить</span>
                <FaRegStar size={20}/>
              </button>
            </div>

            <ul className="evalution">
              {Array.from({length: 10}).map((_, index) =>
                <li key={index}>{index + 1}</li>
              )}
            </ul>

          </div>
        </TabsContent>
    },
    {
      label: 'Связаное аниме', content:
        <TabsContent key={2}>
          <div className="flex h-[80%] items-center">
            <div className=" text-white w-full  h-[80%]  flex flex-col justify-center">
              <SideScroll items={renderSlider(media?.relations?.edges as MediaEdge[])}/>
            </div>
          </div>
        </TabsContent>
    },
    {
      label: 'Детали', content: <TabsContent key={3}>
        <div className="flex h-[65%] justify-between">
          <div className=" text-white w-[55%] flex flex-col justify-center">
            <div className="flex items-center">
              <div className="font-xl text-gray mt-5">
                {info(media)}
              </div>
            </div>
            <div className="" dangerouslySetInnerHTML={{__html: media?.description ?? ''}}/>
          </div>
          <div className="grid grid-cols-2 flex-col w-[35%]">
            {test({edges: media.characters?.edges, staff: media.staff?.edges, studios: media.studios?.edges})}
            <div className="">
              <div className="mt-3">
                <p>Оригинальное название</p>
                {getTitle(media.title, 2)}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    },
  ];

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
        <div className="flex flex-col h-full relative">
          <h1 className={`title ${activeTab ? 'not-main' : 'is-main'}`}
              style={{color: media?.coverImage?.color ?? '#fff'}}>{getTitle(media?.title as Media)}</h1>
          {tabs[activeTab].content}
        </div>
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
    <div className="tab-content h-full  myText">
      {children}
    </div>
  );
};


