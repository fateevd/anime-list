import {gql, OperationVariables} from "@apollo/client";
import {Media} from "@/generated/graphql";
import {Unit} from "@/types";
import useServerQuery from "@/app/hook/useServerQuery";
import React from "react";
import MediaBanner, {A} from "@/app/components/mediaBanner";
import SideScroll from "@/app/components/slider";
import {MediaCard} from "@/app/components/mediaCard";
import Other from "@/app/components/other";
import Variables from "@/app/utils";
import {fragmentAllInfoOfMedia, fragmentMedia, fragmentTitle} from "@/app/fragment";


const mediaList = `
query (
  $type: MediaType
){
    trending: Page(page: 1, perPage: 10) {
      media(sort: TRENDING_DESC, type: $type) {
        ...media
      }
    }
    top: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: $type) {
        ...media
      }
    }
    popular: Page(page: 1, perPage: 10) {
      media(sort: POPULARITY_DESC, type: $type) {
        ...media
      }
    }
    other:Page(page: 1, perPage: 30){
      media(type:$type) {
      ...media
    }
  }
}
${fragmentTitle}
${fragmentMedia}
`;

const renderSlider = (array: Media[], section: string) => {
  return array && array?.map((item, index) => {
    return (
      <div key={index}
           className=" flex cursor-pointer items-center relative">
        <h2 className="relative top-list text-primary z-0">{index + 1}</h2>
        <div className="z-10 ml-6">
          <MediaCard item={item} section={section}/>
        </div>
      </div>
    )
  })
}


export default async function Main({searchParams, id, type}: any) {
  const {listVariables} = new Variables(id, type, true);

  const {data} = await useServerQuery({
      query: mediaList,
      variables: listVariables as OperationVariables,
    }
  );

  const {trending, other, top,popular, } =
    data as Unit<Unit<Media[]>>

  return (
    <>
      <main className="w-full h-[100vh] mr-auto ml-auto ">
        <Test id={id} type={type}/>
        <div className="w-[95%] mr-auto ml-auto">
          <div className="flex items-center title-section">
            <h4 className="text-white text-primary mr-2"> Топ-10 </h4>
            <span> за месяц </span>
          </div>
          <div className="flex justify-center w-11/12 mr-auto ml-auto">
            <SideScroll data={trending.media} items={renderSlider(trending.media, 'trending')}/>
          </div>
        </div>
        {searchParams.section && <A params={searchParams} section={'trending'}/>}

        <div className="w-[95%] mr-auto ml-auto">
          <div className="flex items-center title-section">
            <h4 className="text-white text-primary mr-2"> Топ-100 </h4>
            <span> за все время </span>
          </div>
          <div className="flex justify-center w-11/12 mr-auto ml-auto">
            <SideScroll items={renderSlider(top?.media, 'top')}/>
          </div>
        </div>
        {searchParams.section && <A params={searchParams} section={'top'}/>}

        <Other media={other.media} searchParams={searchParams}/>
        
        <div className="w-[95%] mr-auto ml-auto">
          <div className="flex items-center title-section">
            <h4 className="text-white text-primary mr-2"> </h4>
            <span>  Популярное за все время </span>
          </div>
          <div className="flex justify-center w-11/12 mr-auto ml-auto">
            <SideScroll items={renderSlider(popular?.media, 'popular')}/>
          </div>
        </div>
        {searchParams.section && <A params={searchParams} section={'popular'}/>}
      </main>
    </>
  )
}


const query = `
query media($id: Int, $type: MediaType, $isAdult: Boolean, $season:  MediaSeason,  $seasonYear: Int) {
  Media(id: $id, type: $type, isAdult: $isAdult, sort: POPULARITY_DESC, season:$season, seasonYear: $seasonYear) {
    ...allMedia
  }
}
${fragmentAllInfoOfMedia}
${fragmentTitle}
`

async function Test({id, type}: any) {
  const {listVariables} = new Variables(id, type, false);

  const {data} = await useServerQuery({
    query,
    variables: listVariables as OperationVariables,
  });


  return (
    <div className="mt-[55px]">
      <MediaBanner data={data} isStartBanner={true}/>
    </div>
  )
}






