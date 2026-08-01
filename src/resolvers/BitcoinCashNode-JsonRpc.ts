import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { networkBySlug } from '$/constants/Network.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const assertBitcoinCashMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug['bitcoin-cash'].caip2.namespace
				|| network.caip2.reference !== networkBySlug['bitcoin-cash'].caip2.reference
			)
		:
			network.slug !== networkBySlug['bitcoin-cash'].slug
	) {
		throw new Error('BitcoinCashNode_JsonRpc: unsupported network')
	}
}

const getOutput = async ({ $transaction, indexInTransaction }: {
	$transaction: {
		$network: NetworkId
		txId: string
	}
	indexInTransaction: number
}) => {
	assertBitcoinCashMainnet($transaction.$network)
	const { getRawTransaction } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const transaction = await getRawTransaction({
		txId: $transaction.txId,
	})
	const output = transaction.vout.at(indexInTransaction)
	if (output == null) throw new Error(`BitcoinCashNode_JsonRpc: output not found for ${$transaction.txId}:${String(indexInTransaction)}`)
	return output
}

export default {
	source: Source.BitcoinCashNode_JsonRpc,

	resolvers: [
		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async (entitySelector) => {
						const output = await getOutput(entitySelector)
						return {
							valueSats: BigInt(Math.round(output.value * 100_000_000)),
							scriptPubKeyAsm: output.scriptPubKey.asm,
							scriptPubKeyHex: output.scriptPubKey.hex,
							scriptPubKeyType: output.scriptPubKey.type,
							...(output.scriptPubKey.address != null && {
								$address: {
									[EntityMetaKey.Selector]: {
										$network: entitySelector.$transaction.$network,
										address: output.scriptPubKey.address,
									},
								},
							}),
							...(output.tokenData?.amount != null && {
								$bitcoinCashCashTokenFungibleAmount: {
									[EntityMetaKey.Selector]: {
										$output: entitySelector,
									},
								},
							}),
							...(output.tokenData?.nft != null && {
								$bitcoinCashCashTokenNft: {
									[EntityMetaKey.Selector]: {
										$output: entitySelector,
									},
								},
							}),
						}
					},
				}
			},
		})({
				valueSats: (snapshot) => snapshot.valueSats,
				scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
				scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
				scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
				$address: (snapshot) => snapshot.$address,
				$bitcoinCashCashTokenFungibleAmount: (snapshot) => snapshot.$bitcoinCashCashTokenFungibleAmount,
				$bitcoinCashCashTokenNft: (snapshot) => snapshot.$bitcoinCashCashTokenNft,
			}),

		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.amount == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken fungible amount')
						return {
							$category: {
								[EntityMetaKey.Selector]: {
									$network: $output.$transaction.$network,
									categoryId: output.tokenData.category,
								},
							},
							amount: BigInt(output.tokenData.amount),
						}
					},
				}
			},
		})({
				$category: (snapshot) => snapshot.$category,
				amount: (snapshot) => snapshot.amount,
			}),

		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.BitcoinCashCashTokenNft,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT')
						return {
							$category: {
								[EntityMetaKey.Selector]: {
									$network: $output.$transaction.$network,
									categoryId: output.tokenData.category,
								},
							},
							$commitment: {
								[EntityMetaKey.Selector]: {
									$output: $output,
								},
							},
							capability: output.tokenData.nft.capability,
						}
					},
				}
			},
		})({
				$category: (snapshot) => snapshot.$category,
				$commitment: (snapshot) => snapshot.$commitment,
				capability: (snapshot) => snapshot.capability,
			}),

		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			resolve: {
				UtxoOutput: {
					resolve: async ({ $output }) => {
						const output = await getOutput($output)
						if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT commitment')
						return {
							commitmentHex: output.tokenData.nft.commitment,
						}
					},
				}
			},
		})({
				commitmentHex: (snapshot) => snapshot.commitmentHex,
			}),
	],
}
