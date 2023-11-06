import React from 'react';
import Main from "@/app/page/main";

const Page = ({searchParams}: any) => {
  return <Main searchParams={searchParams} type="MANGA"/>;
};

export default Page;
