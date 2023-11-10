import {OperationVariables, QueryOptions} from "@apollo/client";

export  type TypeSearchParams = {
  kino: string;
  type: string;
  section: string;
}


type GraphQlTypeOptions = QueryOptions<OperationVariables, any>;

export type TypeArgsQuery = Omit<GraphQlTypeOptions, 'query'> & {
  query: string;
}

