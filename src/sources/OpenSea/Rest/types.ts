import type { components } from '$/sources/OpenSea/OpenApi/openapi.d.ts'

export type OpenSeaChain = Exclude<
	components['schemas']['ChainIdentifier'],
	'flow' | 'solana'
>

export type OpenSeaNft = components['schemas']['Nft']
export type OpenSeaNftPage = components['schemas']['NftListResponse']

type OpenSeaEventBase = {
	event_timestamp: number
	transaction?: string
	chain: OpenSeaChain
	nft?: OpenSeaNft
	quantity: number
}

export type OpenSeaSaleEvent = OpenSeaEventBase & {
	event_type: 'sale'
	closing_date: number
	seller: string
	buyer: string
}

export type OpenSeaTransferEvent = OpenSeaEventBase & {
	event_type: 'transfer' | 'mint'
	transfer_type: string
	from_address: string
	to_address: string
}

export type OpenSeaAccountEvent =
	| OpenSeaSaleEvent
	| OpenSeaTransferEvent

export type OpenSeaAccountEventPage = {
	asset_events: OpenSeaAccountEvent[]
	next?: string
}
