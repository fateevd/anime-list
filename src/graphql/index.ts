import {ApolloLink, HttpLink, InMemoryCache} from "@apollo/client";
import {
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import {registerApolloClient} from "@apollo/experimental-nextjs-app-support/rsc";

const ENDPOINT_QUERY = 'https://graphql.anilist.co';


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


export const {getClient} = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: ENDPOINT_QUERY,
    }),
  });
});

