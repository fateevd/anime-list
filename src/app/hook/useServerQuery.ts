import {gql} from "@apollo/client";
import {getClient} from "@/graphql";
import {TypeArgsQuery} from "@/app/types";


export default function useServerQuery(args: TypeArgsQuery) {
  const {query, ...options} = args;
  return getClient().query({
    query: gql`${query}`,
    ...options
  });
}