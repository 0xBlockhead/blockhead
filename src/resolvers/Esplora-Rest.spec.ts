import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getTransaction = vi.fn()
const getBlock = vi.fn()
const getBlockHashByHeight = vi.fn()
const getBlockTransactionIds = vi.fn()
const getBlocks = vi.fn()
const getMempoolStats = vi.fn()
const getSuggestedFeePerByteSats = vi.fn()
const getMempoolTransactionIds = vi.fn()
const getAddress = vi.fn()
const getAddressUtxos = vi.fn()
const getAddressTransactions = vi.fn()
const getAsset = vi.fn()

vi.mock('$/sources/Esplora/Rest/queries.ts', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$/sources/Esplora/Rest/queries.ts')>()
	return {
		...actual,
		getTransaction,
		getBlock,
		getBlockHashByHeight,
		getBlockTransactionIds,
		getBlocks,
		getMempoolStats,
		getSuggestedFeePerByteSats,
		getMempoolTransactionIds,
		getAddress,
		getAddressUtxos,
		getAddressTransactions,
		getAsset,
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
const addressOutputsResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress
	&& '$$outputs' in resolver.projections
))
const addressTimestampResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.UtxoAddress_Timestamp
))
const networkTimestampResolver = esploraResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network_Timestamp
))

if (transactionResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoTransaction resolver')

if (inputResolver == null || outputResolver == null)
	throw new Error('Esplora-Rest spec missing child input/output resolver')

if (issuanceResolver == null || assetResolver == null)
	throw new Error('Esplora-Rest spec missing Elements issuance/asset resolver')

if (inscriptionResolver == null || runestoneResolver == null)
	throw new Error('Esplora-Rest spec missing Bitcoin Ordinals/Runes resolvers')

if (blockResolver == null || blockTransactionsResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoBlock height/tx list resolvers')

if (networkBlocksResolver == null)
	throw new Error('Esplora-Rest spec missing Network.Utxo.$$blocks resolver')

if (addressOutputsResolver == null || addressTimestampResolver == null)
	throw new Error('Esplora-Rest spec missing UtxoAddress resolvers')

if (networkTimestampResolver == null)
	throw new Error('Esplora-Rest spec missing Network_Timestamp resolver')

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
		getBlocks.mockReset()
		getMempoolStats.mockReset()
		getSuggestedFeePerByteSats.mockReset()
		getMempoolTransactionIds.mockReset()
		getAddress.mockReset()
		getAddressUtxos.mockReset()
		getAddressTransactions.mockReset()
		getAsset.mockReset()
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
		expect(transactionResolver.projections.$$inputs(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 0,
				},
			},
		])
		expect(transactionResolver.projections.$$outputs(transaction)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: entitySelector,
					indexInTransaction: 0,
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

	it('resolves NetworkHeight and projects block $$transactions + Network.Utxo.$$blocks', async () => {
		const hash = 'a'.repeat(64)
		getBlockHashByHeight.mockResolvedValueOnce(hash)
		getBlock.mockResolvedValueOnce({
			id: hash,
			height: 840_000,
			timestamp: 1_700_000_000,
			tx_count: 2,
			size: 1000,
			weight: 4000,
			merkle_root: 'm'.repeat(64),
			nonce: 1,
			difficulty: 1,
			previousblockhash: 'b'.repeat(64),
		})
		getBlockTransactionIds.mockResolvedValueOnce([
			'c'.repeat(64),
			'd'.repeat(64),
		])
		getBlocks.mockResolvedValueOnce([
			{
				id: hash,
				height: 840_000,
				timestamp: 1_700_000_000,
				tx_count: 2,
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
		expect(blockTransactionsResolver.projections.$$transactions(txs)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					txId: 'c'.repeat(64),
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: bitcoinNetwork,
					txId: 'd'.repeat(64),
				},
			},
		])

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

	it('projects address tip stats and outputs from Esplora address wires', async () => {
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
			},
		])

		const tip = await addressTimestampResolver.resolve.AddressTimestampMsSource.resolve({
			$address: {
				$network: bitcoinNetwork,
				address: 'bc1qexample',
			},
			timestampMs: 1,
			source: Source.Esplora_Rest,
		}, resolverContext)
		expect(addressTimestampResolver.projections.balanceSats(tip)).toBe(1000n)
		expect(addressTimestampResolver.projections.mempoolTransactionCount(tip)).toBe(2)
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

		const tip = await networkTimestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: bitcoinNetwork,
			timestampMs: 42,
			source: Source.Esplora_Rest,
		}, resolverContext)
		expect(networkTimestampResolver.projections.Utxo.bestBlockHeight(tip)).toBe(900_000n)
		expect(networkTimestampResolver.projections.Utxo.bestBlockHash(tip)).toBe('f'.repeat(64))
		expect(networkTimestampResolver.projections.Utxo.bestBlockTimeMs(tip)).toBe(1_800_000_000_000)
		expect(networkTimestampResolver.projections.Utxo.mempoolTransactionCount(tip)).toBe(11)
		expect(networkTimestampResolver.projections.Utxo.suggestedTransactionFeePerByteSats(tip)).toBe(7)

		const networkTipResolver = esploraResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& '$$timestamps' in resolver.projections
		))
		if (networkTipResolver == null)
			throw new Error('Esplora-Rest missing Network.$$timestamps resolver')

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
		const timestamps = await networkTipResolver.resolve.Caip2.resolve(bitcoinNetwork, resolverContext)
		expect(timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'bestBlockTimeMs')]: 1_800_000_000_000,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Utxo'], 'suggestedTransactionFeePerByteSats')]: 7,
		})
	})
})
