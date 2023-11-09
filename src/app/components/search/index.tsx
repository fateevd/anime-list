"use client";

import React, {Fragment, useMemo, useState} from 'react'
import {gql, useQuery} from "@apollo/client";
import {FiPlay} from "react-icons/fi";
import {Media} from "@/generated/graphql";
import useDebounce from "@/app/hook/useDebaunce";
import store from "@/app/store";
import Link from "next/link";
import storeList from "@/app/store/searchList";

const query = gql`
query (
  $page: Int = 1
  $search: String
  $seasonYear: Int
  $genres: [String]
  $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
) {
  Page(page: $page, perPage: 10) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(
      search: $search
      seasonYear: $seasonYear
      genre_in: $genres
      sort: $sort
    ) {
      id
      title {
        userPreferred
        english
        romaji
      }
      coverImage {
        medium
      }
      seasonYear
      type
      format
      genres
      averageScore
      popularity
      favourites
    }
  }
}
`


export default function Search() {
  const [search, setSearch] = useState<string>("");
  const emptyList = store(state => state.trending);

  const {isOpenList, open, close} = storeList();

  const {data, loading} = useQuery(query, {
    variables: {
      "sort": "SEARCH_MATCH",
      "search": search,
    },
  });


  const [value, setValue] = useState<string>("")

  useDebounce(() => {
    setSearch(value);
  }, [value], 400);


  const list = useMemo(() => {

    const info: Media[] = search.length === 0 ? emptyList : data?.Page?.media;

    if (search.length !== 0 && info?.length === 0) {
      return <li className="mt-5 mb-5 text-sm text-[#868686] mr-auto ml-auto w-[50%]">Для просмотра ничего не
        найдено</li>
    }

    if (loading) {
      return <></>
    }

    const text = search.length === 0 ? 'Топ 10 аниме за месяц' : 'Амиме и манга';

    return (
      <>
        <li className="text-[12px] mt-1 ml-4 mb-1.5 text-[#868686] ">{text}</li>
        {
          info?.map(item =>
            <Fragment key={item.id}>
              <Link href={`/${item.type}/${item.id}`} onClick={console.log}>
                <li className="pr-3 pl-3 flex justify-between items-center cursor-pointer hover:bg-[#efeeee]"
                >
                  <div className="flex items-center ">
                    <img className="mr-2.5 p-1.5" width={45} src={item?.coverImage?.medium ?? ''}
                         alt={`banner ${item?.title?.english}`}/>
                    <div className="mt-0.5">
                      <h3>{item?.title?.english ?? item?.title?.userPreferred}</h3>
                      <div className="flex text-xs ">
                        <p
                          className="font-medium mr-1">{item?.averageScore ? item?.averageScore / 10 : 'Нет оценок'}</p>
                        <p className="text-[#868686]">{item?.type?.toLowerCase()}</p>
                        <p className="text-[#868686]">{item?.seasonYear}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-xs bg-primary pr-1.5 pl-1.5 pt-1 pb-1 text-[white] rounded-xl flex items-center">
                    <FiPlay/>
                    <p className="ml-0.5">Смотреть</p>
                  </div>
                </li>
              </Link>
            </Fragment>
          )
        }
      </>
    )
  }, [data?.Page?.media, emptyList, loading, search.length])


  return (
    <div className="w-[500px] relative z-100">
      <div>
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <input
            onBlur={() => setTimeout(() => {
              close();
            }, 100)}
            onFocus={open}
            type="text" id="simple-search" value={value} onChange={(e) => setValue(e.target.value)}
            className="outline-none bg-gray-50 border
             text-gray-900 text-sm rounded-lg
              block
              w-full
              pt-2.5 pb-2.5 pr-3 pl-3
              bg-[white]
              text-[black]
              z-10"
            placeholder="Найти аниме"/>
        </div>
      </div>
      <div className="absolute z-50 w-full h-full mt-1">
        {isOpenList &&
          <ul className={`w-full pt-3 pb-3 rounded-2xl text-[black] bg-[white] ${loading && 'h-[670px]'}`}>
            {list}
          </ul>
        }
      </div>
    </div>
  )
}
