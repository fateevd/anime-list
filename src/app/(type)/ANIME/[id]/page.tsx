import React from 'react';
import Main from "@/app/page/main";

const Page = ({params, searchParams}: any) => {
  return (
    <Main searchParams={searchParams} id={params.id} type="ANIME" />
  );
};

export default Page;
