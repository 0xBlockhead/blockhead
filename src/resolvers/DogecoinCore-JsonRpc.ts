import {
	defineResolver,
	type RegisteredSourceResolverModule,
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

const assertDogecoinMainnet = (network: NetworkId) => {
	if (
		'caip2' in network ?
			(
				network.caip2.namespace !== networkBySlug.dogecoin.caip2.namespace
				|| network.caip2.reference !== networkBySlug.dogecoin.caip2.reference
			)
		:
			network.slug !== networkBySlug.dogecoin.slug
	) {
		throw new Error('DogecoinCore_JsonRpc: unsupported Dogecoin network')
	}
}

export default {
	source: Source.DogecoinCore_JsonRpc,

	resolvers: [
		defineResolver({
			entityType: EntityType.DogecoinBlockAuxPow,
			resolve: {
				Block: {
					resolve: async ({ $block }) => {
						assertDogecoinMainnet($block.$network)
						const { getBlock } = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
						const block = await getBlock({
							blockHash: $block.hash,
						})
						if (block.auxpow == null)
							throw new Error('DogecoinCore_JsonRpc: block does not contain AuxPoW')

						return {
							$parentBlockHeader: {
								[EntityMetaKey.Selector]: {
									$auxPow: {
										$block,
									},
								},
							},
							$coinbaseBranch: {
								[EntityMetaKey.Selector]: {
									$auxPow: {
										$block,
									},
									branchKind: 'coinbase',
								},
							},
							$chainBranch: {
								[EntityMetaKey.Selector]: {
									$auxPow: {
										$block,
									},
									branchKind: 'chain',
								},
							},
						}
					},
				},
			},
		})({
			$parentBlockHeader: (auxPow) => auxPow.$parentBlockHeader,
			$coinbaseBranch: (auxPow) => auxPow.$coinbaseBranch,
			$chainBranch: (auxPow) => auxPow.$chainBranch,
		}),

		defineResolver({
			entityType: EntityType.DogecoinAuxPowMerkleBranch,
			resolve: {
				AuxPowBranchKind: {
					resolve: async ({ $auxPow, branchKind }) => {
						assertDogecoinMainnet($auxPow.$block.$network)
						const { getBlock } = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
						const block = await getBlock({
							blockHash: $auxPow.$block.hash,
						})
						if (block.auxpow == null)
							throw new Error('DogecoinCore_JsonRpc: block does not contain AuxPoW')
						if (branchKind !== 'coinbase' && branchKind !== 'chain')
							throw new Error(`DogecoinCore_JsonRpc: unsupported AuxPoW branch kind ${branchKind}`)

						return {
							branchHashes: (
								branchKind === 'coinbase' ?
									block.auxpow.merklebranch
								:
									block.auxpow.chainmerklebranch
							),
							index: (
								branchKind === 'coinbase' ?
									block.auxpow.index
								:
									block.auxpow.chainindex
							),
						}
					},
				},
			},
		})({
			branchHashes: (branch) => branch.branchHashes,
			index: (branch) => branch.index,
		}),

		defineResolver({
			entityType: EntityType.DogecoinAuxPowParentBlockHeader,
			resolve: {
				AuxPow: {
					resolve: async ({ $auxPow }) => {
						assertDogecoinMainnet($auxPow.$block.$network)
						const { getBlock } = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
						const block = await getBlock({
							blockHash: $auxPow.$block.hash,
						})
						if (block.auxpow == null)
							throw new Error('DogecoinCore_JsonRpc: block does not contain AuxPoW')
						if (!/^[0-9a-fA-F]{160}$/.test(block.auxpow.parentblock))
							throw new Error('DogecoinCore_JsonRpc: malformed AuxPoW parent block header')

						return {
							merkleRoot: (
								Array.from(
									{ length: 32 },
									(_, byteIndex) => block.auxpow.parentblock.slice(
										72 + (31 - byteIndex) * 2,
										74 + (31 - byteIndex) * 2
									)
								).join('')
							),
							nonce: BigInt(
								Number.parseInt(
									Array.from(
										{ length: 4 },
										(_, byteIndex) => block.auxpow.parentblock.slice(
											152 + (3 - byteIndex) * 2,
											154 + (3 - byteIndex) * 2
										)
									).join(''),
									16
								)
							),
						}
					},
				},
			},
		})({
			merkleRoot: (header) => header.merkleRoot,
			nonce: (header) => header.nonce,
		}),

		defineResolver({
			entityType: EntityType.UtxoBlock,
			resolve: {
				NetworkHeightHash: {
					resolve: async ({ $network, hash }) => {
						assertDogecoinMainnet($network)
						const {
							getBlock,
						} = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
						const block = await getBlock({
							blockHash: hash,
						})
						if (typeof block === 'string')
							throw new Error('DogecoinCore_JsonRpc: expected verbose block')
						return {
							hash: block.hash,
							...(block.previousblockhash != null && {
								$parent: {
									[EntityMetaKey.Selector]: {
										$network: $network,
										height: BigInt(block.height - 1),
										hash: block.previousblockhash,
									},
								},
							}),
							timestampMs: block.time * 1000,
							merkleRoot: block.merkleroot,
							nonce: block.nonce,
							difficulty: block.difficulty,
							...(block.size != null && {
								sizeBytes: block.size,
							}),
							...(block.weight != null && {
								weightUnits: block.weight,
							}),
							transactionCount: block.nTx,
							$$transactions: block.tx.map((transaction) => (
								typeof transaction === 'string' ?
									{
										[EntityMetaKey.Selector]: {
											$network,
											txId: transaction,
										},
									}
								:
									{
										[EntityMetaKey.Selector]: {
											$network,
											txId: transaction.txid,
										},
									}
							)),
						}
					},
				}
			},
		})({
				hash: (snapshot) => snapshot.hash,
				$parent: (snapshot) => snapshot.$parent,
				timestampMs: (snapshot) => snapshot.timestampMs,
				merkleRoot: (snapshot) => snapshot.merkleRoot,
				nonce: (snapshot) => snapshot.nonce,
				difficulty: (snapshot) => snapshot.difficulty,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				transactionCount: (snapshot) => snapshot.transactionCount,
				$$transactions: (snapshot) => snapshot.$$transactions,
			}),

		defineResolver({
			entityType: EntityType.UtxoTransaction,
			resolve: {
				NetworkTxId: {
					resolve: async ({ $network, txId }) => {
						assertDogecoinMainnet($network)
						const { getRawTransaction } = await import('$/sources/DogecoinCore/JsonRpc/queries.ts')
						const transaction = await getRawTransaction({
							txId: txId,
						})
						if (typeof transaction === 'string')
							throw new Error('DogecoinCore_JsonRpc: expected verbose transaction')
						return {
							[EntityMetaKey.Selector]: {
								$network: $network,
								txId: transaction.txid,
							},
							version: transaction.version,
							lockTime: transaction.locktime,
							sizeBytes: transaction.size,
							virtualSizeBytes: transaction.vsize,
							weightUnits: transaction.weight,
							isCoinbase: transaction.vin.some((input) => input.coinbase != null),
						}
					},
				}
			},
		})({
				version: (snapshot) => snapshot.version,
				lockTime: (snapshot) => snapshot.lockTime,
				sizeBytes: (snapshot) => snapshot.sizeBytes,
				virtualSizeBytes: (snapshot) => snapshot.virtualSizeBytes,
				weightUnits: (snapshot) => snapshot.weightUnits,
				isCoinbase: (snapshot) => snapshot.isCoinbase,
			}),
	],
} satisfies RegisteredSourceResolverModule
