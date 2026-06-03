import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import {
	bitcoinCashMainnetCaip2,
	bitcoinCashNodeDefaultLocalRpcUrl,
} from '$/constants/BitcoinNetwork.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

type NetworkId = { caip2: { namespace: string; reference: string } } | { networkSlug: string }

const assertBitcoinCashMainnet = (network: NetworkId) => {
	if (
		!('caip2' in network)
		|| network.caip2.namespace !== bitcoinCashMainnetCaip2.namespace
		|| network.caip2.reference !== bitcoinCashMainnetCaip2.reference
	) {
		throw new Error('BitcoinCashNode_JsonRpc: unsupported network')
	}
}

const getOutput = async (entityId: {
	$transaction: {
		$network: NetworkId
		txId: string
	}
	outputIndex: number
}) => {
	assertBitcoinCashMainnet(entityId.$transaction.$network)
	const { getRawTransaction } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const transaction = await getRawTransaction({
		rpcUrl: bitcoinCashNodeDefaultLocalRpcUrl,
		txId: entityId.$transaction.txId,
	})
	const output = transaction.vout.at(entityId.outputIndex)
	if (output == null) throw new Error(`BitcoinCashNode_JsonRpc: output not found for ${entityId.$transaction.txId}:${String(entityId.outputIndex)}`)
	return output
}

export default {
	source: Source.BitcoinCashNode_JsonRpc,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.UtxoOutput,
			resolve: async (entityId) => {
				const output = await getOutput(entityId)
				return {
					valueSats: BigInt(Math.round(output.value * 100_000_000)),
					scriptPubKeyAsm: output.scriptPubKey.asm,
					scriptPubKeyHex: output.scriptPubKey.hex,
					scriptPubKeyType: output.scriptPubKey.type,
					...(output.scriptPubKey.address != null && {
						address: output.scriptPubKey.address,
					}),
					...(output.tokenData?.amount != null && {
						$bitcoinCashCashTokenFungibleAmount: {
							[EntityMetaKey.Id]: {
								$output: entityId,
							},
						},
					}),
					...(output.tokenData?.nft != null && {
						$bitcoinCashCashTokenNft: {
							[EntityMetaKey.Id]: {
								$output: entityId,
							},
						},
					}),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			resolve: async (entityId) => {
				const output = await getOutput(entityId.$output)
				if (output.tokenData?.amount == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken fungible amount')
				return {
					$category: {
						[EntityMetaKey.Id]: {
							$network: entityId.$output.$transaction.$network,
							categoryId: output.tokenData.category,
						},
					},
					amount: BigInt(output.tokenData.amount),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BitcoinCashCashTokenNft,
			resolve: async (entityId) => {
				const output = await getOutput(entityId.$output)
				if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT')
				return {
					$category: {
						[EntityMetaKey.Id]: {
							$network: entityId.$output.$transaction.$network,
							categoryId: output.tokenData.category,
						},
					},
					$commitment: {
						[EntityMetaKey.Id]: {
							$output: entityId.$output,
						},
					},
					capability: output.tokenData.nft.capability,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			resolve: async (entityId) => {
				const output = await getOutput(entityId.$output)
				if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT commitment')
				return {
					commitmentHex: output.tokenData.nft.commitment,
				}
			},
		}),
	],

	entityFieldResolvers: [],
}
