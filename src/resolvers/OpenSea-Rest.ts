import {
	EvmNftFormat,
	EvmNftStandard,
} from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import {
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector } from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type {
	OpenSeaAccountNftsResponse,
	OpenSeaNftResponse,
} from '$/sources/OpenSea/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

type OpenSeaListNft = OpenSeaAccountNftsResponse['nfts'][number]

const openSeaNftPageLimit = (
	context: Parameters<typeof resolverContextRowLimit>[0]
) => (
	Math.min(
		resolverContextRowLimit(context),
		200
	)
)

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
	nft: OpenSeaNftResponse['nft'] | OpenSeaListNft,
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

const evmNftReferenceFromOpenSeaListNft = (
	nft: OpenSeaListNft,
	{
		$network,
		contractAddress,
	}: {
		$network: {
			caip2: {
				namespace: string
				reference: string
			}
		}
		contractAddress: string
	}
) => {
	const responseContract = hexLowerOfByteSize(nft.contract, 20)
	if (responseContract == null)
		throw new Error('OpenSea_Rest: NFT contract not normalized')
	if (responseContract !== contractAddress)
		throw new Error('OpenSea_Rest: NFT contract mismatch')
	if (nft.identifier.trim() === '')
		throw new Error('OpenSea_Rest: NFT token id required')

	const fields = evmNftFieldsFromOpenSea(nft, {
		contractAddress,
		tokenId: nft.identifier,
	})

	return {
		[EntityMetaKey.Selector]: {
			$contract: {
				$network,
				address: contractAddress,
			},
			tokenId: nft.identifier,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.EvmNft, [], 'standard')]: fields.standard,
			[entityFieldAddressKey(EntityType.EvmNft, [], 'format')]: fields.format,
			[entityFieldAddressKey(EntityType.EvmNft, [], 'active')]: fields.active,
			...(fields.tokenUri != null && {
				[entityFieldAddressKey(EntityType.EvmNft, [], 'tokenUri')]: fields.tokenUri,
			}),
			...(fields.name != null && {
				[entityFieldAddressKey(EntityType.EvmNft, [], 'name')]: fields.name,
			}),
			...(fields.description != null && {
				[entityFieldAddressKey(EntityType.EvmNft, [], 'description')]: fields.description,
			}),
			...(fields.image != null && {
				[entityFieldAddressKey(EntityType.EvmNft, [], 'image')]: fields.image,
			}),
		},
	}
}

const openSeaNftListContinuation = (
	{
		next,
		operation,
		target,
	}: {
		next: string | undefined
		operation: string
		target: string
	}
) => (
	next == null || next === '' ?
		{
			operation,
			target,
			terminal: true,
		}
	:
		{
			operation,
			target,
			terminal: false,
			token: next,
		}
)

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

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({
						$actor,
						$network,
					}, context) => {
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('OpenSea_Rest: account address not normalized')

						const {
							getAccountNfts,
							openSeaChainForChainId,
							requireOpenSeaCredential,
						} = await import('$/sources/OpenSea/Rest/queries.ts')
						const page = await getAccountNfts({
							credential: requireOpenSeaCredential(),
							chain: openSeaChainForChainId(evmChainIdFromNetworkSelector($network)),
							address,
							limit: openSeaNftPageLimit(context),
							...(context.providerContinuationToken != null && {
								next: context.providerContinuationToken,
							}),
						})

						return {
							$network,
							nfts: page.nfts,
							next: page.next,
							target: address,
						}
					},
				},
			},
		})({
			$$nfts: {
				select: ({
					$network,
					nfts,
				}) => (
					nfts.map((nft) => {
						const contractAddress = hexLowerOfByteSize(nft.contract, 20)
						if (contractAddress == null)
							throw new Error('OpenSea_Rest: NFT contract not normalized')

						return evmNftReferenceFromOpenSeaListNft(nft, {
							$network,
							contractAddress,
						})
					})
				),
				continuation: ({
					next,
					target,
				}) => (
					openSeaNftListContinuation({
						next,
						operation: 'account-nfts',
						target,
					})
				),
			},
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({
						$network,
						address,
					}, context) => {
						const contractAddress = hexLowerOfByteSize(address, 20)
						if (contractAddress == null)
							throw new Error('OpenSea_Rest: contract address not normalized')

						const {
							getNftsByContract,
							openSeaChainForChainId,
							requireOpenSeaCredential,
						} = await import('$/sources/OpenSea/Rest/queries.ts')
						const page = await getNftsByContract({
							credential: requireOpenSeaCredential(),
							chain: openSeaChainForChainId(evmChainIdFromNetworkSelector($network)),
							address: contractAddress,
							limit: openSeaNftPageLimit(context),
							...(context.providerContinuationToken != null && {
								next: context.providerContinuationToken,
							}),
						})

						return {
							$network,
							contractAddress,
							nfts: page.nfts,
							next: page.next,
							target: contractAddress,
						}
					},
				},
			},
		})({
			$$nfts: {
				select: ({
					$network,
					contractAddress,
					nfts,
				}) => (
					nfts.map((nft) => (
						evmNftReferenceFromOpenSeaListNft(nft, {
							$network,
							contractAddress,
						})
					))
				),
				continuation: ({
					next,
					target,
				}) => (
					openSeaNftListContinuation({
						next,
						operation: 'contract-nfts',
						target,
					})
				),
			},
		}),
	],
} satisfies RegisteredSourceResolverModule
