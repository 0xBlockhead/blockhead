import {
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { NetworkNamespace } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const bitcoinCashNodeRpcUrl = 'http://127.0.0.1:8332'

const assertBitcoinCashMainnet = (network: { namespace: string; reference: string }) => {
	if (network.namespace !== NetworkNamespace.BitcoinCash || network.reference !== '000000000000000000651ef99cb9fcbe') {
		throw new Error(`BitcoinCashNode_JsonRpc: unsupported network ${network.namespace}:${network.reference}`)
	}
}

const getOutput = async (entityId: {
	$transaction: {
		$network: {
			namespace: string
			reference: string
		}
		txId: string
	}
	outputIndex: number
}) => {
	assertBitcoinCashMainnet(entityId.$transaction.$network)
	const { getRawTransaction } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const transaction = await getRawTransaction({
		rpcUrl: bitcoinCashNodeRpcUrl,
		txId: entityId.$transaction.txId,
	})
	const output = transaction.vout[entityId.outputIndex]
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
