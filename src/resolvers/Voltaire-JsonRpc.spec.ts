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
const getBlockByNumber = vi.hoisted(() => vi.fn())
const getBlockNumber = vi.hoisted(() => vi.fn())
const getStorageAt = vi.hoisted(() => vi.fn())
const resolveEnsForward = vi.hoisted(() => vi.fn())

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
				getBlockByNumber,
				getBlockNumber,
				getStorageAt,
				resolveEnsForward,
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

	it('attaches the current immutable block observation to the allowance owner', async () => {
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmActorCoinAllowance
		))
		if (resolver == null)
			throw new Error('Voltaire allowance resolver is not registered')

		getBlockNumber.mockResolvedValue(1_234n)
		const selector = {
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
			interopAddress: 'eip155:1:0x1111111111111111111111111111111111111111',
		}
		const snapshot = await resolver.resolve.EvmAccountEvmContractSpenderInteropAddress.resolve(selector)

		expect(resolver.projections.$$blocks(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$allowance: selector,
				blockNumber: 1_234n,
				source: Source.Voltaire_JsonRpc,
			},
		}])
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

	it('attaches current immutable block observations to native and ERC-20 balance owners', async () => {
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmNetworkActorCoinBalance
		))
		if (resolver == null)
			throw new Error('Voltaire actor coin owner resolver is not registered')

		getBlockNumber.mockResolvedValue(1_234n)
		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}
		const actor = {
			address: '0x1111111111111111111111111111111111111111',
		}
		const native = await resolver.resolve.EvmAccountNativeCoinInstance.resolve({
			$actor: actor,
			$network: network,
		})
		expect(resolver.projections.$$blocks(native)).toEqual([{
			[EntityMetaKey.Selector]: {
				$actorCoin: {
					$actor: actor,
					$network: network,
				},
				$block: {
					$network: network,
					blockNumber: 1_234n,
				},
			},
		}])

		const contract = {
			$network: network,
			address: '0x2222222222222222222222222222222222222222',
		}
		const erc20 = await resolver.resolve.EvmAccountErc20CoinInstance.resolve({
			$actor: actor,
			$contract: contract,
		})
		expect(resolver.projections.$$blocks(erc20)[0]).toEqual({
			[EntityMetaKey.Selector]: {
				$actorCoin: {
					$actor: actor,
					$network: network,
					$contract: contract,
				},
				$block: {
					$network: network,
					blockNumber: 1_234n,
				},
			},
		})
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
				value: '0x2',
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
		const internalTransfers = resolver.projections.$$internalTransfers.select(transaction)

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
		expect(resolver.projections.$$internalTransfers.resolveCount(transaction)).toBe(1)
		expect(internalTransfers).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					txHash,
				},
				indexInTransaction: 1,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'value')]: 2n,
				[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'callType')]: 'DelegateCall',
				[entityFieldAddressKey(EntityType.EvmInternalTransfer, [], 'success')]: true,
			}),
		}])

		const internalTransferResolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmInternalTransfer
		))
		if (internalTransferResolver == null)
			throw new Error('Voltaire internal transfer resolver is not registered')
		debugTraceTransaction.mockClear()
		const internalTransfer = await internalTransferResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash,
			},
			indexInTransaction: 1,
		})
		expect(internalTransferResolver.projections.value(internalTransfer)).toBe(2n)
		expect(internalTransferResolver.projections.callType(internalTransfer)).toBe('DelegateCall')
		expect(internalTransferResolver.projections.success(internalTransfer)).toBe(true)
		expect(debugTraceTransaction).toHaveBeenCalledOnce()
		expect(getTransactionReceipt).toHaveBeenCalledTimes(1)

		const traceResolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTrace
		))
		if (traceResolver == null)
			throw new Error('Voltaire trace resolver is not registered')
		debugTraceTransaction.mockClear()
		const childTrace = await traceResolver.resolve.TransactionTraceAddress.resolve({
			$transaction: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: '1',
					},
				},
				txHash,
			},
			traceAddress: '0',
		})
		expect(traceResolver.projections.traceAddress(childTrace)).toBe('0')
		expect(traceResolver.projections.type(childTrace)).toBe('DelegateCall')
		expect(traceResolver.projections.input(childTrace)).toBe('0xabcd')
		expect(traceResolver.projections.$$children.select(childTrace)).toEqual([])
		expect(traceResolver.projections.$$children.resolveCount(childTrace)).toBe(0)
		expect(debugTraceTransaction).toHaveBeenCalledOnce()
	})

	it('materializes SetCode authorizations and resolves the native child from its transaction index', async () => {
		const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		const from = '0x1111111111111111111111111111111111111111'
		const delegationAddress = '0x2222222222222222222222222222222222222222'
		getTransactionByHash.mockResolvedValue({
			hash: txHash,
			blockNumber: '0x10',
			from,
			to: delegationAddress,
			type: '0x4',
			transactionIndex: '0x0',
			value: '0x0',
			nonce: '0x2',
			input: '0x',
			r: '0x01',
			s: '0x02',
			gas: '0x5208',
			maxFeePerGas: '0x77359400',
			maxPriorityFeePerGas: '0x3b9aca00',
			authorizationList: [{
				chainId: '0x1',
				address: delegationAddress,
				nonce: '0x7',
				yParity: '0x1',
				r: '0x03',
				s: '0x04',
			}],
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x3b9aca00',
			logs: [],
		})
		debugTraceTransaction.mockResolvedValue(undefined)

		const transactionResolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& 'SetCode' in candidate.projections
			&& '$$authorizations' in candidate.projections.SetCode
		))
		const authorizationResolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Eip7702Authorization
		))
		if (transactionResolver == null || authorizationResolver == null)
			throw new Error('Voltaire EIP-7702 hierarchy is not registered')

		const selector = {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			txHash,
		}
		const transaction = await transactionResolver.resolve.EvmNetworkTxHash.resolve(selector)
		const authorizations = transactionResolver.projections.SetCode.$$authorizations.select(transaction)
		expect(transactionResolver.projections.SetCode.$$authorizations.resolveCount(transaction)).toBe(1)
		expect(authorizations).toEqual([{
			[EntityMetaKey.Selector]: {
				$transaction: selector,
				authorizationIndex: 0,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'chainId')]: 1n,
				[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'delegationAddress')]: delegationAddress,
				[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'nonce')]: 7n,
				[entityFieldAddressKey(EntityType.Eip7702Authorization, [], 'yParity')]: 1,
				[entityFieldAddressKey(EntityType.Eip7702Authorization, [], '$delegationContract')]: {
					[EntityMetaKey.Selector]: {
						$network: selector.$network,
						address: delegationAddress,
					},
				},
			}),
		}])

		getTransactionByHash.mockClear()
		const authorization = await authorizationResolver.resolve.TransactionAuthorizationIndex.resolve({
			$transaction: selector,
			authorizationIndex: 0,
		})
		expect(authorizationResolver.projections.chainId(authorization)).toBe(1n)
		expect(authorizationResolver.projections.delegationAddress(authorization)).toBe(delegationAddress)
		expect(authorizationResolver.projections.nonce(authorization)).toBe(7n)
		expect(authorizationResolver.projections.$delegationContract(authorization)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: selector.$network,
				address: delegationAddress,
			},
		})
		expect(getTransactionByHash).toHaveBeenCalledOnce()
		expect(getTransactionReceipt).toHaveBeenCalledOnce()
		expect(debugTraceTransaction).toHaveBeenCalledOnce()
	})

	it('fails closed on malformed SetCode authorization identity and signature fields', async () => {
		const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		getTransactionByHash.mockResolvedValue({
			hash: txHash,
			blockNumber: '0x10',
			from: '0x1111111111111111111111111111111111111111',
			to: '0x2222222222222222222222222222222222222222',
			type: '0x4',
			transactionIndex: '0x0',
			value: '0x0',
			nonce: '0x2',
			input: '0x',
			r: '0x01',
			s: '0x02',
			gas: '0x5208',
			authorizationList: [{
				chainId: '0x1',
				address: 'not-an-address',
				nonce: '0x7',
				yParity: '0x2',
				r: '0x03',
				s: '0x04',
			}],
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x3b9aca00',
			logs: [],
		})
		debugTraceTransaction.mockResolvedValue(undefined)
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& 'SetCode' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire SetCode transaction resolver is not registered')

		await expect(resolver.resolve.EvmNetworkTxHash.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			},
			txHash,
		})).rejects.toThrow('invalid EIP-7702 authorization at index 0')
	})

	it('materializes exact ERC-20, ERC-721, and ERC-1155 TransferSingle logs without inferring other standards', async () => {
		const txHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		const from = '0x1111111111111111111111111111111111111111'
		const to = '0x2222222222222222222222222222222222222222'
		const token = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		const nft = '0xb0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		const erc1155 = '0xc0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		const paddedFrom = `0x${'0'.repeat(24)}${from.slice(2)}`
		const paddedTo = `0x${'0'.repeat(24)}${to.slice(2)}`
		const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
		const transferSingleTopic = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'
		const operator = `0x${'0'.repeat(24)}${'3'.repeat(40)}`
		getTransactionByHash.mockResolvedValue({
			hash: txHash,
			blockNumber: '0x10',
			from,
			to,
			type: '0x2',
			transactionIndex: '0x0',
			value: '0x0',
			nonce: '0x2',
			input: '0xa9059cbb',
			r: '0x01',
			s: '0x02',
			gas: '0x5208',
			gasPrice: '0x3b9aca00',
			maxFeePerGas: '0x3b9aca00',
			maxPriorityFeePerGas: '0x3b9aca00',
		})
		getTransactionReceipt.mockResolvedValue({
			status: '0x1',
			gasUsed: '0x5208',
			cumulativeGasUsed: '0x5208',
			effectiveGasPrice: '0x3b9aca00',
			logs: [
				{
					address: token,
					logIndex: '0x0',
					blockNumber: '0x10',
					blockHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
					topics: [
						transferTopic,
						paddedFrom,
						paddedTo,
					],
					data: `0x${'0'.repeat(63)}a`,
				},
				{
					address: nft,
					logIndex: '0x1',
					blockNumber: '0x10',
					blockHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
					topics: [
						transferTopic,
						paddedFrom,
						paddedTo,
						`0x${'0'.repeat(63)}7`,
					],
					data: '0x',
				},
				{
					address: erc1155,
					logIndex: '0x2',
					blockNumber: '0x10',
					blockHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
					topics: [
						transferSingleTopic,
						operator,
						paddedFrom,
						paddedTo,
					],
					data: `0x${'0'.repeat(63)}3${'0'.repeat(63)}5`,
				},
				{
					address: token,
					logIndex: '0x3',
					blockNumber: '0x10',
					blockHash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
					topics: [
						transferTopic,
						paddedFrom,
						paddedTo,
					],
					data: '0x',
				},
			],
		})
		debugTraceTransaction.mockResolvedValue(undefined)
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTransaction
			&& '$$tokenTransfers' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Voltaire token transfer transaction resolver is not registered')

		const network = {
			caip2: {
				namespace: 'eip155',
				reference: '1',
			},
		}
		const transaction = await resolver.resolve.EvmNetworkTxHash.resolve({
			$network: network,
			txHash,
		})
		const transfers = resolver.projections.$$tokenTransfers.select(transaction)
		expect(resolver.projections.$$tokenTransfers.resolveCount(transaction)).toBe(3)
		expect(transfers).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$log: {
						$transaction: {
							txHash,
						},
						indexInTransaction: 0,
					},
					indexInLog: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: 'ERC-20',
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: 10n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					indexInLog: 0,
					$log: {
						indexInTransaction: 1,
					},
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: 'ERC-721',
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: 1n,
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')]: 7n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					indexInLog: 0,
					$log: {
						indexInTransaction: 2,
					},
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: 'ERC-1155',
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: 5n,
					[entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')]: 3n,
				},
			},
		])

		const transferResolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmTokenTransfer
		))
		const logResolver = voltaireJsonRpc.resolvers.find((candidate) => (
			candidate.entityType === EntityType.EvmLog
		))
		if (transferResolver == null || logResolver == null)
			throw new Error('Voltaire log token-transfer hierarchy is not registered')

		const erc20 = await transferResolver.resolve.LogIndexInLog.resolve({
			$log: {
				$transaction: {
					$network: network,
					txHash,
				},
				indexInTransaction: 0,
			},
			indexInLog: 0,
		})
		expect(transferResolver.projections.standard(erc20)).toBe('ERC-20')
		expect(transferResolver.projections.amount(erc20)).toBe(10n)

		const log = await logResolver.resolve.TransactionIndexInTransaction.resolve({
			$transaction: {
				$network: network,
				txHash,
			},
			indexInTransaction: 1,
		})
		expect(logResolver.projections.$$topics.select(log)).toHaveLength(4)
		expect(logResolver.projections.$$topics.resolveCount(log)).toBe(4)
		expect(logResolver.projections.Event.TokenTransfer.$$tokenTransfers(log)).toMatchObject([{
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: 'ERC-721',
			},
		}])

		await expect(transferResolver.resolve.LogIndexInLog.resolve({
			$log: {
				$transaction: {
					$network: network,
					txHash,
				},
				indexInTransaction: 3,
			},
			indexInLog: 0,
		})).rejects.toThrow('receipt log is not an exact token transfer')
	})
})

