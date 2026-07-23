import { base58 } from '@scure/base'

import { throwHttpError } from '$/lib/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type {
	MetaplexDASAsset,
	MetaplexDASAssetsByOwnerPage,
	MetaplexDASAssetsByOwnerResult,
	MetaplexDASJsonRpcResponse,
} from '$/sources/MetaplexDAS/Rest/types.ts'

const assetInterfaces = new Set<MetaplexDASAsset['interface']>([
	'Custom',
	'Executable',
	'FungibleAsset',
	'FungibleToken',
	'Identity',
	'LEGACY_NFT',
	'MplCoreAsset',
	'MplCoreCollection',
	'ProgrammableNFT',
	'V1_NFT',
	'V1_PRINT',
	'V2_NFT',
])

const assertAddress = (
	address: string,
	label: string
) => {
	try {
		if (base58.decode(address).length !== 32)
			throw new Error()
	} catch {
		throw new Error(`MetaplexDAS_Rest: invalid ${label}`)
	}
}

const assertNonnegativeSafeInteger = (
	value: number,
	label: string
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`MetaplexDAS_Rest: invalid ${label}`)
}

const assertUriReference = (
	value: string,
	label: string
) => {
	if (
		value.length === 0
		|| !URL.canParse(value)
		|| ![
			'ar:',
			'https:',
			'ipfs:',
		].includes(new URL(value).protocol)
	)
		throw new Error(`MetaplexDAS_Rest: invalid ${label}`)
}

const assertAsset = (
	asset: MetaplexDASAsset,
	ownerAddress: string
) => {
	if (!assetInterfaces.has(asset.interface))
		throw new Error('MetaplexDAS_Rest: unsupported asset interface')

	assertAddress(asset.id, 'asset identity')
	assertAddress(asset.ownership.owner, 'asset owner')
	if (asset.ownership.owner !== ownerAddress)
		throw new Error('MetaplexDAS_Rest: asset owner does not match request')

	if (asset.ownership.delegate != null)
		assertAddress(asset.ownership.delegate, 'asset delegate')
	if (asset.ownership.delegated !== (asset.ownership.delegate != null))
		throw new Error('MetaplexDAS_Rest: inconsistent delegation')

	for (const authority of asset.authorities ?? [])
		assertAddress(authority.address, 'asset authority')

	const creatorAddresses = new Set<string>()
	for (const creator of asset.creators ?? []) {
		assertAddress(creator.address, 'asset creator')
		if (
			!Number.isSafeInteger(creator.share)
			|| creator.share < 0
			|| creator.share > 100
		)
			throw new Error('MetaplexDAS_Rest: invalid creator share')
		if (creatorAddresses.has(creator.address))
			throw new Error('MetaplexDAS_Rest: duplicate asset creator')

		creatorAddresses.add(creator.address)
	}

	if (
		!Number.isSafeInteger(asset.royalty.basis_points)
		|| asset.royalty.basis_points < 0
		|| asset.royalty.basis_points > 10_000
		|| !Number.isFinite(asset.royalty.percent)
		|| asset.royalty.percent < 0
		|| asset.royalty.percent > 1
	)
		throw new Error('MetaplexDAS_Rest: invalid asset royalty')
	if (asset.royalty.target != null)
		assertAddress(asset.royalty.target, 'royalty target')

	if (asset.compression.compressed) {
		assertAddress(asset.compression.data_hash ?? '', 'compression data hash')
		assertAddress(asset.compression.creator_hash ?? '', 'compression creator hash')
		assertAddress(asset.compression.asset_hash ?? '', 'compression asset hash')
		assertAddress(asset.compression.tree ?? '', 'compression tree')
		assertNonnegativeSafeInteger(asset.compression.seq ?? -1, 'compression sequence')
		assertNonnegativeSafeInteger(asset.compression.leaf_id ?? -1, 'compression leaf ID')
	}

	for (const grouping of asset.grouping ?? [])
		assertAddress(grouping.group_value, 'asset grouping identity')

	if (asset.content?.$schema != null)
		assertUriReference(asset.content.$schema, 'content schema URI')
	if (asset.content?.json_uri != null)
		assertUriReference(asset.content.json_uri, 'content JSON URI')
	for (const file of asset.content?.files ?? []) {
		if (file.uri != null)
			assertUriReference(file.uri, 'content file URI')
		if (file.cdn_uri != null)
			assertUriReference(file.cdn_uri, 'content CDN URI')
	}
	for (const uri of Object.values(asset.content?.links ?? {}))
		assertUriReference(uri, 'content link URI')

	if (asset.token_info != null) {
		if (
			asset.token_info.balance != null
			&& (
				!Number.isSafeInteger(asset.token_info.balance)
				|| asset.token_info.balance < 0
			)
		)
			throw new Error('MetaplexDAS_Rest: lossy fungible balance')
		if (
			asset.token_info.supply != null
			&& (
				!Number.isSafeInteger(asset.token_info.supply)
				|| asset.token_info.supply < 0
			)
		)
			throw new Error('MetaplexDAS_Rest: lossy fungible supply')
		if (
			asset.token_info.decimals != null
			&& (
				!Number.isSafeInteger(asset.token_info.decimals)
				|| asset.token_info.decimals < 0
				|| asset.token_info.decimals > 255
			)
		)
			throw new Error('MetaplexDAS_Rest: invalid fungible decimals')
		if (asset.token_info.associated_token_address != null)
			assertAddress(asset.token_info.associated_token_address, 'associated token account')
	}
}

