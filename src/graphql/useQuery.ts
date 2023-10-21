import {gql, OperationVariables, QueryOptions} from "@apollo/client";
import {getClient} from "@/graphql/index";

export function useQuery(options: QueryOptions<OperationVariables, any>) {
  return getClient().query(options);
}