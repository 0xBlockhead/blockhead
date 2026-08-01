/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Amount': { kind: 'OBJECT'; name: 'Amount'; fields: { 'ar': { name: 'ar'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'winston': { name: 'winston'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'BigDecimal': unknown;
    'BigInt': unknown;
    'Block': { kind: 'OBJECT'; name: 'Block'; fields: { 'height': { name: 'height'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'SCALAR'; name: 'ID'; ofType: null; } }; 'previous': { name: 'previous'; type: { kind: 'SCALAR'; name: 'ID'; ofType: null; } }; 'timestamp': { name: 'timestamp'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; }; };
    'BlockConnection': { kind: 'OBJECT'; name: 'BlockConnection'; fields: { 'edges': { name: 'edges'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'BlockEdge'; ofType: null; }; }; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; }; };
    'BlockEdge': { kind: 'OBJECT'; name: 'BlockEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Block'; ofType: null; }; } }; }; };
    'Boolean': unknown;
    'Bundle': { kind: 'OBJECT'; name: 'Bundle'; fields: { 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; }; };
    'Bytes': unknown;
    'CacheControlScope': { name: 'CacheControlScope'; enumValues: 'PUBLIC' | 'PRIVATE'; };
    'ID': unknown;
    'Int': unknown;
    'Int8': unknown;
    'MetaData': { kind: 'OBJECT'; name: 'MetaData'; fields: { 'size': { name: 'size'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'type': { name: 'type'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
    'Owner': { kind: 'OBJECT'; name: 'Owner'; fields: { 'address': { name: 'address'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'key': { name: 'key'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'PageInfo': { kind: 'OBJECT'; name: 'PageInfo'; fields: { 'hasNextPage': { name: 'hasNextPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; }; };
    'Parent': { kind: 'OBJECT'; name: 'Parent'; fields: { 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'block': { name: 'block'; type: { kind: 'OBJECT'; name: 'Block'; ofType: null; } }; 'blocks': { name: 'blocks'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'BlockConnection'; ofType: null; }; } }; 'transaction': { name: 'transaction'; type: { kind: 'OBJECT'; name: 'Transaction'; ofType: null; } }; 'transactions': { name: 'transactions'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TransactionConnection'; ofType: null; }; } }; }; };
    'RangeFilter': { kind: 'INPUT_OBJECT'; name: 'RangeFilter'; isOneOf: false; inputFields: [{ name: 'min'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; defaultValue: null }, { name: 'max'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; defaultValue: null }]; };
    'SortOrder': { name: 'SortOrder'; enumValues: 'HEIGHT_ASC' | 'HEIGHT_DESC' | 'INGESTED_AT_DESC' | 'INGESTED_AT_ASC'; };
    'String': unknown;
    'Tag': { kind: 'OBJECT'; name: 'Tag'; fields: { 'name': { name: 'name'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'value': { name: 'value'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'TagFilter': { kind: 'INPUT_OBJECT'; name: 'TagFilter'; isOneOf: false; inputFields: [{ name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'values'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; defaultValue: null }, { name: 'op'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'TagOperator'; ofType: null; }; }; defaultValue: "EQ" }, { name: 'match'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'ENUM'; name: 'TagMatch'; ofType: null; }; }; defaultValue: "EXACT" }]; };
    'TagMatch': { name: 'TagMatch'; enumValues: 'EXACT' | 'WILDCARD' | 'FUZZY_AND' | 'FUZZY_OR'; };
    'TagOperator': { name: 'TagOperator'; enumValues: 'EQ' | 'NEQ'; };
    'Transaction': { kind: 'OBJECT'; name: 'Transaction'; fields: { 'anchor': { name: 'anchor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'block': { name: 'block'; type: { kind: 'OBJECT'; name: 'Block'; ofType: null; } }; 'bundledIn': { name: 'bundledIn'; type: { kind: 'OBJECT'; name: 'Bundle'; ofType: null; } }; 'data': { name: 'data'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'MetaData'; ofType: null; }; } }; 'fee': { name: 'fee'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Amount'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'ingested_at': { name: 'ingested_at'; type: { kind: 'SCALAR'; name: 'Int'; ofType: null; } }; 'owner': { name: 'owner'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Owner'; ofType: null; }; } }; 'parent': { name: 'parent'; type: { kind: 'OBJECT'; name: 'Parent'; ofType: null; } }; 'quantity': { name: 'quantity'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Amount'; ofType: null; }; } }; 'recipient': { name: 'recipient'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'signature': { name: 'signature'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'tags': { name: 'tags'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Tag'; ofType: null; }; }; }; } }; }; };
    'TransactionConnection': { kind: 'OBJECT'; name: 'TransactionConnection'; fields: { 'count': { name: 'count'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'edges': { name: 'edges'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TransactionEdge'; ofType: null; }; }; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; }; };
    'TransactionEdge': { kind: 'OBJECT'; name: 'TransactionEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Transaction'; ofType: null; }; } }; }; };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: never;
  subscription: never;
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}