export const getAssetsByOwner = async ({
	binding,
	network,
	ownerAddress,
	limit = 1_000,
	pagination = {
		page: 1,
	},
}: {
	binding: SourceBinding
	network: `solana:${string}`
	ownerAddress: string
	limit?: number
	pagination?: MetaplexDASAssetsByOwnerPage
}) => {
	if (
		binding.source !== Source.MetaplexDAS_Rest
		|| binding.target.kind !== SourceTargetKind.Caip2Network
		|| binding.target.key !== network
	)
		throw new Error('MetaplexDAS_Rest: expected exact Solana network binding')

	assertAddress(ownerAddress, 'owner address')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1_000)
		throw new Error('MetaplexDAS_Rest: limit must be an integer from 1 through 1000')
	if ('page' in pagination && (!Number.isSafeInteger(pagination.page) || pagination.page < 1))
		throw new Error('MetaplexDAS_Rest: page must be a positive safe integer')
	if ('before' in pagination && pagination.before.length === 0)
		throw new Error('MetaplexDAS_Rest: before cursor must not be empty')
	if ('after' in pagination && pagination.after.length === 0)
		throw new Error('MetaplexDAS_Rest: after cursor must not be empty')

	const requestId = `${network}:${ownerAddress}:${'page' in pagination ? `page:${String(pagination.page)}` : ('before' in pagination ? `before:${pagination.before}` : `after:${pagination.after}`)}`
	const response = await sourceFetch(
		binding,
		firstHttpUrlForBinding(binding),
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: requestId,
				method: 'getAssetsByOwner',
				params: {
					ownerAddress,
					limit,
					...pagination,
					displayOptions: {
						showFungible: true,
					},
				},
			}),
		}
	)
	if (!response.ok)
		await throwHttpError('MetaplexDAS_Rest getAssetsByOwner', response)

	const envelope = await response.json<MetaplexDASJsonRpcResponse<MetaplexDASAssetsByOwnerResult>>()
	if (envelope.jsonrpc !== '2.0' || envelope.id !== requestId)
		throw new Error('MetaplexDAS_Rest: response identity does not match request')
	if (envelope.error != null)
		throw new Error(`MetaplexDAS_Rest: ${envelope.error.message}`)
	if (envelope.result == null)
		throw new Error('MetaplexDAS_Rest: response result is missing')

	assertNonnegativeSafeInteger(envelope.result.last_indexed_slot, 'indexed slot')
	assertNonnegativeSafeInteger(envelope.result.total, 'total')
	if (
		envelope.result.limit !== limit
		|| !Number.isSafeInteger(envelope.result.page)
		|| envelope.result.page < 1
		|| (
			'page' in pagination
			&& envelope.result.page !== pagination.page
		)
		|| envelope.result.items.length > limit
	)
		throw new Error('MetaplexDAS_Rest: response page does not match request')

	const assetIdentities = new Set<string>()
	for (const asset of envelope.result.items) {
		assertAsset(asset, ownerAddress)
		if (assetIdentities.has(asset.id))
			throw new Error('MetaplexDAS_Rest: duplicate asset identity')

		assetIdentities.add(asset.id)
	}

	return {
		...envelope.result,
		network,
		ownerAddress,
		source: binding.source,
	}
}
