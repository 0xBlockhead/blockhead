import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getTxpoolStatus = vi.hoisted(() => vi.fn())
const getPeerCountObservation = vi.hoisted(() => vi.fn())
const getSecondPeerCountObservation = vi.hoisted(() => vi.fn())
const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionReceipt = vi.hoisted(() => vi.fn())
const debugTraceTransaction = vi.hoisted(() => vi.fn())
const getCall = vi.hoisted(() => vi.fn())
const getBalance = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			1: [{
				diagnosticLabel: 'test mainnet execution endpoint',
				getTransactionByHash,
				getTransactionReceipt,
				debugTraceTransaction,
				getCall,
				getBalance,
			}],
			10: [
				{
					diagnosticLabel: 'test execution endpoint',
					origin: 'https://optimism.example',
					getPeerCountObservation,
				},
				{
					diagnosticLabel: 'second test execution endpoint',
					origin: 'https://optimism-2.example',
					getPeerCountObservation: getSecondPeerCountObservation,
				},
			],
		},
		txpoolTransportsByChainId: {
			10: [{
				diagnosticLabel: 'test transport',
				getTxpoolStatus,
			}],
		},
	},
}))

const { default: voltaireJsonRpc } = await import('$/resolvers/Voltaire-JsonRpc.ts')

describe('Voltaire ERC-20 allowance blocks', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reads the exact ERC-20 allowance at the selected immutable block', async () => {
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmActorCoinAllowance_Block
		))
		if (resolver == null)
			throw new Error('Voltaire allowance block resolver is not registered')

		const owner = '0x1111111111111111111111111111111111111111'
		const token = '0x2222222222222222222222222222222222222222'
		const spender = '0x3333333333333333333333333333333333333333'
		getCall.mockResolvedValue(`0x${'0'.repeat(62)}2a`)
		const selector = {
			$allowance: {
				$actor: {
					address: owner,
				},
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					address: token,
				},
				$spender: {
					address: spender,
				},
				interopAddress: owner,
			},
			blockNumber: 1_234n,
			source: Source.Voltaire_JsonRpc,
		}

		const snapshot = await resolver.resolve.AllowanceBlockNumberSource.resolve(selector)
		expect(getCall).toHaveBeenCalledWith({
			to: token,
			input: `0xdd62ed3e${owner.slice(2).padStart(64, '0')}${spender.slice(2).padStart(64, '0')}`,
			blockTag: '0x4d2',
		})
		expect(resolver.projections.$allowance(snapshot)).toEqual({
			[EntityMetaKey.Selector]: selector.$allowance,
		})
		expect(resolver.projections.blockNumber(snapshot)).toBe(1_234n)
		expect(resolver.projections.source(snapshot)).toBe(Source.Voltaire_JsonRpc)
		expect(resolver.projections.allowance(snapshot)).toBe(42n)
	})

	it('rejects unsupported provenance and unusable ERC-20 responses', async () => {
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmActorCoinAllowance_Block
		))
		if (resolver == null)
			throw new Error('Voltaire allowance block resolver is not registered')

		const selector = {
			$allowance: {
				$actor: {
					address: '0x1111111111111111111111111111111111111111',
				},
				$contract: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					address: '0x2222222222222222222222222222222222222222',
				},
				$spender: {
					address: '0x3333333333333333333333333333333333333333',
				},
				interopAddress: '0x1111111111111111111111111111111111111111',
			},
			blockNumber: 1n,
			source: Source.Voltaire_JsonRpc,
		}
		await expect(resolver.resolve.AllowanceBlockNumberSource.resolve({
			...selector,
			source: Source.Allium_Rest,
		})).rejects.toThrow('unsupported allowance block source')
		expect(getCall).not.toHaveBeenCalled()

		getCall.mockResolvedValue('0x')
		await expect(resolver.resolve.AllowanceBlockNumberSource.resolve(selector)).rejects.toThrow('ERC-20 allowance call returned empty data')
	})
})

describe('Voltaire exact EVM coin balances', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('reads native and ERC-20 balances from the selected block instead of a current portfolio aggregate', async () => {
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkActorCoinBalance_EvmBlock
		))
		if (resolver == null)
			throw new Error('Voltaire actor coin block resolver is not registered')

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}
		const actor = {
			address: '0x1111111111111111111111111111111111111111',
		}
		const block = {
			$network: network,
			blockNumber: 1_234n,
		}
		getBalance.mockResolvedValue('0x2a')
		const native = await resolver.resolve.EvmNetworkActorCoinBalanceEvmBlock.resolve({
			$actorCoin: {
				$actor: actor,
				$network: network,
				symbol: 'ETH',
				decimals: 18,
			},
			$block: block,
		})
		expect(getBalance).toHaveBeenCalledWith({
			address: actor.address,
			blockTag: '0x4d2',
		})
		expect(resolver.projections.balance(native)).toBe(42n)

		const token = '0x2222222222222222222222222222222222222222'
		getCall.mockResolvedValue(`0x${'0'.repeat(62)}2a`)
		const erc20 = await resolver.resolve.EvmNetworkActorCoinBalanceEvmBlock.resolve({
			$actorCoin: {
				$actor: actor,
				$network: network,
				$contract: {
					$network: network,
					address: token,
				},
				symbol: 'USDC',
				decimals: 6,
			},
			$block: block,
		})
		expect(getCall).toHaveBeenCalledWith({
			to: token,
			input: `0x70a08231${actor.address.slice(2).padStart(64, '0')}`,
			blockTag: '0x4d2',
		})
		expect(resolver.projections.balance(erc20)).toBe(42n)
	})
})

