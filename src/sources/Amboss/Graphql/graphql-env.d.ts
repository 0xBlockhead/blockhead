/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'BaseNode': { kind: 'OBJECT'; name: 'BaseNode'; fields: { 'addresses': { name: 'addresses'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'NodeAddress'; ofType: null; }; }; }; } }; 'alias': { name: 'alias'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'color': { name: 'color'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'last_update': { name: 'last_update'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'pub_key': { name: 'pub_key'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Boolean': unknown;
    'ChannelInfo': { kind: 'OBJECT'; name: 'ChannelInfo'; fields: { 'num_channels': { name: 'num_channels'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'total_capacity': { name: 'total_capacity'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'EdgeGraph': { kind: 'OBJECT'; name: 'EdgeGraph'; fields: { 'info': { name: 'info'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'LnEdge'; ofType: null; }; } }; }; };
    'EdgeInfo': { kind: 'OBJECT'; name: 'EdgeInfo'; fields: { 'graph': { name: 'graph'; type: { kind: 'OBJECT'; name: 'EdgeGraph'; ofType: null; } }; 'long_channel_id': { name: 'long_channel_id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'short_channel_id': { name: 'short_channel_id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'EdgePolicy': { kind: 'OBJECT'; name: 'EdgePolicy'; fields: { 'disabled': { name: 'disabled'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'fee_base_msat': { name: 'fee_base_msat'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'fee_rate_milli_msat': { name: 'fee_rate_milli_msat'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'max_htlc_msat': { name: 'max_htlc_msat'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'min_htlc': { name: 'min_htlc'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'time_lock_delta': { name: 'time_lock_delta'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; }; };
    'Float': unknown;
    'GraphInfo': { kind: 'OBJECT'; name: 'GraphInfo'; fields: { 'channels': { name: 'channels'; type: { kind: 'OBJECT'; name: 'ChannelInfo'; ofType: null; } }; 'node': { name: 'node'; type: { kind: 'OBJECT'; name: 'BaseNode'; ofType: null; } }; }; };
    'IpInfo': { kind: 'OBJECT'; name: 'IpInfo'; fields: { 'city': { name: 'city'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'country': { name: 'country'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'country_code': { name: 'country_code'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'LnEdge': { kind: 'OBJECT'; name: 'LnEdge'; fields: { 'capacity': { name: 'capacity'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'is_closed': { name: 'is_closed'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'last_update': { name: 'last_update'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node1_policy': { name: 'node1_policy'; type: { kind: 'OBJECT'; name: 'EdgePolicy'; ofType: null; } }; 'node1_pub': { name: 'node1_pub'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node2_policy': { name: 'node2_policy'; type: { kind: 'OBJECT'; name: 'EdgePolicy'; ofType: null; } }; 'node2_pub': { name: 'node2_pub'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'NodeAddress': { kind: 'OBJECT'; name: 'NodeAddress'; fields: { 'addr': { name: 'addr'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'ip_info': { name: 'ip_info'; type: { kind: 'OBJECT'; name: 'IpInfo'; ofType: null; } }; }; };
    'NodeType': { kind: 'OBJECT'; name: 'NodeType'; fields: { 'graph_info': { name: 'graph_info'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'GraphInfo'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'getEdge': { name: 'getEdge'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'EdgeInfo'; ofType: null; }; } }; 'getNode': { name: 'getNode'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'NodeType'; ofType: null; }; } }; 'getPopularNodes': { name: 'getPopularNodes'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; } }; }; };
    'String': unknown;
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