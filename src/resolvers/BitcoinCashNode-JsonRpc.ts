import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	bitcoinCashMainnetCaip2,
	bitcoinCashNodeDefaultLocalRpcUrl,
} from '$/constants/BitcoinNetwork.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { UtxoOutputSelector } from '$/schema/UtxoOutput.ts'
import { BitcoinCashCashTokenFungibleAmountSelector } from '$/schema/BitcoinCashCashTokenFungibleAmount.ts'
import { BitcoinCashCashTokenNftSelector } from '$/schema/BitcoinCashCashTokenNft.ts'
import { BitcoinCashCashTokenCommitmentSelector } from '$/schema/BitcoinCashCashTokenCommitment.ts'

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

const getOutput = async ({ $transaction, outputIndex }: {
	$transaction: {
		$network: NetworkId
		txId: string
	}
	outputIndex: number
}) => {
	assertBitcoinCashMainnet($transaction.$network)
	const { getRawTransaction } = await import('$/sources/BitcoinCashNode/JsonRpc/queries.ts')
	const transaction = await getRawTransaction({
		rpcUrl: bitcoinCashNodeDefaultLocalRpcUrl,
		txId: $transaction.txId,
	})
	const output = transaction.vout.at(outputIndex)
	if (output == null) throw new Error(`BitcoinCashNode_JsonRpc: output not found for ${$transaction.txId}:${String(outputIndex)}`)
	return output
}

export default {
	source: Source.BitcoinCashNode_JsonRpc,

	resolvers: [
		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.UtxoOutput,
			resolve: {
				[UtxoOutputSelector.UtxoTransactionOutputIndex]: async (entitySelector) => {
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
			}
			}
		})({
				fields: {
			valueSats: (snapshot) => snapshot.valueSats,
			scriptPubKeyAsm: (snapshot) => snapshot.scriptPubKeyAsm,
			scriptPubKeyHex: (snapshot) => snapshot.scriptPubKeyHex,
			scriptPubKeyType: (snapshot) => snapshot.scriptPubKeyType,
			$address: (snapshot) => snapshot.$address,
			$bitcoinCashCashTokenFungibleAmount: (snapshot) => snapshot.$bitcoinCashCashTokenFungibleAmount,
			$bitcoinCashCashTokenNft: (snapshot) => snapshot.$bitcoinCashCashTokenNft,
		},
			}),

		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			resolve: {
				[BitcoinCashCashTokenFungibleAmountSelector.UtxoOutput]: async ({ $output }) => {
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
			}
			}
		})({
				fields: {
			$category: (snapshot) => snapshot.$category,
			amount: (snapshot) => snapshot.amount,
		},
			}),

		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.BitcoinCashCashTokenNft,
			resolve: {
				[BitcoinCashCashTokenNftSelector.UtxoOutput]: async ({ $output }) => {
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
			}
			}
		})({
				fields: {
			$category: (snapshot) => snapshot.$category,
			$commitment: (snapshot) => snapshot.$commitment,
			capability: (snapshot) => snapshot.capability,
		},
			}),

		defineResolver(Source.BitcoinCashNode_JsonRpc, {
			entityType: EntityType.BitcoinCashCashTokenCommitment,
			resolve: {
				[BitcoinCashCashTokenCommitmentSelector.UtxoOutput]: async ({ $output }) => {
				const output = await getOutput($output)
				if (output.tokenData?.nft == null) throw new Error('BitcoinCashNode_JsonRpc: output has no CashToken NFT commitment')
				return {
					commitmentHex: output.tokenData.nft.commitment,
				}
			}
			}
		})({
				fields: {
			commitmentHex: (snapshot) => snapshot.commitmentHex,
		},
			}),
	],
}
