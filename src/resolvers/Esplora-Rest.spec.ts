import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getTransaction = vi.fn()
const getBlock = vi.fn()
const getBlockHashByHeight = vi.fn()
const getBlockTransactionIds = vi.fn()
const getBlockTransactions = vi.fn()
const getBlocks = vi.fn()
const getMempoolStats = vi.fn()
const getSuggestedFeePerByteSats = vi.fn()
const getMempoolTransactionIds = vi.fn()
const getAddress = vi.fn()
const getAddressUtxos = vi.fn()
const getAddressTransactions = vi.fn()
const getAsset = vi.fn()
const getAssetTransactions = vi.fn()
const getOutspend = vi.fn()

vi.mock('$/sources/Esplora/Rest/queries.ts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$/sources/Esplora/Rest/queries.ts')>()
	return {
		...actual,
		getTransaction,
		getBlock,
		getBlockHashByHeight,
		getBlockTransactionIds,
		getBlockTransactions,
		getBlocks,
		getMempoolStats,
		getSuggestedFeePerByteSats,
		getMempoolTransactionIds,
		getAddress,
		getAddressUtxos,
		getAddressTransactions,
		getAsset,
		getAssetTransactions,
		getOutspend,
		getTransactionProtocolPayloads: async ({
			target,
			txId,
		}: {
			target: string
			txId: string
		}) => {
			const { extractEsploraProtocolPayloads } = await import('$/sources/BitcoinCore/JsonRpc/protocol.ts')
			return extractEsploraProtocolPayloads(
				await getTransaction({
					target,
					txId,
				})
			)
		},
	}
})

const { default: esploraResolvers } = await import('$/resolvers/Esplora-Rest.ts')

const transactionResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoTransaction
))
const inputResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoInput
))
const outputResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& 'valueSats' in resolver.projections
))
const outputSpentResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoOutput
	&& 'isSpent' in resolver.projections
	&& !('valueSats' in resolver.projections)
))
const issuanceResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ElementsIssuance
))
const pegResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ElementsPeg
))
const assetResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ElementsAsset
	&& 'name' in resolver.projections
))
const assetTimestampsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ElementsAsset
	&& '$$timestamps' in resolver.projections
))
const assetIssuancesResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ElementsAsset
	&& '$$issuances' in resolver.projections
	&& typeof resolver.projections.$$issuances === 'object'
	&& 'select' in resolver.projections.$$issuances
))
const assetIssuanceCountResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.ElementsAsset
	&& '$$issuances' in resolver.projections
	&& typeof resolver.projections.$$issuances === 'object'
	&& 'resolveCount' in resolver.projections.$$issuances
))
const inscriptionResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinOrdinalInscription
))
const runestoneResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BitcoinRunestone
))
const blockResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& 'NetworkHeight' in resolver.resolve
	&& 'NetworkHeightHash' in resolver.resolve
))
const blockTransactionsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoBlock
	&& '$$transactions' in resolver.projections
))
const networkBlocksResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$blocks' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$blocks === 'function'
))
const addressTransactionsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$transactions' in resolver.projections
))
const networkMempoolTransactionsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Utxo' in resolver.projections
	&& '$$transactions' in resolver.projections.Utxo
	&& typeof resolver.projections.Utxo.$$transactions === 'function'
))
const addressOutputsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))
const addressTimestampsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$timestamps' in resolver.projections
))
const networkTimestampsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

if (transactionResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null || outputSpentResolver == null)
	throw new Error('Esplora-Rest spec missing child input/output resolver')

if (issuanceResolver == null || assetResolver == null || assetTimestampsResolver == null || assetIssuancesResolver == null || assetIssuanceCountResolver == null)
	throw new Error('Esplora-Rest spec missing Elements issuance/asset resolver')

if (inscriptionResolver == null || runestoneResolver == null)
	throw new Error('Esplora-Rest spec missing Bitcoin Ordinals/Runes resolvers')

