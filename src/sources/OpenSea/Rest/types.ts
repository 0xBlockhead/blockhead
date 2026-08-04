import type { operations } from '$/sources/OpenSea/OpenApi/openapi.d.ts'

export type OpenSeaAccountNftsPath = operations['get_nfts_by_account']['parameters']['path']
export type OpenSeaAccountNftsQuery = NonNullable<operations['get_nfts_by_account']['parameters']['query']>
export type OpenSeaAccountNftsResponse = operations['get_nfts_by_account']['responses'][200]['content']['*/*']

export type OpenSeaAccountEventsPath = operations['list_events_by_account']['parameters']['path']
export type OpenSeaAccountEventsQuery = NonNullable<operations['list_events_by_account']['parameters']['query']>
export type OpenSeaAccountEventsResponse = operations['list_events_by_account']['responses'][200]['content']['*/*']

export type OpenSeaNftPath = operations['get_nft']['parameters']['path']
export type OpenSeaNftResponse = operations['get_nft']['responses'][200]['content']['*/*']

export type OpenSeaContractNftsPath = operations['get_nfts_by_contract']['parameters']['path']
export type OpenSeaContractNftsQuery = NonNullable<operations['get_nfts_by_contract']['parameters']['query']>
export type OpenSeaContractNftsResponse = operations['get_nfts_by_contract']['responses'][200]['content']['*/*']

export type OpenSeaChainIdentifier = OpenSeaNftPath['chain']
