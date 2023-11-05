"use client";

import {Fragment, useCallback, useEffect, useMemo, useState} from 'react'
import {gql, useQuery} from "@apollo/client";
import {FiPlay} from "react-icons/fi";
import {Media} from "@/generated/graphql";
import Loading from "@/app/loading";
import {Unit} from "@/types";
import {AiOutlineClose} from "react-icons/ai";

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


function useDebounce(effect: any, dependencies: any, delay: any) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}

export default function Search({emptyList}: Unit<Partial<Media>[]>) {
  const [search, setSearch] = useState<string>("");

  const {data, loading} = useQuery(query, {
    variables: {
      "sort": "SEARCH_MATCH",
      "search": search,
    },
  });


  const [value, setValue] = useState<string>("")


  const [focused, setFocused] = useState<boolean>(false);


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
      return <Loading/>
    }

    const text = search.length === 0 ? 'Топ 10 аниме за месяц' : 'Амиме и манга';

    return (
      <>
        <li className="text-[12px] mt-1 ml-4 mb-1.5 text-[#868686] ">{text}</li>
        {
          info?.map(item =>
            <Fragment key={item.id}>
              <li className="pr-3 pl-3 flex justify-between items-center cursor-pointer hover:bg-[#efeeee]"
                  aria-label="link" onClick={() => console.log(item.id)}>
                <div className="flex items-center ">
                  <img className="mr-2.5 p-1.5" width={45} src={item?.coverImage?.medium ?? ''}
                       alt={`banner ${item?.title?.english}`}/>
                  <div className="mt-0.5">
                    <h3>{item?.title?.english ?? item?.title?.userPreferred}</h3>
                    <div className="flex text-xs ">
                      <p className="font-medium mr-1">{item?.averageScore ? item?.averageScore / 10 : 'Нет оценок'}</p>
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
            onBlur={() => setFocused(false)}
            onFocus={() => setFocused(true)}
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
          <div
            className={`flex absolute  inset-y-0 left-[93%] items-center ${value.length === 0 && 'pointer-events-none'}`}>
            {value.length === 0 ?
              <svg className="w-5 h-5 text-[#868686]" fill="currentColor" viewBox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clip-rule="evenodd"></path>
              </svg>
              :
              <button type="button" className="z-10 cursor-pointer" onClick={(event) => {
                event.stopPropagation();
                setValue("")
              }}>
                <AiOutlineClose color="#868686"/>
              </button>
            }
          </div>
        </div>
      </div>
      <div className="absolute z-50 w-full h-full mt-1">
        {focused &&
            <ul className={`w-full pt-3 pb-3 rounded-2xl text-[black] bg-[white] ${loading && 'h-[670px]'}`}>
              {list}
            </ul>
        }
      </div>
    </div>
  )
}
