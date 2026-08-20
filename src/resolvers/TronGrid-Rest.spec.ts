import { describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const {
	getAccount,
	getAccountResource,
	getAccountTransactions,
	getBlockByNumber,
	getChainParameters,
	getNodeInfo,
	getNowBlock,
	getTransactionInfoById,
	listWitnesses,
} = vi.hoisted(() => ({
	getAccount: vi.fn(),
	getAccountResource: vi.fn(),
	getAccountTransactions: vi.fn(),
	getBlockByNumber: vi.fn(),
	getChainParameters: vi.fn(),
	getNodeInfo: vi.fn(),
	getNowBlock: vi.fn(),
	getTransactionInfoById: vi.fn(),
	listWitnesses: vi.fn(),
}))

vi.mock('$/sources/TronGrid/Rest/queries.ts', () => ({
	restEndpoints: [{
		url: 'https://api.trongrid.io',
		transportType: 'Http',
		providerName: 'TronGrid',
	}],
	getAccount,
	getAccountResource,
	getAccountTransactions,
	getBlockByNumber,
	getChainParameters,
	getNodeInfo,
	getNowBlock,
	getTransactionInfoById,
	listWitnesses,
}))

const { default: tronGridRest } = await import('$/resolvers/TronGrid-Rest.ts')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('TronGrid REST network relationships', () => {
	it('shares each network projection across exact CAIP-2 and slug applicability', async () => {
		const pairedResolvers = tronGridRest.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Caip2' in resolver.resolve
			&& 'Slug' in resolver.resolve
		))

		expect(pairedResolvers).toHaveLength(4)
		for (const resolver of pairedResolvers) {
			if (!('Caip2' in resolver.resolve) || !('Slug' in resolver.resolve))
				throw new Error('TronGrid paired network resolver is incomplete')

			expect(resolver.resolve.Caip2.resolve).toBe(resolver.resolve.Slug.resolve)
			expect(resolver.resolve.Caip2.appliesTo).toEqual([{
				caip2: networkBySlug.tron.caip2,
			}])
			expect(resolver.resolve.Slug.appliesTo).toEqual([{
				slug: networkBySlug.tron.slug,
			}])
		}

		const endpointResolver = pairedResolvers.find((resolver) => (
			'Tron' in resolver.projections
			&& 'restEndpoints' in resolver.projections.Tron
		))
		if (
			endpointResolver == null
			|| !('Caip2' in endpointResolver.resolve)
			|| !('Slug' in endpointResolver.resolve)
		)
			throw new Error('TronGrid endpoint resolver selector pair is missing')

		expect(
			await endpointResolver.resolve.Caip2.resolve({
				caip2: networkBySlug.tron.caip2,
			}, resolverContext)
		).toEqual(
			await endpointResolver.resolve.Slug.resolve({
				slug: networkBySlug.tron.slug,
			}, resolverContext)
		)
	})

	it('embeds the full current network observation and exposes no timestamp replay resolvers', async () => {
		getNowBlock.mockResolvedValueOnce({
			blockID: 'tip-hash',
			block_header: {
				raw_data: {
					number: 124,
					timestamp: 1_720_000_000_000,
				},
			},
			transactions: [{
				txID: 'transaction-id',
			}],
		})
		listWitnesses.mockResolvedValueOnce({
			witnesses: [
				{
					isJobs: true,
				},
				{},
			],
		})
		getChainParameters.mockResolvedValueOnce({
			chainParameter: [
				{
					key: 'getMaintenanceTimeInterval',
					value: 21_600_000,
				},
				{
					key: 'getTransactionFee',
					value: 1_000,
				},
			],
		})
		getNodeInfo.mockResolvedValueOnce({
			block: 'Num:124,ID:tip-hash',
			solidityBlock: 'Num:122,ID:solid-hash',
			currentConnectCount: 8,
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Tron' in candidate.projections
			&& '$$timestamps' in candidate.projections.Tron
		))
		if (resolver == null) throw new Error('Tron network observation resolver is missing')

		const network = {
			caip2: networkBySlug.tron.caip2,
		}
		expect(resolver.projections.Tron.$$timestamps(
			await resolver.resolve.Caip2.resolve(network, resolverContext)
		)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_720_000_000_000,
				source: Source.TronGrid_Rest,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockHeight')]: 124n,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockHash')]: 'tip-hash',
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'latestBlockTransactionCount')]: 1,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'witnessCount')]: 2,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'activeWitnessCount')]: 1,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'nodeBlockHeight')]: 124n,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'solidityBlockHeight')]: 122n,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'currentPeerCount')]: 8,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'maintenanceIntervalMs')]: 21_600_000,
				[entityFieldAddressKey(EntityType.TronNetwork_Timestamp, [], 'transactionFeeSun')]: 1_000n,
			}),
		}])
		expect(tronGridRest.resolvers.some((candidate) => (
			candidate.entityType === EntityType.TronNetwork_Timestamp
			|| candidate.entityType === EntityType.TronAccount_Timestamp
			|| candidate.entityType === EntityType.TronWitness_Timestamp
		))).toBe(false)
	})

	it('rejects a block returned by height when its hash disagrees with the exact selector', async () => {
		getBlockByNumber.mockResolvedValueOnce({
			blockID: 'returned-block-hash',
			block_header: {
				raw_data: {
					number: 123,
					timestamp: 1_720_000_000_000,
				},
			},
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronBlock
		))
		if (resolver == null) throw new Error('Tron block resolver is missing')

		await expect(
			resolver.resolve.NetworkHeightHash.resolve({
				$network: {
					caip2: networkBySlug.tron.caip2,
				},
				height: 123n,
				hash: 'requested-block-hash',
			}, resolverContext)
		).rejects.toThrow('block hash returned-block-hash does not match selector requested-block-hash')

		getBlockByNumber.mockResolvedValueOnce({
			blockID: 'requested-block-hash',
			block_header: {
				raw_data: {
					number: 124,
					timestamp: 1_720_000_000_000,
				},
			},
		})
		await expect(
			resolver.resolve.NetworkHeightHash.resolve({
				$network: {
					caip2: networkBySlug.tron.caip2,
				},
				height: 123n,
				hash: 'requested-block-hash',
			}, resolverContext)
		).rejects.toThrow('block height does not match selector 123')
	})

	it('exposes the exact materialized transaction count for a block', async () => {
		getBlockByNumber.mockResolvedValueOnce({
			blockID: 'block-hash',
			block_header: {
				raw_data: {
					number: 123,
					timestamp: 1_720_000_000_000,
				},
			},
			transactions: [{
				txID: 'transaction-id',
				raw_data: {},
			}],
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronBlock
		))
		if (resolver == null) throw new Error('Tron block resolver is missing')

		const block = await resolver.resolve.NetworkHeightHash.resolve({
			$network: {
				caip2: networkBySlug.tron.caip2,
			},
			height: 123n,
			hash: 'block-hash',
		}, resolverContext)
		expect(resolver.projections.$$transactions.select(block)).toHaveLength(1)
		expect(resolver.projections.$$transactions.resolveCount(block)).toBe(1)
	})

	it('embeds enrolled account tip Fields from account + resource wires', async () => {
		vi.clearAllMocks()
		getAccount.mockResolvedValueOnce({
			account_name: 'tip-account',
			balance: 42,
			create_time: 1_700_000_000_000,
			latest_opration_time: 1_720_000_000_123,
		})
		getAccountResource.mockResolvedValueOnce({
			freeNetUsed: 1,
			freeNetLimit: 600,
			NetUsed: 2,
			NetLimit: 3,
			EnergyUsed: 4,
			EnergyLimit: 5,
		})
		getNowBlock.mockResolvedValueOnce({
			block_header: {
				raw_data: {
					number: 124,
					timestamp: 1_720_000_000_500,
				},
			},
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronAccount
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null) throw new Error('Tron account resolver is missing')

		const account = {
			$network: {
				caip2: networkBySlug.tron.caip2,
			},
			address: 'TExampleAccount',
		}
		const resolved = await resolver.resolve['NetworkAddress'].resolve(account, resolverContext)

		expect(resolver.projections.$$timestamps(resolved)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				timestampMs: 1_720_000_000_500,
				source: Source.TronGrid_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'balanceSun')]: 42n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'createdTimestampMs')]: 1_700_000_000_000,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'latestOperationTimestampMs')]: 1_720_000_000_123,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'freeNetUsed')]: 1n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'freeNetLimit')]: 600n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'netUsed')]: 2n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'netLimit')]: 3n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'energyUsed')]: 4n,
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'energyLimit')]: 5n,
			},
		}])
		expect(getAccount.mock.invocationCallOrder[0]).toBeLessThan(getNowBlock.mock.invocationCallOrder[0])
		expect(getAccountResource.mock.invocationCallOrder[0]).toBeLessThan(getNowBlock.mock.invocationCallOrder[0])
	})

	it('uses the source head clock when account lifecycle timestamps are absent', async () => {
		getAccount.mockResolvedValueOnce({
			balance: 42,
		})
		getAccountResource.mockResolvedValueOnce({})
		getNowBlock.mockResolvedValueOnce({
			block_header: {
				raw_data: {
					number: 124,
					timestamp: 1_720_000_000_500,
				},
			},
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronAccount
			&& '$$timestamps' in candidate.projections
		))
		if (resolver == null) throw new Error('Tron account resolver is missing')

		const account = {
			$network: {
				caip2: networkBySlug.tron.caip2,
			},
			address: 'TExampleAccount',
		}
		const resolved = await resolver.resolve['NetworkAddress'].resolve(account, resolverContext)

		expect(resolver.projections.$$timestamps(resolved)).toEqual([{
			[EntityMetaKey.Selector]: {
				$account: account,
				timestampMs: 1_720_000_000_500,
				source: Source.TronGrid_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronAccount_Timestamp, [], 'balanceSun')]: 42n,
			},
		}])
	})

	it('embeds witness observations through canonical field addresses', async () => {
		getNowBlock.mockResolvedValueOnce({
			block_header: {
				raw_data: {
					number: 124,
					timestamp: 1_720_000_000_000,
				},
			},
		})
		listWitnesses.mockResolvedValueOnce({
			witnesses: [{
				address: 'TExampleWitness',
				isJobs: true,
				latestBlockNum: 123,
				totalMissed: 2,
				totalProduced: 121,
				url: 'https://witness.example',
				voteCount: 42,
			}],
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Tron' in candidate.projections
			&& '$$witnesses' in candidate.projections.Tron
			&& typeof candidate.projections.Tron.$$witnesses === 'function'
		))
		if (resolver == null) throw new Error('Tron witness resolver is missing')

		const networkSelector = {
			caip2: networkBySlug.tron.caip2,
		}
		const witnesses = resolver.projections.Tron.$$witnesses(
			await resolver.resolve['Caip2'].resolve(networkSelector, resolverContext)
		)

		expect(witnesses).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: networkSelector,
				address: 'TExampleWitness',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.TronWitness, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$witness: {
							$network: networkSelector,
							address: 'TExampleWitness',
						},
						timestampMs: 1_720_000_000_000,
						source: Source.TronGrid_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'url')]: 'https://witness.example',
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'voteCount')]: 42n,
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'totalProduced')]: 121n,
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'totalMissed')]: 2n,
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'latestBlockHeight')]: 123n,
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'latestSlotNumber')]: 123n,
						[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'active')]: true,
					},
				}],
			},
		}])
	})

	it('paginates witness and block collections without repeating the first page', async () => {
		listWitnesses.mockResolvedValueOnce({
			witnesses: [
				{
					address: 'TWitness0',
				},
				{
					address: 'TWitness1',
				},
				{
					address: 'TWitness2',
				},
			],
		})
		getNowBlock.mockResolvedValue({
			blockID: 'head-hash',
			block_header: {
				raw_data: {
					number: 10,
					timestamp: 1_720_000_000_000,
				},
			},
		})

		const networkWitnessesResolver = tronGridRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Tron' in resolver.projections
			&& '$$witnesses' in resolver.projections.Tron
		))
		const networkBlocksResolver = tronGridRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Tron' in resolver.projections
			&& '$$blocks' in resolver.projections.Tron
		))
		if (networkWitnessesResolver == null || networkBlocksResolver == null)
			throw new Error('TronGrid collection resolver is missing')

		const network = {
			slug: networkBySlug.tron.slug,
		}
		const paginationContext = {
			...resolverContext,
			pagination: {
				limit: 1,
				offset: 1,
			},
		}
		expect(
			networkWitnessesResolver.projections.Tron.$$witnesses(
				await networkWitnessesResolver.resolve.Slug.resolve(network, paginationContext)
			)
				.map((witness) => witness[EntityMetaKey.Selector])
		).toEqual([{
			$network: network,
			address: 'TWitness1',
		}])
		const blockSnapshot = await networkBlocksResolver.resolve.Slug.resolve(network, paginationContext)
		expect(networkBlocksResolver.projections.Tron.$$blocks.select(blockSnapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				height: 9n,
			},
		}])
		expect(networkBlocksResolver.projections.Tron.$$blocks.continuation(blockSnapshot).token).toBe('8')

		getNowBlock.mockResolvedValueOnce({
			blockID: 'new-head-hash',
			block_header: {
				raw_data: {
					number: 12,
					timestamp: 1_720_000_001_000,
				},
			},
		})
		const continuedBlocks = await networkBlocksResolver.resolve.Slug.resolve(network, {
			...resolverContext,
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '8',
		})
		expect(networkBlocksResolver.projections.Tron.$$blocks.select(continuedBlocks)[0][EntityMetaKey.Selector]).toEqual({
			$network: network,
			height: 8n,
		})
		expect(networkBlocksResolver.projections.Tron.$$blocks.continuation(continuedBlocks)).toEqual({
			operation: 'network-blocks',
			terminal: false,
			token: '7',
		})
	})

	it('embeds individual witness state at the source head without direct timestamp replay', async () => {
		const witnessResolver = tronGridRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.TronWitness
		))
		if (witnessResolver == null)
			throw new Error('Tron witness resolver is missing')

		const network = {
			caip2: networkBySlug.tron.caip2,
		}
		const witness = {
			$network: network,
			address: 'TWitness',
		}
		getNowBlock.mockResolvedValue({
			block_header: {
				raw_data: {
					number: 100,
					timestamp: 1_720_000_000_000,
				},
			},
		})
		listWitnesses.mockResolvedValue({
			witnesses: [{
				address: witness.address,
				latestBlockNum: 99,
				voteCount: 42,
			}],
		})

		expect(await witnessResolver.resolve.NetworkAddress.resolve(witness, resolverContext)).toEqual({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$witness: witness,
					timestampMs: 1_720_000_000_000,
					source: Source.TronGrid_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'voteCount')]: 42n,
					[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'latestBlockHeight')]: 99n,
					[entityFieldAddressKey(EntityType.TronWitness_Timestamp, [], 'latestSlotNumber')]: 99n,
				},
			}],
		})
		expect(tronGridRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.TronWitness_Timestamp
		))).toBe(false)

		listWitnesses.mockResolvedValueOnce({
			witnesses: [{
				address: witness.address,
				latestBlockNum: 101,
			}],
		})
		await expect(witnessResolver.resolve.NetworkAddress.resolve(witness, resolverContext))
			.rejects.toThrow('witness latest block exceeds observed head')
	})

	it('projects enrolled Fields on account $$transactions from v1 list wire', async () => {
		getAccountTransactions.mockResolvedValueOnce({
			data: [{
				txID: 'tx-id',
				blockNumber: 77,
				block_timestamp: 1_720_000_000_000,
				ret: [{
					contractRet: 'SUCCESS',
					fee: 3,
				}],
				raw_data: {
					timestamp: 1_720_000_000_000,
					expiration: 1_720_000_060_000,
					contract: [{
						type: 'TransferContract',
						parameter: {
							value: {
								amount: 42,
								owner_address: 'Towner',
								to_address: 'Tto',
							},
						},
					}],
				},
				raw_data_hex: '0xabc',
				signature: ['0xsig'],
			}],
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronAccount
			&& '$$transactions' in candidate.projections
		))
		if (resolver == null) throw new Error('Tron account transactions resolver is missing')

		const account = {
			$network: {
				caip2: networkBySlug.tron.caip2,
			},
			address: 'TExampleAccount',
		}
		const transactions = resolver.projections.$$transactions(
			await resolver.resolve['NetworkAddress'].resolve(account, {
				...resolverContext,
				pagination: {
					limit: 2,
				},
			})
		)

		expect(transactions).toHaveLength(1)
		expect(transactions[0][EntityMetaKey.Selector]).toEqual({
			$network: account.$network,
			transactionId: 'tx-id',
		})
		expect(transactions[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'blockHeight')]: 77n,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'timestampMs')]: 1_720_000_000_000,
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'contractType')]: 'TransferContract',
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'result')]: 'SUCCESS',
			[entityFieldAddressKey(EntityType.TronTransaction, [], 'amountSun')]: 42n,
		})
	})

	it('projects enrolled receipt leftovers from transaction info', async () => {
		getTransactionInfoById.mockResolvedValueOnce({
			id: 'tx-id',
			fee: 9,
			contract_address: 'Tcontract',
			resMessage: 'DEADBEEF',
			contractResult: ['00'],
			log: [{
				address: 'Tcontract',
			}],
			internal_transactions: [{
				caller_address: 'Towner',
			}],
			receipt: {
				result: 'SUCCESS',
				energy_usage: 10,
				origin_energy_usage: 2,
				energy_usage_total: 12,
				energy_fee: 3,
				energy_penalty_total: 1,
				net_usage: 200,
				net_fee: 4,
			},
		})

		const resolver = tronGridRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TronTransactionReceipt
		))
		if (resolver == null) throw new Error('Tron transaction receipt resolver is missing')

		const receipt = await resolver.resolve['Transaction'].resolve({
			$transaction: {
				$network: {
					caip2: networkBySlug.tron.caip2,
				},
				transactionId: 'tx-id',
			},
		}, resolverContext)

		expect(resolver.projections.contractAddress(receipt)).toBe('Tcontract')
		expect(resolver.projections.resMessageHex(receipt)).toBe('DEADBEEF')
		expect(resolver.projections.energyUsage(receipt)).toBe(10n)
		expect(resolver.projections.originEnergyUsage(receipt)).toBe(2n)
		expect(resolver.projections.energyUsageTotal(receipt)).toBe(12n)
		expect(resolver.projections.energyFeeSun(receipt)).toBe(3n)
		expect(resolver.projections.energyPenaltyTotal(receipt)).toBe(1n)
		expect(resolver.projections.netUsage(receipt)).toBe(200n)
		expect(resolver.projections.netFeeSun(receipt)).toBe(4n)
		expect(resolver.projections.logCount(receipt)).toBe(1)
		expect(resolver.projections.internalTransactionCount(receipt)).toBe(1)
	})
})