describe('Voltaire EVM storage read observations', () => {
	const storageContext = {
		filters: [],
		sorts: [],
		pagination: {
			limit: 2,
		},
		selectorKeys: [],
		parentSelectorKeys: [],
		sources: [],
		publicEnv: {},
	}
	const network = {
		caip2: {
			namespace: 'eip155',
			reference: '1',
		},
	} as const
	const address = '0x1111111111111111111111111111111111111111'
	const $contract = {
		$network: network,
		address,
	}
	const tipTimestampMs = 0x65a4b665 * 1_000
	const slot0 = `0x${'0'.repeat(64)}`
	const slot1 = `0x${'0'.repeat(63)}1`
	const storageValue = `0x${'ab'.repeat(32)}`
	const listResolver = voltaireJsonRpc.resolvers.find((candidate) => (
		candidate.entityType === EntityType.EvmContract
		&& '$$storageReads' in candidate.projections
	))

	beforeEach(() => {
		vi.clearAllMocks()
		getBlockNumber.mockResolvedValue(0x159a91n)
		getBlockByNumber.mockResolvedValue({
			timestamp: '0x65a4b665',
		})
		getStorageAt.mockResolvedValue(storageValue)
	})

	it('lists sequential slot observations against the tip block clock', async () => {
		if (
			listResolver == null
			|| !('EvmNetworkAddress' in listResolver.resolve)
		)
			throw new Error('Voltaire_JsonRpc: missing EvmContract $$storageReads resolver')

		const reads = await listResolver.resolve.EvmNetworkAddress.resolve({
			$network: network,
			address,
		}, storageContext)
		expect(getStorageAt).toHaveBeenNthCalledWith(1, {
			address,
			slotQuantityHex: slot0,
			blockTag: '0x159a91',
		})
		expect(getStorageAt).toHaveBeenNthCalledWith(2, {
			address,
			slotQuantityHex: slot1,
			blockTag: '0x159a91',
		})
		expect(listResolver.projections.$$storageReads(reads)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$contract,
					slot: slot0,
					timestampMs: tipTimestampMs,
					source: Source.Voltaire_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'value')]: storageValue,
					[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'blockNumber')]: 0x159a91n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$contract,
					slot: slot1,
					timestampMs: tipTimestampMs,
					source: Source.Voltaire_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'value')]: storageValue,
					[entityFieldAddressKey(EntityType.EvmStorageRead_Timestamp, [], 'blockNumber')]: 0x159a91n,
				},
			},
		])
	})
})

