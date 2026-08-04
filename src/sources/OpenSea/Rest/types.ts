import type { operations } from '$/sources/OpenSea/OpenApi/openapi.d.ts'

export type OpenSeaAccountNftsPath = operations['get_nfts_by_account']['parameters']['path']
export type OpenSeaAccountNftsQuery = NonNullable<operations['get_nfts_by_account']['parameters']['query']>
export type OpenSeaAccountNftsResponse = operations['get_nfts_by_account']['responses'][200]['content']['*/*']

export type OpenSeaAccountEventsPath = operations['list_events_by_account']['parameters']['path']
export type OpenSeaAccountEventsQuery = NonNullable<operations['list_events_by_account']['parameters']['query']>
export type OpenSeaAccountEventsResponse = operations['list_events_by_account']['responses'][200]['content']['*/*']

export type OpenSeaNftPath = operations['get_nft']['parameters']['path']
export type OpenSeaNftResponse = operations['get_nft']['responses'][200]['content']['*/*']

export type OpenSeaContractPath = operations['get_contract']['parameters']['path']
export type OpenSeaContractResponse = operations['get_contract']['responses'][200]['content']['*/*']

export type OpenSeaContractNftsPath = operations['get_nfts_by_contract']['parameters']['path']
export type OpenSeaContractNftsQuery = NonNullable<operations['get_nfts_by_contract']['parameters']['query']>
export type OpenSeaContractNftsResponse = operations['get_nfts_by_contract']['responses'][200]['content']['*/*']

export type OpenSeaNftOwnersPath = operations['get_nft_owners']['parameters']['path']
export type OpenSeaNftOwnersQuery = NonNullable<operations['get_nft_owners']['parameters']['query']>
export type OpenSeaNftOwnersResponse = operations['get_nft_owners']['responses'][200]['content']['*/*']

export type OpenSeaNftEventsPath = operations['list_events_by_nft']['parameters']['path']
export type OpenSeaNftEventsQuery = NonNullable<operations['list_events_by_nft']['parameters']['query']>
export type OpenSeaNftEventsResponse = operations['list_events_by_nft']['responses'][200]['content']['*/*']

export type OpenSeaCollectionPath = operations['get_collection']['parameters']['path']
export type OpenSeaCollectionResponse = operations['get_collection']['responses'][200]['content']['*/*']

export type OpenSeaCollectionNftsPath = operations['get_nfts_by_collection']['parameters']['path']
export type OpenSeaCollectionNftsQuery = NonNullable<operations['get_nfts_by_collection']['parameters']['query']>
export type OpenSeaCollectionNftsResponse = operations['get_nfts_by_collection']['responses'][200]['content']['*/*']

export type OpenSeaChainIdentifier = OpenSeaNftPath['chain']
