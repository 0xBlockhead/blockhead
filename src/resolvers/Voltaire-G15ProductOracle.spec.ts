import { describe, expect, it, vi } from 'vitest'
import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const getTransactionByHash = vi.hoisted(() => vi.fn())
const getTransactionReceipt = vi.hoisted(() => vi.fn())
const debugTraceTransaction = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Voltaire/JsonRpc/queries.ts', () => ({
	voltaireJsonRpcTransports: {
		httpTransportsByChainId: {
			31337: [{ diagnosticLabel: 'retained G15 disposable Anvil', getTransactionByHash, getTransactionReceipt, debugTraceTransaction }],
		},
	},
}))

const { default: voltaireJsonRpc } = await import('$/resolvers/Voltaire-JsonRpc.ts')

const from = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
const fixture = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'
const nestedSuccessHash = '0xed294ace8259b14f38651d07e91df398502b3f15b0158b8d16960fa90bc80eb9'
const directLogHash = '0x5bf24951a3e0ed1be77d73d743152355a285b418126b315a2dac3e5d5305e28b'
const logTopic = '0x850a767d264ab988d24d1ff1a7b843b2902e6cc83a7c7a457d97796c773b2b63'

const transaction = (hash: string, input: string) => ({
	hash, blockNumber: '0x4', from, to: fixture, type: '0x2', transactionIndex: '0x0', value: '0x0', nonce: '0x0', input, r: '0x01', s: '0x02', gas: '0x1c53', gasPrice: '0x1',
})

type TestLog = { address: string; blockHash: string; blockNumber: string; data: string; logIndex: string; removed: boolean; topics: string[] }
const receipt = (hash: string, logs: TestLog[], status = '0x1') => ({ status, gasUsed: '0x7097', cumulativeGasUsed: '0x7097', effectiveGasPrice: '0x1', logs, transactionHash: hash })

describe('Voltaire G15 source-traceable ingestion', () => {
	it('normalizes nested CALL paths and dynamic receipt log data from retained Anvil evidence', async () => {
		getTransactionByHash.mockResolvedValue(transaction(nestedSuccessHash, '0x14bd0a7b000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000002a'))
		getTransactionReceipt.mockResolvedValue(receipt(nestedSuccessHash, [
			{ address: fixture, blockHash: '0x5deb326cfb5a8e970336cdd2d4c8d2cdde47fe90ee448718bd0e6cefec70b183', blockNumber: '0x4', data: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a', logIndex: '0x0', removed: false, topics: [logTopic, '0x000000000000000000000000000000000000000000000000000000000000002a'] },
			{ address: fixture, blockHash: '0x5deb326cfb5a8e970336cdd2d4c8d2cdde47fe90ee448718bd0e6cefec70b183', blockNumber: '0x4', data: '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000', logIndex: '0x1', removed: false, topics: [logTopic, '0x000000000000000000000000000000000000000000000000000000000000002a'] },
		]))
		debugTraceTransaction.mockResolvedValue({ type: 'CALL', from, to: fixture, value: '0x0', gas: '0x1c53', gasUsed: '0x7097', input: '0x14bd0a7b000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512000000000000000000000000000000000000000000000000000000000000002a', output: '0x' + '0'.repeat(63) + '1', calls: [{ type: 'CALL', from: fixture, to: fixture, value: '0x0', gas: '0x195c', gasUsed: '0x120f', input: '0x60fe47b1000000000000000000000000000000000000000000000000000000000000002a', output: '0x', }] })
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => candidate.entityType === EntityType.EvmTransaction)
		if (resolver == null) throw new Error('EvmTransaction resolver missing')
		const row = await resolver.resolve.EvmNetworkTxHash.resolve({ $network: { caip2: { namespace: 'eip155', reference: '31337' } }, txHash: nestedSuccessHash })
		const traces = resolver.projections.$$traces.select(row)
		const logs = resolver.projections.$$logs.select(row)
		expect(traces.map((trace) => trace[EntityMetaKey.Selector].traceAddress)).toEqual(['root', '0'])
		expect(traces[1]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'type')]).toBe('Call')
		expect(traces[1]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'output')]).toBe('0x')
		expect(logs).toHaveLength(2)
		expect(logs[0]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmLog, [], 'data')]).toBe('0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002a')
		expect(logs[0]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmLog, [], 'topic0')]).toBe(logTopic)
		expect(logs[0]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmLog, [], '$$topics')]).toMatchObject([
			{ [EntityMetaKey.Selector]: { hex: logTopic } },
			{ [EntityMetaKey.Selector]: { hex: '0x000000000000000000000000000000000000000000000000000000000000002a' } },
		])
	})

	it('preserves exact non-empty root revert output and failed receipt status', async () => {
		const hash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
		getTransactionByHash.mockResolvedValue(transaction(hash, '0xcd2057d0'))
		getTransactionReceipt.mockResolvedValue(receipt(hash, [], '0x0'))
		debugTraceTransaction.mockResolvedValue({ type: 'CALL', from, to: fixture, input: '0xcd2057d0', output: '0xdeadbeef', error: 'execution reverted' })
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => candidate.entityType === EntityType.EvmTransaction)
		if (resolver == null) throw new Error('EvmTransaction resolver missing')
		const row = await resolver.resolve.EvmNetworkTxHash.resolve({ $network: { caip2: { namespace: 'eip155', reference: '31337' } }, txHash: hash })
		const trace = resolver.projections.$$traces.select(row)[0]
		expect(row.executionStatus).toBe(EvmTransactionExecutionStatus.Failed)
		expect(trace?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'output')]).toBe('0xdeadbeef')
		expect(trace?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'error')]).toContain('execution reverted')
	})

	it('preserves distinct nested child and root revert outputs', async () => {
		const hash = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
		const rootOutput = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d6e6573746564206661696c656400000000000000000000000000000000000000'
		const childOutput = '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000d746172676574206661696c656400000000000000000000000000000000000000'
		getTransactionByHash.mockResolvedValue(transaction(hash, '0x14bd0a7b0000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3000000000000000000000000000000000000000000000000000000000000002a'))
		getTransactionReceipt.mockResolvedValue(receipt(hash, [], '0x0'))
		debugTraceTransaction.mockResolvedValue({
			type: 'CALL', from, to: fixture, value: '0x0', input: '0x14bd0a7b', output: rootOutput, error: 'execution reverted', revertReason: 'nested failed',
			calls: [{ type: 'CALL', from: fixture, to: '0x5fbdb2315678afecb367f032d93f642f64180aa3', value: '0x0', input: '0x60fe47b1', output: childOutput, error: 'execution reverted', revertReason: 'target failed' }],
		})
		const resolver = voltaireJsonRpc.resolvers.find((candidate) => candidate.entityType === EntityType.EvmTransaction)
		if (resolver == null) throw new Error('EvmTransaction resolver missing')
		const row = await resolver.resolve.EvmNetworkTxHash.resolve({ $network: { caip2: { namespace: 'eip155', reference: '31337' } }, txHash: hash })
		const traces = resolver.projections.$$traces.select(row)
		expect(row.executionStatus).toBe(EvmTransactionExecutionStatus.Failed)
		expect(traces.map((trace) => trace[EntityMetaKey.Selector].traceAddress)).toEqual(['root', '0'])
		expect(traces[0]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'output')]).toBe(rootOutput)
		expect(traces[0]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'error')]).toBe('nested failed')
		expect(traces[1]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'output')]).toBe(childOutput)
		expect(traces[1]?.[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.EvmTrace, [], 'error')]).toBe('target failed')
	})
})
