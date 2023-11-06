import {Unit} from "@/types";
import React from "react";
import {TypeSearchParams} from "@/app/types";
import Main from "@/app/page/main";

export default function Home({searchParams}: Unit<TypeSearchParams>) {
  return <Main searchParams={searchParams}/>
}







