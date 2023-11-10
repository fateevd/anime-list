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


const fragmentMedia: string = `fragment media on Media {
  id,
  type
  title {
    english
    native
    romaji
  }
  favourites
  meanScore
  averageScore
   coverImage {
   
    extraLarge
    large
    medium
    color
  }
}`;

const mediaList = `
query (
  $type: MediaType
){
    trending: Page(page: 1, perPage: 10) {
      media(sort: TRENDING_DESC, type: $type, isAdult: false) {
        ...media
      }
    }
    top: Page(page: 1, perPage: 10) {
      media(sort: SCORE_DESC, type: $type, isAdult: false) {
      ...media
      }
    }
    other:Page(page: 1, perPage: 100){
    media(type:$type) {
      ...media
    }
  }
}
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

  const {trending, other, top} =
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

      </main>
    </>
  )
}


const query = `
query media($id: Int, $type: MediaType, $isAdult: Boolean, $season:  MediaSeason,  $seasonYear: Int) 
  {
  Media(id: $id, type: $type, isAdult: $isAdult, sort: POPULARITY_DESC, season:$season, seasonYear: $seasonYear
  ) {
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
    trailer {
      id
      site
    }
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






