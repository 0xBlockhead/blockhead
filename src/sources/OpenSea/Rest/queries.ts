import type { SourceBinding } from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type {
	OpenSeaAccountEventPage,
	OpenSeaChain,
	OpenSeaNft,
	OpenSeaNftPage,
} from '$/sources/OpenSea/Rest/types.ts'

const evmAddressPattern = /^0x[0-9a-f]{40}$/i
const transactionHashPattern = /^0x[0-9a-f]{64}$/i
const unsignedIntegerPattern = /^(0|[1-9][0-9]*)$/

const requestOpenSeaJson = async <_Response>({
	binding,
	path,
	credential,
}: {
	binding: SourceBinding
	path: string
	credential: string
}) => {
	if (!credential)
		throw new Error('OpenSea API key is required')

	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			accept: 'application/json',
			'x-api-key': credential,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<_Response>()
}

const assertAddress = (
	address: string,
	label: string
) => {
	if (!evmAddressPattern.test(address))
		throw new Error(`OpenSea returned invalid ${label}`)
}

const assertNft = (
	nft: OpenSeaNft
) => {
	assertAddress(nft.contract, 'NFT contract')

	if (!unsignedIntegerPattern.test(nft.identifier))
		throw new Error('OpenSea returned invalid NFT token ID')

	if (
		![
			'erc721',
			'erc1155',
		].includes(nft.token_standard.toLowerCase())
		|| !Number.isFinite(Date.parse(nft.updated_at))
		|| !URL.canParse(nft.opensea_url)
		|| (nft.image_url !== undefined && !URL.canParse(nft.image_url))
		|| (nft.metadata_url !== undefined && !URL.canParse(nft.metadata_url))
	)
		throw new Error('OpenSea returned invalid NFT metadata')
}

const pagination = ({
	limit,
	next,
}: {
	limit: number
	next?: string
}) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 200)
		throw new Error('OpenSea limit must be between 1 and 200')

	if (next === '')
		throw new Error('OpenSea pagination cursor must be opaque and nonempty')

	return new URLSearchParams({
		limit: String(limit),
		...(next !== undefined && {
			'next.value': next,
		}),
	})
}

export const getAccountNfts = async ({
	binding,
	credential,
	chain,
	address,
	limit = 200,
	next,
}: {
	binding: SourceBinding
	credential: string
	chain: OpenSeaChain
	address: string
	limit?: number
	next?: string
}) => {
	assertAddress(address, 'account address')

	const response = await requestOpenSeaJson<OpenSeaNftPage>({
		binding,
		credential,
		path: `/api/v2/chain/${encodeURIComponent(chain)}/account/${encodeURIComponent(address)}/nfts?${pagination({
			limit,
			next,
		})}`,
	})
	const identities = new Set<string>()

	if (response.nfts.length > limit)
		throw new Error('OpenSea returned more NFTs than requested')

	if (response.next === '')
		throw new Error('OpenSea returned an invalid pagination cursor')

	for (const nft of response.nfts) {
		assertNft(nft)

		const identity = `${nft.contract.toLowerCase()}:${nft.identifier}`

		if (identities.has(identity))
			throw new Error('OpenSea returned duplicate NFTs')

		identities.add(identity)
	}

	return response
}

export const getAccountEvents = async ({
	binding,
	credential,
	chain,
	address,
	types = [
		'sale',
		'transfer',
		'mint',
	],
	limit = 200,
	next,
}: {
	binding: SourceBinding
	credential: string
	chain: OpenSeaChain
	address: string
	types?: ('sale' | 'transfer' | 'mint')[]
	limit?: number
	next?: string
}) => {
	assertAddress(address, 'account address')

	if (!types.length || new Set(types).size !== types.length)
		throw new Error('OpenSea event types must be nonempty and unique')

	const searchParameters = pagination({
		limit,
		next,
	})

	searchParameters.set('chain', chain)
	for (const type of types)
		searchParameters.append('event_type', type)

	const response = await requestOpenSeaJson<OpenSeaAccountEventPage>({
		binding,
		credential,
		path: `/api/v2/events/accounts/${encodeURIComponent(address)}?${searchParameters}`,
	})

	if (response.asset_events.length > limit)
		throw new Error('OpenSea returned more account events than requested')

	if (response.next === '')
		throw new Error('OpenSea returned an invalid pagination cursor')

	for (const event of response.asset_events) {
		if (
			event.chain !== chain
			|| !types.includes(event.event_type)
			|| !Number.isSafeInteger(event.event_timestamp)
			|| event.event_timestamp < 0
			|| !Number.isSafeInteger(event.quantity)
			|| event.quantity < 1
			|| (event.transaction !== undefined && !transactionHashPattern.test(event.transaction))
		)
			throw new Error('OpenSea returned invalid account event identity')

		if (event.nft !== undefined)
			assertNft(event.nft)

		if (event.event_type === 'sale') {
			assertAddress(event.seller, 'sale seller')
			assertAddress(event.buyer, 'sale buyer')

			if (
				!Number.isSafeInteger(event.closing_date)
				|| event.closing_date < 0
				|| (
					event.seller.toLowerCase() !== address.toLowerCase()
				&& event.buyer.toLowerCase() !== address.toLowerCase()
				)
			)
				throw new Error('OpenSea returned a foreign sale')
		} else {
			assertAddress(event.from_address, 'transfer sender')
			assertAddress(event.to_address, 'transfer recipient')

			if (
				!event.transfer_type
				|| (
					event.from_address.toLowerCase() !== address.toLowerCase()
				&& event.to_address.toLowerCase() !== address.toLowerCase()
				)
			)
				throw new Error('OpenSea returned a foreign transfer')
		}
	}

	return response
}
