import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector } from '$/resolvers/evm.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { OpenSeaNftResponse } from '$/sources/OpenSea/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const evmNftStandardFromOpenSea = (
	tokenStandard: string
) => {
	const normalized = tokenStandard.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
	if (normalized === 'erc721')
		return EvmNftStandard.Erc721
	if (normalized === 'erc1155')
		return EvmNftStandard.Erc1155

	throw new Error(`OpenSea_Rest: unsupported token standard ${tokenStandard}`)
}

const optionalUrl = (
	value: string | undefined
) => {
	const trimmed = value?.trim()
	return (
		trimmed != null && trimmed !== '' ?
			trimmed
		:
			undefined
	)
}

const evmNftFieldsFromOpenSea = (
	nft: OpenSeaNftResponse['nft'],
	{
		contractAddress,
		tokenId,
	}: {
		contractAddress: string
		tokenId: string
	}
) => {
	const responseContract = hexLowerOfByteSize(nft.contract, 20)
	if (responseContract == null)
		throw new Error('OpenSea_Rest: NFT contract not normalized')
	if (responseContract !== contractAddress)
		throw new Error('OpenSea_Rest: NFT contract mismatch')
	if (nft.identifier !== tokenId)
		throw new Error('OpenSea_Rest: NFT token id mismatch')

	const tokenUri = optionalUrl(nft.metadata_url)
	const image = optionalUrl(nft.image_url ?? nft.display_image_url)
	const name = optionalUrl(nft.name)
	const description = optionalUrl(nft.description)

	return {
		standard: evmNftStandardFromOpenSea(nft.token_standard),
		format: EvmNftFormat.Generic,
		active: !nft.is_disabled,
		...(tokenUri != null && { tokenUri }),
		...(name != null && { name }),
		...(description != null && { description }),
		...(image != null && { image }),
	}
}

export default {
	source: Source.OpenSea_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmNft,
			resolve: {
				EvmContractTokenId: {
					resolve: async ({
						$contract,
						tokenId,
					}) => {
						const chainId = evmChainIdFromNetworkSelector($contract.$network)
						const contractAddress = hexLowerOfByteSize($contract.address, 20)
						if (contractAddress == null)
							throw new Error('OpenSea_Rest: contract address not normalized')
						if (tokenId.trim() === '')
							throw new Error('OpenSea_Rest: token id required')

						const {
							getNft,
							openSeaChainForChainId,
							requireOpenSeaCredential,
						} = await import('$/sources/OpenSea/Rest/queries.ts')
						const {
							nft,
						} = await getNft({
							credential: requireOpenSeaCredential(),
							chain: openSeaChainForChainId(chainId),
							address: contractAddress,
							identifier: tokenId,
						})

						return evmNftFieldsFromOpenSea(nft, {
							contractAddress,
							tokenId,
						})
					},
				},
			},
		})({
			standard: (snapshot) => snapshot.standard,
			format: (snapshot) => snapshot.format,
			tokenUri: (snapshot) => snapshot.tokenUri,
			name: (snapshot) => snapshot.name,
			description: (snapshot) => snapshot.description,
			image: (snapshot) => snapshot.image,
			active: (snapshot) => snapshot.active,
		}),
	],
} satisfies RegisteredSourceResolverModule
