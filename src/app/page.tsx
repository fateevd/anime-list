import {gql} from "@apollo/client";
import {Media} from "@/generated/graphql";
import {Unit} from "@/types";
import {useQuery} from "@/graphql/useQuery";
import React from "react";
import MediaBanner, {A} from "@/app/components/mediaBanner";
import SideScroll from "@/app/components/slider";
import {MediaCard} from "@/app/components/mediaCard";
import Other from "@/app/components/other";
import {TypeSearchParams} from "@/app/types";
import Search from "@/app/components/search";
import Header from "@/app/components/header";


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
}`

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


export default async function Home({searchParams}: Unit<TypeSearchParams>) {
  const {data} = await useQuery({
      query: gql`${mediaList}`,
      variables: {
        "season": "FALL",
        "seasonYear": 2023,
        "type": "ANIME"
      }
    }
  );

  const {trending, other, top} =
    data as Unit<Unit<Media[]>>

  return (
    <>
      <Header>
        <Search emptyList={trending.media}/>
      </Header>
      <main className="w-full h-[100vh] mr-auto ml-auto ">
        <Test/>
        <div className="w-[95%] mr-auto ml-auto">
          <div className="flex items-center title-section">
            <h4 className="text-white text-primary mr-2"> Топ-10 </h4>
            <span> за месяц </span>
          </div>
          <div className="flex justify-center w-11/12 mr-auto ml-auto">
            <SideScroll items={renderSlider(trending.media, 'trending')}/>
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


const media = `
query media($type: MediaType, $isAdult: Boolean, $season:  MediaSeason,  $seasonYear: Int) 
  {
  Media(type: $type, isAdult: $isAdult, sort: POPULARITY_DESC, season:$season, seasonYear: $seasonYear
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

async function Test() {
  const {data, loading} = await useQuery({
    query: gql`${media}`,
    variables: {
      type: 'ANIME',
      "season": "FALL",
      'seasonYear': 2023,
    }
  });


  return (
    <div className="mt-[55px]">
      <MediaBanner data={data} isStartBanner={true} />
    </div>
  )
}