describe('Voltaire ENS records', () => {
	const ensNameResolver = voltaireJsonRpc.resolvers.find((candidate) => (
		candidate.entityType === EntityType.EnsName
	))
	const ensRecordResolver = voltaireJsonRpc.resolvers.find((candidate) => (
		candidate.entityType === EntityType.EnsRecord
	))

	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
	})

	it('maps live text, coin, and contenthash onto EnsName.$$records', async () => {
		if (ensNameResolver == null)
			throw new Error('Voltaire EnsName resolver is not registered')

		resolveEnsForward.mockResolvedValueOnce({
			contentHash: '0xe30101701220content',
			textRecords: {
				url: 'https://vitalik.ca',
				avatar: '',
			},
			coinAddresses: {
				'60': '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				'0': '0x',
			},
		})
		const snapshot = await ensNameResolver.resolve.NormalizedName.resolve({
			name: 'vitalik.eth',
		})

		expect(resolveEnsForward).toHaveBeenCalledWith({
			name: 'vitalik.eth',
		})
		expect(ensNameResolver.projections.name(snapshot)).toBe('vitalik.eth')
		expect(ensNameResolver.projections.normalizedName(snapshot)).toBe('vitalik.eth')
		expect(ensNameResolver.projections.$$records.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$name: {
						name: 'vitalik.eth',
					},
					recordKey: 'text:url',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord, [], '$name')]: {
						[EntityMetaKey.Selector]: {
							name: 'vitalik.eth',
						},
					},
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKey')]: 'text:url',
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: 'text',
					[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$record: {
								$name: {
									name: 'vitalik.eth',
								},
								recordKey: 'text:url',
							},
							timestampMs: 1_800_000_000_000,
							source: Source.Voltaire_JsonRpc,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: 'https://vitalik.ca',
						},
					}],
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$name: {
						name: 'vitalik.eth',
					},
					recordKey: 'coin:60',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord, [], '$name')]: {
						[EntityMetaKey.Selector]: {
							name: 'vitalik.eth',
						},
					},
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKey')]: 'coin:60',
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: 'coin',
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'coinType')]: 60,
					[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$record: {
								$name: {
									name: 'vitalik.eth',
								},
								recordKey: 'coin:60',
							},
							timestampMs: 1_800_000_000_000,
							source: Source.Voltaire_JsonRpc,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
						},
					}],
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$name: {
						name: 'vitalik.eth',
					},
					recordKey: 'contenthash',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord, [], '$name')]: {
						[EntityMetaKey.Selector]: {
							name: 'vitalik.eth',
						},
					},
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKey')]: 'contenthash',
					[entityFieldAddressKey(EntityType.EnsRecord, [], 'recordKind')]: 'contenthash',
					[entityFieldAddressKey(EntityType.EnsRecord, [], '$$timestamps')]: [{
						[EntityMetaKey.Selector]: {
							$record: {
								$name: {
									name: 'vitalik.eth',
								},
								recordKey: 'contenthash',
							},
							timestampMs: 1_800_000_000_000,
							source: Source.Voltaire_JsonRpc,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xe30101701220content',
						},
					}],
				},
			},
		])
		expect(ensNameResolver.projections.$$records.resolveCount(snapshot)).toBe(3)
	})

	it('omits EnsName.$$records rows when live text, coin, or contenthash values are zero or empty', async () => {
		if (ensNameResolver == null)
			throw new Error('Voltaire EnsName resolver is not registered')

		resolveEnsForward.mockResolvedValueOnce({
			contentHash: null,
			textRecords: {
				url: '',
			},
			coinAddresses: {
				'60': null,
			},
		})
		const emptySnapshot = await ensNameResolver.resolve.NormalizedName.resolve({
			name: 'vitalik.eth',
		})
		expect(ensNameResolver.projections.$$records.select(emptySnapshot)).toEqual([])
		expect(ensNameResolver.projections.$$records.resolveCount(emptySnapshot)).toBe(0)

		resolveEnsForward.mockResolvedValueOnce({
			contentHash: '0x',
			textRecords: {
				url: '0x',
			},
			coinAddresses: {
				'60': '0x',
			},
		})
		const zeroSnapshot = await ensNameResolver.resolve.NormalizedName.resolve({
			name: 'vitalik.eth',
		})
		expect(ensNameResolver.projections.$$records.select(zeroSnapshot)).toEqual([])
	})

	it('resolves EnsRecord contenthash from live JSON-RPC and omits timestamp value when empty', async () => {
		if (ensRecordResolver == null)
			throw new Error('Voltaire EnsRecord resolver is not registered')

		resolveEnsForward.mockResolvedValueOnce({
			contentHash: '0xe30101701220content',
		})
		const contentHashRecord = await ensRecordResolver.resolve.NameRecordKey.resolve({
			$name: {
				name: 'vitalik.eth',
			},
			recordKey: 'contenthash',
		})
		expect(resolveEnsForward).toHaveBeenCalledWith({
			name: 'vitalik.eth',
			textKeys: [],
			coinTypeIds: [],
		})
		expect(contentHashRecord).toEqual({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			recordKey: 'contenthash',
			recordKind: 'contenthash',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$record: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'contenthash',
					},
					timestampMs: 1_800_000_000_000,
					source: Source.Voltaire_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xe30101701220content',
				},
			}],
		})

		resolveEnsForward.mockResolvedValueOnce({
			contentHash: null,
		})
		const emptyRecord = await ensRecordResolver.resolve.NameRecordKey.resolve({
			$name: {
				name: 'vitalik.eth',
			},
			recordKey: 'contenthash',
		})
		expect(emptyRecord.$$timestamps[0][EntityMetaKey.Fields]).toEqual({})
	})

	it('resolves EnsRecord text and coin keys from live JSON-RPC and omits timestamp value when empty', async () => {
		if (ensRecordResolver == null)
			throw new Error('Voltaire EnsRecord resolver is not registered')

		resolveEnsForward.mockResolvedValueOnce({
			textRecords: {
				url: 'https://vitalik.ca',
			},
		})
		const textRecord = await ensRecordResolver.resolve.NameRecordKey.resolve({
			$name: {
				name: 'vitalik.eth',
			},
			recordKey: 'text:url',
		})
		expect(resolveEnsForward).toHaveBeenCalledWith({
			name: 'vitalik.eth',
			textKeys: ['url'],
			coinTypeIds: [],
		})
		expect(textRecord).toEqual({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			recordKey: 'text:url',
			recordKind: 'text',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$record: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'text:url',
					},
					timestampMs: 1_800_000_000_000,
					source: Source.Voltaire_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: 'https://vitalik.ca',
				},
			}],
		})

		resolveEnsForward.mockResolvedValueOnce({
			coinAddresses: {
				'60': '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
			},
		})
		const coinRecord = await ensRecordResolver.resolve.NameRecordKey.resolve({
			$name: {
				name: 'vitalik.eth',
			},
			recordKey: 'coin:60',
		})
		expect(resolveEnsForward).toHaveBeenCalledWith({
			name: 'vitalik.eth',
			textKeys: [],
			coinTypeIds: [60],
		})
		expect(coinRecord).toEqual({
			$name: {
				[EntityMetaKey.Selector]: {
					name: 'vitalik.eth',
				},
			},
			recordKey: 'coin:60',
			recordKind: 'coin',
			coinType: 60,
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$record: {
						$name: {
							name: 'vitalik.eth',
						},
						recordKey: 'coin:60',
					},
					timestampMs: 1_800_000_000_000,
					source: Source.Voltaire_JsonRpc,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.EnsRecord_Timestamp, [], 'value')]: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				},
			}],
		})
		expect(ensRecordResolver.projections.coinType(coinRecord)).toBe(60)

		resolveEnsForward.mockResolvedValueOnce({
			textRecords: {},
		})
		const emptyTextRecord = await ensRecordResolver.resolve.NameRecordKey.resolve({
			$name: {
				name: 'vitalik.eth',
			},
			recordKey: 'text:url',
		})
		expect(emptyTextRecord.$$timestamps[0][EntityMetaKey.Fields]).toEqual({})

		resolveEnsForward.mockResolvedValueOnce({
			coinAddresses: {},
		})
		const emptyCoinRecord = await ensRecordResolver.resolve.NameRecordKey.resolve({
			$name: {
				name: 'vitalik.eth',
			},
			recordKey: 'coin:60',
		})
		expect(emptyCoinRecord.$$timestamps[0][EntityMetaKey.Fields]).toEqual({})
		expect(ensRecordResolver.projections.coinType(emptyCoinRecord)).toBe(60)
	})
})