describe('Voltaire txpool observation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes a current txpool observation without arbitrary timestamp resolution', async () => {
		getTxpoolStatus.mockResolvedValue({
			pending: '0x10',
			queued: '0x2',
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& candidate.projections.Evm?.$$txpoolTimestamps != null
		))
		if (resolver == null)
			throw new Error('Voltaire txpool observation resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		})).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					source: Source.Voltaire_JsonRpc,
				},
			},
		])
		expect(voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetwork_Txpool_Timestamp
		))).toBeUndefined()
	})
})

describe('Voltaire endpoint observation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes the current execution endpoint snapshot from Network', async () => {
		getPeerCountObservation.mockResolvedValue({
			peerCount: 17,
			fetchedAtMs: 1_785_477_600_123,
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire endpoint observation resolver is not registered')

		const observation = await resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(resolver.projections.$$endpointObservations(observation)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '10',
					},
				},
				endpointUrl: 'https://optimism.example',
				endpointKind: 'EvmExecutionJsonRpc',
				timestampMs: 1_785_477_600_123,
				source: Source.Voltaire_JsonRpc,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Execution'], 'peerCount')]: 17n,
			},
		}])
		expect(voltaireJsonRpc.resolvers.some((candidate) => (
			candidate.entityType === EntityType.NetworkEndpointObservation_Timestamp
		))).toBe(false)
	})

	it('paginates configured execution endpoint observations without treating exhaustion as missing configuration', async () => {
		getSecondPeerCountObservation.mockResolvedValue({
			peerCount: 9,
			fetchedAtMs: 1_785_477_600_124,
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire endpoint observation resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
				offset: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					endpointUrl: 'https://optimism-2.example',
				},
			},
		])
		expect(getPeerCountObservation).not.toHaveBeenCalled()

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
				offset: 2,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).resolves.toEqual([])
	})

	it('rejects the field when every execution endpoint fails', async () => {
		getPeerCountObservation.mockRejectedValue(new Error('peer count unavailable'))
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire endpoint observation resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve({
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).rejects.toThrow('all JSON-RPC endpoints failed for Network.$$endpointObservations')
	})
})

describe('Voltaire transaction execution hierarchy', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes receipt logs and nested call traces from the parent transaction read', async () => {
		const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		const from = '0x1111111111111111111111111111111111111111'
		const to = '0x2222222222222222222222222222222222222222'
		const logTopic = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
		getTransactionByHash.mockResolvedValue({
			hash: txHash,
			blockNumber: '0x10',
			from,
			to,
			type: '0x2',
			transactionIndex: '0x0',
			value: '0x1',
			nonce: '0x2',
			input: '0x1234',
			r: '0x01',
			s: '0x02',
			gas: '0x5208',
			gasPrice: '0x3b9aca00',
			maxFeePerGas: '0x77359400',
			maxPriorityFeePerGas: '0x3b9aca00',
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x3b9aca00',
			logs: [{
				address: to,
				blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
				blockNumber: '0x10',
				data: '0xdeadbeef',
				logIndex: '0x0',
				removed: false,
				topics: [logTopic],
			}],
		})
		debugTraceTransaction.mockResolvedValue({
			type: 'CALL',
			from,
			to,
			value: '0x1',
			gas: '0x5208',
			gasUsed: '0x5000',
			input: '0x1234',
			output: '0x',
			calls: [{
				type: 'DELEGATECALL',
				from: to,
				to: from,
				gas: '0x4000',
				gasUsed: '0x3000',
				input: '0xabcd',
				output: '0x',
			}],
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
		))
		if (resolver == null)
			throw new Error('Voltaire transaction resolver is not registered')

		const transaction = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			txHash,
		})
		const logs = resolver.projections.$$logs.select(transaction)
		const traces = resolver.projections.$$traces.select(transaction)

		expect(logs).toMatchObject([{
			[EntityMetaKey.Selector]: {
				indexInTransaction: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmLog, [], 'data')]: '0xdeadbeef',
				[entityFieldAddressKey(EntityType.EvmLog, [], 'topic0')]: logTopic,
				[entityFieldAddressKey(EntityType.EvmLog, [], '$emitter')]: {
					[EntityMetaKey.Selector]: {
						address: to,
					},
				},
			},
		}])
		expect(traces).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					traceAddress: 'root',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTrace, [], 'index')]: 0,
					[entityFieldAddressKey(EntityType.EvmTrace, [], 'type')]: 'Call',
					[entityFieldAddressKey(EntityType.EvmTrace, [], 'input')]: '0x1234',
					[entityFieldAddressKey(EntityType.EvmTrace, [], '$$children')]: [{
						[EntityMetaKey.Selector]: {
							traceAddress: '0',
						},
					}],
				},
			},
			{
				[EntityMetaKey.Selector]: {
					traceAddress: '0',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTrace, [], 'index')]: 0,
					[entityFieldAddressKey(EntityType.EvmTrace, [], 'type')]: 'DelegateCall',
					[entityFieldAddressKey(EntityType.EvmTrace, [], 'input')]: '0xabcd',
				},
			},
		])
		expect(getTransactionReceipt).toHaveBeenCalledTimes(1)
		expect(debugTraceTransaction).toHaveBeenCalledTimes(1)
	})
})