if (blockResolver == null || blockTransactionsResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoBlock height/tx list resolvers')

if (networkBlocksResolver == null)
	throw new Error('Esplora-Rest spec missing Network.Utxo.$$blocks resolver')

if (addressOutputsResolver == null || addressTimestampsResolver == null || addressTransactionsResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoAddress resolvers')

if (networkMempoolTransactionsResolver == null)
	throw new Error('Esplora-Rest spec missing Network.Utxo.$$transactions resolver')

if (networkTimestampsResolver == null)
	throw new Error('Esplora-Rest spec missing Network.$$timestamps resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const liquidNetwork = {
	slug: 'liquid',
}

const bitcoinNetwork = {
	caip2: networkBySlug.bitcoin.caip2,
}

const helloWorldInscriptionHex = (
	'0063'
	+ '036f7264'
	+ '0101'
	+ '18746578742f706c61696e3b636861727365743d7574662d38'
	+ '00'
	+ '0d48656c6c6f2c20776f726c6421'
	+ '68'
)

describe('Esplora UTXO', () => {
	beforeEach(() => {
		getTransaction.mockReset()
		getBlock.mockReset()
		getBlockHashByHeight.mockReset()
		getBlockTransactionIds.mockReset()
		getBlockTransactions.mockReset()
		getBlocks.mockReset()
		getMempoolStats.mockReset()
		getSuggestedFeePerByteSats.mockReset()
		getMempoolTransactionIds.mockReset()
		getAddress.mockReset()
		getAddressUtxos.mockReset()
		getAddressTransactions.mockReset()
		getAsset.mockReset()
		getAssetTransactions.mockReset()
		getOutspend.mockReset()
	})

	it('resolves one native Liquid peg-out into a clocked Elements hierarchy', async () => {
		if (pegResolver == null) throw new Error('Esplora-Rest missing ElementsPeg resolver')
		getTransaction.mockResolvedValueOnce({
			txid: 'a'.repeat(64),
			status: { confirmed: true, block_height: 3_500_000, block_time: 1_800_000_000 },
			vin: [],
			vout: [{
				scriptpubkey: '6a',
				scriptpubkey_type: 'op_return',
				value: 125_000,
				pegout: { genesis_hash: 'b'.repeat(64), scriptpubkey: '0014abcd' },
			}],
		})
		const selector = {
			$network: { $network: { slug: 'liquid' } },
			pegTransactionId: 'a'.repeat(64),
			direction: 'PegOut' as const,
		}
		const snapshot = await pegResolver.resolve.ElementsNetworkPegTransactionIdDirection.resolve(selector, resolverContext)

		expect(pegResolver.projections.amountSats(snapshot)).toBe(125_000n)
		expect(pegResolver.projections.claimScript(snapshot)).toBe('0014abcd')
		expect(pegResolver.projections.$$timestamps(snapshot)[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$peg: selector,
				timestampMs: 1_800_000_000_000,
				source: Source.Esplora_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ElementsPeg_Timestamp, [], 'status')]: 'confirmed',
				[entityFieldAddressKey(EntityType.ElementsPeg_Timestamp, [], 'observedElementsHeight')]: 3_500_000n,
			},
		})
	})

	it('discovers exact native pegs from their owning Liquid transaction', async () => {
		const txId = 'a'.repeat(64)
		getTransaction.mockResolvedValueOnce({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			weight: 400,
			fee: 250,
			status: { confirmed: false },
			vin: [{
				txid: 'b'.repeat(64),
				vout: 0,
				is_coinbase: false,
				is_pegin: true,
				sequence: 1,
			}],
			vout: [{
				scriptpubkey: '6a',
				scriptpubkey_type: 'op_return',
				value: 125_000,
				pegout: { genesis_hash: 'c'.repeat(64), scriptpubkey: '0014abcd' },
			}],
		})
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve({
			$network: { slug: 'liquid' },
			txId,
		}, resolverContext)

		expect(transactionResolver.projections.$$elementsPegs(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: { $network: { slug: 'liquid' } },
					pegTransactionId: txId,
					direction: 'PegIn',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: { $network: { slug: 'liquid' } },
					pegTransactionId: txId,
					direction: 'PegOut',
				},
			},
		])
	})

	it('projects child selectors and resolves Elements confidential outputs without inventing valueSats', async () => {
		const txId = 'c'.repeat(64)
		getTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			weight: 400,
			fee: 250,
			status: {
				confirmed: true,
				block_height: 100,
				block_hash: 'b'.repeat(64),
			},
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				scriptsig_asm: 'input asm',
				is_coinbase: false,
				sequence: 1,
				witness: [
					'wit',
				],
			}],
			vout: [{
				scriptpubkey: '5120',
				scriptpubkey_asm: 'OP_1',
				scriptpubkey_type: 'v1_p2tr',
				scriptpubkey_address: 'ex1qexample',
				valuecommitment: 'valuecommit',
				assetcommitment: 'assetcommit',
				noncecommitment: 'noncecommit',
				surjection_proof: 'surj',
				range_proof: 'range',
			}],
		})

		const entitySelector = {
			$network: liquidNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$inputs(transaction)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoInput, [], '$spentOutput')]: {
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: liquidNetwork,
								txId: 'd'.repeat(64),
							},
							indexInTransaction: 1,
						},
					},
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'scriptSigAsm')]: 'input asm',
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'sequence')]: 1,
					[entityFieldAddressKey(EntityType.UtxoInput, [], 'witness')]: ['wit'],
				},
			},
		])
		expect(transactionResolver.projections.$$outputs(transaction)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyAsm')]: 'OP_1',
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyHex')]: '5120',
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'scriptPubKeyType')]: 'v1_p2tr',
					[entityFieldAddressKey(EntityType.UtxoOutput, [], '$address')]: {
						[EntityMetaKey.Selector]: {
							$network: liquidNetwork,
							address: 'ex1qexample',
						},
					},
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isConfidential')]: true,
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'valueCommitment')]: 'valuecommit',
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'assetCommitment')]: 'assetcommit',
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'nonceCommitment')]: 'noncecommit',
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'surjectionProof')]: 'surj',
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'rangeProof')]: 'range',
				},
			},
		])

		const input = await inputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)
		expect(inputResolver.projections.$spentOutput(input)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: liquidNetwork,
					txId: 'd'.repeat(64),
				},
				indexInTransaction: 1,
			},
		})

		const output = await outputResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: entitySelector,
			indexInTransaction: 0,
		}, resolverContext)
		expect(outputResolver.projections.valueSats(output)).toBeUndefined()
		expect(outputResolver.projections.isConfidential(output)).toBe(true)
		expect(outputResolver.projections.Confidential.valueCommitment(output)).toBe('valuecommit')
		expect(outputResolver.projections.Confidential.assetCommitment(output)).toBe('assetcommit')
		expect(outputResolver.projections.Confidential.nonceCommitment(output)).toBe('noncecommit')
		expect(outputResolver.projections.Confidential.surjectionProof(output)).toBe('surj')
		expect(outputResolver.projections.Confidential.rangeProof(output)).toBe('range')

		getOutspend.mockResolvedValueOnce({
			spent: true,
			txid: 'e'.repeat(64),
			vin: 0,
		})
		expect(
			outputSpentResolver.projections.isSpent(
				await outputSpentResolver.resolve.TransactionIndexInTransaction.resolve({
					$transaction: entitySelector,
					indexInTransaction: 0,
				}, resolverContext)
			)
		).toBe(true)
		expect(getOutspend).toHaveBeenCalledWith({
			target: 'liquid',
			txId,
			vout: 0,
		})
	})

	it('resolves native Liquid issuance and reissuance-token relationships', async () => {
		const txId = 'c'.repeat(64)
		const assetId = 'a'.repeat(64)
		const tokenId = 'b'.repeat(64)
		getTransaction.mockResolvedValue({
			txid: txId,
			status: {
				confirmed: true,
			},
			vin: [{
				is_coinbase: false,
				sequence: 1,
				issuance: {
					asset_id: assetId,
					is_reissuance: false,
					asset_blinding_nonce: '0'.repeat(64),
					asset_entropy: 'e'.repeat(64),
					assetamount: 125_000,
					token: tokenId,
					tokenamount: 1,
				},
			}],
			vout: [],
		})
		const selector = {
			$transaction: {
				$network: liquidNetwork,
				txId,
			},
			inputIndex: 0,
		}
		const issuance = await issuanceResolver.resolve.UtxoTransactionInputIndex.resolve(selector)

		expect(issuanceResolver.projections.$asset(issuance)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: {
					$network: liquidNetwork,
				},
				assetId,
			},
		})
		expect(issuanceResolver.projections.$reissuanceTokenAsset(issuance)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: {
					$network: liquidNetwork,
				},
				assetId: tokenId,
			},
		})
		expect(issuanceResolver.projections.issuedAmount(issuance)).toBe(125_000n)
		expect(issuanceResolver.projections.tokenAmount(issuance)).toBe(1n)
		expect(issuanceResolver.projections.isReissuance(issuance)).toBe(false)
		expect(getTransaction).toHaveBeenCalledWith({
			target: 'liquid',
			txId,
		})

		getAsset.mockResolvedValue({
			asset_id: assetId,
			name: 'Issued asset',
			chain_stats: {
				tx_count: 1,
			},
			mempool_stats: {
				tx_count: 0,
			},
		})
		const asset = await assetResolver.resolve.ElementsNetworkAssetId.resolve({
			$network: {
				$network: liquidNetwork,
			},
			assetId,
		})
		expect(assetResolver.projections.name(asset)).toBe('Issued asset')
		expect(getAsset).toHaveBeenCalledWith({
			assetId,
			target: 'liquid',
		})

		getAsset.mockResolvedValueOnce({
			asset_id: assetId,
			chain_stats: {
				issued_amount: 125_000,
				burned_amount: 1_000,
				reissuance_tokens: 2,
				tx_count: 1,
			},
			mempool_stats: {
				tx_count: 0,
			},
		})
		const assetTimestamps = await assetTimestampsResolver.resolve.ElementsNetworkAssetId.resolve({
			$network: {
				$network: liquidNetwork,
			},
			assetId,
		}, resolverContext)
		expect(assetTimestampsResolver.projections.$$timestamps(assetTimestamps)[0][EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.ElementsAsset_Timestamp, [], 'issuedAmount')]: 125_000n,
			[entityFieldAddressKey(EntityType.ElementsAsset_Timestamp, [], 'burnedAmount')]: 1_000n,
			[entityFieldAddressKey(EntityType.ElementsAsset_Timestamp, [], 'reissuanceTokenCount')]: 2,
		})
		expect(esploraResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.ElementsAsset_Timestamp
		))).toBe(false)
	})

	it('pages native Liquid asset issuances and preserves issuance_count', async () => {
		const txId = 'c'.repeat(64)
		const burnTxId = 'd'.repeat(64)
		const assetId = 'a'.repeat(64)
		const tokenId = 'b'.repeat(64)
		const assetSelector = {
			$network: {
				$network: liquidNetwork,
			},
			assetId,
		}
		getAssetTransactions.mockResolvedValueOnce([
			{
				txid: txId,
				status: {
					confirmed: true,
				},
				vin: [{
					is_coinbase: false,
					sequence: 1,
					issuance: {
						asset_id: assetId,
						is_reissuance: false,
						asset_blinding_nonce: '0'.repeat(64),
						asset_entropy: 'e'.repeat(64),
						assetamount: 125_000,
						token: tokenId,
						tokenamount: 1,
					},
				}],
				vout: [],
			},
			{
				txid: burnTxId,
				status: {
					confirmed: true,
				},
				vin: [{
					is_coinbase: false,
					sequence: 1,
				}],
				vout: [],
			},
		])
		const page = await assetIssuancesResolver.resolve.ElementsNetworkAssetId.resolve(
			assetSelector,
			resolverContext
		)
		expect(assetIssuancesResolver.projections.$$issuances.select(page)).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: liquidNetwork,
					txId,
				},
				inputIndex: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], '$asset')]: {
					[EntityMetaKey.Selector]: {
						$network: {
							$network: liquidNetwork,
						},
						assetId,
					},
				},
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], '$reissuanceTokenAsset')]: {
					[EntityMetaKey.Selector]: {
						$network: {
							$network: liquidNetwork,
						},
						assetId: tokenId,
					},
				},
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'assetEntropy')]: 'e'.repeat(64),
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'assetBlindingNonce')]: '0'.repeat(64),
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'issuedAmount')]: 125_000n,
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'tokenAmount')]: 1n,
				[entityFieldAddressKey(EntityType.ElementsIssuance, [], 'isReissuance')]: false,
			},
		}])
		expect(assetIssuancesResolver.projections.$$issuances.continuation(page)).toEqual({
			operation: 'asset-issuances',
			target: assetId,
			terminal: true,
		})
		expect(getAssetTransactions).toHaveBeenCalledWith({
			assetId,
			lastSeenTransactionId: undefined,
			target: 'liquid',
		})

		getAsset.mockResolvedValueOnce({
			asset_id: assetId,
			chain_stats: {
				issuance_count: 4,
				tx_count: 6,
			},
			mempool_stats: {
				tx_count: 0,
			},
		})
		expect(
			assetIssuanceCountResolver.projections.$$issuances.resolveCount(
				await assetIssuanceCountResolver.resolve.ElementsNetworkAssetId.resolve(assetSelector)
			)
		).toBe(4)

		await expect(assetIssuancesResolver.resolve.ElementsNetworkAssetId.resolve({
			$network: {
				$network: {
					slug: 'bitcoin',
				},
			},
			assetId,
		}, resolverContext)).rejects.toThrow('unsupported Elements network')
		expect(getAssetTransactions).toHaveBeenCalledTimes(1)
	})

	it('rejects absent issuance and non-Liquid issuance selectors', async () => {
		const txId = 'c'.repeat(64)
		getTransaction.mockResolvedValue({
			txid: txId,
			status: {
				confirmed: false,
			},
			vin: [{
				is_coinbase: false,
				sequence: 1,
			}],
			vout: [],
		})

		await expect(issuanceResolver.resolve.UtxoTransactionInputIndex.resolve({
			$transaction: {
				$network: liquidNetwork,
				txId,
			},
			inputIndex: 0,
		})).rejects.toThrow('transaction input 0 has no issuance')
		await expect(issuanceResolver.resolve.UtxoTransactionInputIndex.resolve({
			$transaction: {
				$network: {
					slug: 'bitcoin',
				},
				txId,
			},
			inputIndex: 0,
		})).rejects.toThrow('Elements issuance requires the Liquid network')
	})

	it('projects Ordinals inscriptions and Runestone refs from Bitcoin reveal txs', async () => {
		const txId = '1'.repeat(64)
		getTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 200,
			weight: 500,
			fee: 100,
			status: {
				confirmed: true,
				block_height: 840001,
				block_hash: '2'.repeat(64),
			},
			vin: [{
				txid: '3'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d03020100',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
		})

		const entitySelector = {
			$network: bitcoinNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					inscriptionId: `${txId}i0`,
				},
			},
		])
		expect(transactionResolver.projections.$bitcoinRunestone(transaction)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: entitySelector,
				outputIndex: 0,
			},
		})

		const inscription = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId: `${txId}i0`,
		}, resolverContext)
		expect(inscriptionResolver.projections.contentType(inscription)).toBe('text/plain;charset=utf-8')
		expect(inscriptionResolver.projections.bodyHex(inscription)).toBe('48656c6c6f2c20776f726c6421')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('020100')
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(false)
	})

	it('projects multi-envelope inscriptions and LEB128 cenotaph runestones', async () => {
		const txId = 'a'.repeat(64)
		const secondInscriptionHex = (
			'0063'
			+ '036f7264'
			+ '0101'
			+ '0a746578742f706c61696e'
			+ '00'
			+ '024869'
			+ '68'
		)
		getTransaction.mockResolvedValue({
			txid: txId,
			version: 2,
			locktime: 0,
			size: 300,
			weight: 600,
			fee: 200,
			status: {
				confirmed: true,
				block_height: 840001,
				block_hash: '2'.repeat(64),
			},
			vin: [{
				txid: '3'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 0xffffffff,
				witness: [
					helloWorldInscriptionHex + secondInscriptionHex,
				],
			}],
			vout: [
				{
					scriptpubkey: '6a5d037e0000',
					scriptpubkey_type: 'op_return',
					value: 0,
				},
			],
		})

		const entitySelector = {
			$network: bitcoinNetwork,
			txId,
		}
		const transaction = await transactionResolver.resolve.NetworkTxId.resolve(entitySelector, resolverContext)
		expect(transactionResolver.projections.$$bitcoinOrdinalInscriptions(transaction)).toHaveLength(2)

		const second = await inscriptionResolver.resolve.NetworkInscriptionId.resolve({
			$network: bitcoinNetwork,
			inscriptionId: `${txId}i1`,
		}, resolverContext)
		expect(inscriptionResolver.projections.inscriptionIndex(second)).toBe(1)
		expect(inscriptionResolver.projections.bodyHex(second)).toBe('4869')

		const runestone = await runestoneResolver.resolve.TransactionOutputIndex.resolve({
			$transaction: entitySelector,
			outputIndex: 0,
		}, resolverContext)
		expect(runestoneResolver.projections.isCenotaph(runestone)).toBe(true)
		expect(runestoneResolver.projections.payloadHex(runestone)).toBe('7e0000')
	})

	it('resolves NetworkHeight and paginates block $$transactions with embedded hierarchy', async () => {
		const hash = 'a'.repeat(64)
		const blockTransaction = {
			txid: 'c'.repeat(64),
			version: 2,
			locktime: 0,
			size: 200,
			weight: 800,
			fee: 1_000,
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: hash,
			},
			vin: [{
				txid: 'd'.repeat(64),
				vout: 1,
				is_coinbase: false,
				sequence: 4_294_967_293,
				witness: ['3044'],
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				scriptpubkey_address: 'bc1qrecipient',
				value: 40_000,
			}],
		}
		getBlockHashByHeight.mockResolvedValueOnce(hash)
		getBlock.mockResolvedValueOnce({
			id: hash,
			height: 840_000,
			timestamp: 1_700_000_000,
			tx_count: 1,
			size: 1000,
			weight: 4000,
			merkle_root: 'm'.repeat(64),
			nonce: 1,
			difficulty: 1,
			previousblockhash: 'b'.repeat(64),
		})
		getBlockTransactions.mockResolvedValueOnce([blockTransaction])
		getBlocks.mockResolvedValueOnce([
			{
				id: hash,
				height: 840_000,
				timestamp: 1_700_000_000,
				tx_count: 1,
			},
		])

		const byHeight = await blockResolver.resolve.NetworkHeight.resolve({
			$network: bitcoinNetwork,
			height: 840_000n,
		}, resolverContext)
		expect(blockResolver.projections.hash(byHeight)).toBe(hash)
		expect(blockResolver.projections.timestampMs(byHeight)).toBe(1_700_000_000_000)

		const txs = await blockTransactionsResolver.resolve.NetworkHeightHash.resolve({
			$network: bitcoinNetwork,
			height: 840_000n,
			hash,
		}, resolverContext)
		expect(blockTransactionsResolver.projections.$$transactions(txs)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: 'c'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 1_000n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$inputs')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: bitcoinNetwork,
							txId: 'c'.repeat(64),
						},
						indexInTransaction: 0,
					},
				}],
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], '$$outputs')]: [{
					[EntityMetaKey.Selector]: {
						$transaction: {
							$network: bitcoinNetwork,
							txId: 'c'.repeat(64),
						},
						indexInTransaction: 0,
					},
				}],
			},
		}])
		expect(getBlockTransactions).toHaveBeenCalledWith(expect.objectContaining({
			blockHash: hash,
			startIndex: 0,
		}))

		const blocks = await networkBlocksResolver.resolve.Caip2.resolve(bitcoinNetwork, {
			...resolverContext,
			pagination: {
				limit: 1,
			},
		})
		expect(networkBlocksResolver.projections.Utxo.$$blocks(blocks)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					height: 840_000n,
					hash,
				},
			},
		])
	})

	it('resumes network block pages from the native start height', async () => {
		getBlocks
			.mockResolvedValueOnce([
				{
					id: 'a'.repeat(64),
					height: 3,
					timestamp: 1_700_000_000,
					tx_count: 1,
				},
			])
			.mockResolvedValueOnce([
				{
					id: 'b'.repeat(64),
					height: 1,
					timestamp: 1_699_999_000,
					tx_count: 1,
				},
			])

		await expect(networkBlocksResolver.resolve.Caip2.resolve(bitcoinNetwork, {
			...resolverContext,
			pagination: {
				limit: 1,
				offset: 2,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					height: 1n,
					hash: 'b'.repeat(64),
				},
			},
		])
		expect(getBlocks).toHaveBeenNthCalledWith(2, expect.objectContaining({
			startHeight: 1n,
		}))
	})

	it('projects address tip stats, embedded outputs, and transaction hierarchy from Esplora address wires', async () => {
		const addressTransaction = {
			txid: 'f'.repeat(64),
			version: 2,
			locktime: 0,
			size: 141,
			weight: 561,
			fee: 250,
			status: {
				confirmed: true,
				block_height: 840_000,
				block_hash: 'a'.repeat(64),
			},
			vin: [{
				txid: 'g'.repeat(64),
				vout: 0,
				is_coinbase: false,
				sequence: 1,
				witness: [],
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				value: 546,
			}],
		}
		getAddressUtxos.mockResolvedValueOnce([
			{
				txid: 'e'.repeat(64),
				vout: 1,
				status: {
					confirmed: true,
				},
				value: 546,
			},
		])
		getAddressTransactions.mockResolvedValueOnce([addressTransaction])
		getAddress.mockResolvedValueOnce({
			address: 'bc1qexample',
			chain_stats: {
				funded_txo_count: 3,
				funded_txo_sum: 1500,
				spent_txo_count: 1,
				spent_txo_sum: 500,
				tx_count: 4,
			},
			mempool_stats: {
				funded_txo_count: 0,
				funded_txo_sum: 0,
				spent_txo_count: 0,
				spent_txo_sum: 0,
				tx_count: 2,
			},
		})

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve({
			$network: bitcoinNetwork,
			address: 'bc1qexample',
		}, {
			...resolverContext,
			pagination: {
				limit: 10,
			},
		})
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: bitcoinNetwork,
						txId: 'e'.repeat(64),
					},
					indexInTransaction: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'valueSats')]: 546n,
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
				},
			},
		])

		const page = await addressTransactionsResolver.resolve.NetworkAddress.resolve({
			$network: bitcoinNetwork,
			address: 'bc1qexample',
		}, resolverContext)
		const addressTransactionsProjection = addressTransactionsResolver.projections.$$transactions
		if (typeof addressTransactionsProjection !== 'object' || !('select' in addressTransactionsProjection))
			throw new Error('Esplora-Rest UtxoAddress.$$transactions projection is not paginated')
		expect(addressTransactionsProjection.select(page, {
			$network: bitcoinNetwork,
			address: 'bc1qexample',
		})).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: 'f'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 250n,
			},
		}])

		const tip = await addressTimestampsResolver.resolve.NetworkAddress.resolve({
			$network: bitcoinNetwork,
			address: 'bc1qexample',
		}, resolverContext)
		const addressObservation = addressTimestampsResolver.projections.$$timestamps(tip)[0]
		expect(addressObservation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'balanceSats')]: 1000n,
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'mempoolTransactionCount')]: 2,
		})
		expect(esploraResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.UtxoAddress_Timestamp
		))).toBe(false)
	})

	it('materializes mempool transaction hierarchy from authoritative transaction reads', async () => {
		getMempoolTransactionIds.mockResolvedValueOnce([
			'a'.repeat(64),
			'b'.repeat(64),
		])
		getTransaction.mockResolvedValueOnce({
			txid: 'b'.repeat(64),
			version: 2,
			locktime: 0,
			size: 141,
			weight: 561,
			fee: 1_250,
			status: {
				confirmed: false,
			},
			vin: [{
				txid: 'd'.repeat(64),
				vout: 2,
				is_coinbase: false,
				sequence: 4_294_967_293,
				witness: ['3044'],
			}],
			vout: [{
				scriptpubkey: '0014',
				scriptpubkey_type: 'v0_p2wpkh',
				scriptpubkey_address: 'bc1qrecipient',
				value: 40_000,
			}],
		})

		const rows = await networkMempoolTransactionsResolver.resolve.Caip2.resolve(bitcoinNetwork, {
			...resolverContext,
			pagination: {
				limit: 1,
				offset: 1,
			},
		})
		expect(rows).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: bitcoinNetwork,
				txId: 'b'.repeat(64),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'virtualSizeBytes')]: 141,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'feeSats')]: 1_250n,
				[entityFieldAddressKey(EntityType.UtxoTransaction, [], 'isCoinbase')]: false,
			},
		}])
		expect(getMempoolTransactionIds).toHaveBeenCalledOnce()
		expect(getTransaction).toHaveBeenCalledWith(expect.objectContaining({
			txId: 'b'.repeat(64),
		}))
	})

	it('projects Network_Timestamp tip fields including bestBlockTimeMs', async () => {
		getBlocks.mockResolvedValueOnce([
			{
				id: 'f'.repeat(64),
				height: 900_000,
				timestamp: 1_800_000_000,
				tx_count: 1,
			},
		])
		getMempoolStats.mockResolvedValueOnce({
			count: 11,
			vsize: 2200,
			total_fee: 1,
		})
		getSuggestedFeePerByteSats.mockResolvedValueOnce(7)

		const timestamps = await networkTimestampsResolver.resolve.Caip2.resolve(bitcoinNetwork, resolverContext)
		expect(timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_800_000_000_000,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: 7,
		})
		expect(esploraResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.Network_Timestamp
		))).toBe(false)
	})

	it('projects Liquid address UTXOs, retrieval clocks, and network mempool observations', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_111_000)
		getAddressUtxos.mockResolvedValueOnce([
			{
				txid: 'a'.repeat(64),
				vout: 0,
				status: {
					confirmed: true,
				},
				valuecommitment: 'valuecommit',
				assetcommitment: 'assetcommit',
			},
		])
		getAddress.mockResolvedValueOnce({
			address: 'ex1qexample',
			chain_stats: {
				funded_txo_count: 1,
				funded_txo_sum: 0,
				spent_txo_count: 0,
				spent_txo_sum: 0,
				tx_count: 1,
			},
			mempool_stats: {
				funded_txo_count: 0,
				funded_txo_sum: 0,
				spent_txo_count: 0,
				spent_txo_sum: 0,
				tx_count: 2,
			},
		})
		getBlocks.mockResolvedValueOnce([
			{
				id: 'b'.repeat(64),
				height: 3_500_000,
				timestamp: 1_800_000_000,
				tx_count: 8,
			},
		])
		getMempoolStats.mockResolvedValueOnce({
			count: 4,
			vsize: 800,
			total_fee: 1,
		})
		getSuggestedFeePerByteSats.mockResolvedValueOnce(2)

		const outputs = await addressOutputsResolver.resolve.NetworkAddress.resolve({
			$network: liquidNetwork,
			address: 'ex1qexample',
		}, {
			...resolverContext,
			pagination: {
				limit: 10,
			},
		})
		expect(addressOutputsResolver.projections.$$outputs(outputs)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: liquidNetwork,
						txId: 'a'.repeat(64),
					},
					indexInTransaction: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isSpent')]: false,
					[entityFieldAddressKey(EntityType.UtxoOutput, [], 'isConfidential')]: true,
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'valueCommitment')]: 'valuecommit',
					[entityFieldAddressKey(EntityType.UtxoOutput, ['Confidential'], 'assetCommitment')]: 'assetcommit',
				},
			},
		])

		const tip = await addressTimestampsResolver.resolve.NetworkAddress.resolve({
			$network: liquidNetwork,
			address: 'ex1qexample',
		}, resolverContext)
		expect(addressTimestampsResolver.projections.$$timestamps(tip)[0][EntityMetaKey.Selector]).toMatchObject({
			timestampMs: 1_700_000_111_000,
			source: Source.Esplora_Rest,
		})
		expect(addressTimestampsResolver.projections.$$timestamps(tip)[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.UtxoAddress_Timestamp, [], 'mempoolTransactionCount')]: 2,
		})

		const timestamps = await networkTimestampsResolver.resolve.Slug.resolve(liquidNetwork, resolverContext)
		expect(timestamps[0][EntityMetaKey.Selector]).toMatchObject({
			$network: liquidNetwork,
			timestampMs: 1_700_000_111_000,
			source: Source.Esplora_Rest,
		})
		expect(timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHeight')]: 3_500_000n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockHash')]: 'b'.repeat(64),
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_800_000_000_000,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'mempoolTransactionCount')]: 4,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: 2,
		})
		expect(getAddressUtxos).toHaveBeenCalledWith({
			address: 'ex1qexample',
			target: 'liquid',
		})
		expect(getBlocks).toHaveBeenCalledWith({
			target: 'liquid',
		})
		expect(getMempoolStats).toHaveBeenCalledWith('liquid')
	})
})
