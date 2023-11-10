import {gql, useQuery} from "@apollo/client";
import {TypeArgsQuery} from "@/app/types";

export default function useClientQuery(args: TypeArgsQuery) {
  const {query, ...options} = args;
  return useQuery(gql`${query}`, options);
}