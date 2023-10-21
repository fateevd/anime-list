"use client"
import {ApolloNextAppProvider, NextSSRApolloClient, NextSSRInMemoryCache, SSRMultipartLink,} from "@apollo/experimental-nextjs-app-support/ssr";
import {FC, PropsWithChildren} from "react";
import {ApolloLink, HttpLink} from "@apollo/client";
import {__DEV__} from "@apollo/client/utilities/globals";
import {loadDevMessages, loadErrorMessages} from "@apollo/client/dev";

const ENDPOINT_QUERY = 'https://graphql.anilist.co';


if (__DEV__) {  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export function makeClient() {
  const httpLink = new HttpLink({
    uri: ENDPOINT_QUERY,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
        : httpLink,
  });
}

const GraphQlProvider: FC<PropsWithChildren> = ({children}) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default GraphQlProvider;