import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	getAccountBalance,
	implicitAccountReference,
	listPendingTransactions,
	setQuilibriumNodeRpcAccountAuthResolver,
	setQuilibriumNodeRpcGrpcUnaryCall,
} from '$/sources/QuilibriumNodeRpc/Grpc/queries.ts'
import {
	bigintFromBalanceBytes,
	hexAddressFromBytes,
} from '$/sources/QuilibriumNodeRpc/Grpc/types.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const { default: quilibriumNodeRpc } = await import('$/resolvers/QuilibriumNodeRpc-Grpc.ts')

const accountResolver = quilibriumNodeRpc.resolvers.find((resolver) => resolver.entityType === EntityType.QuilibriumAccount)
const accountStateResolver = quilibriumNodeRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadQuilibriumAccountState
	&& '$$timestamps' in resolver.projections
))
const accountStateTimestampResolver = quilibriumNodeRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadQuilibriumAccountState_Timestamp
))
const pendingListResolver = quilibriumNodeRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadQuilibriumAccountState
	&& '$$pendingTransactions' in resolver.projections
))
const pendingTransactionResolver = quilibriumNodeRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadQuilibriumPendingTransaction
))

if (
	accountResolver == null
	|| accountStateResolver == null
	|| accountStateTimestampResolver == null
	|| pendingListResolver == null
	|| pendingTransactionResolver == null
)
	throw new Error('QuilibriumNodeRpc-Grpc spec missing resolver')

const accountAddress = `0x${'12'.repeat(32)}`
const connectionId = 'test-connection'
const network = {
	slug: 'quilibrium',
} as const

afterEach(() => {
	setQuilibriumNodeRpcGrpcUnaryCall(undefined)
	setQuilibriumNodeRpcAccountAuthResolver(undefined)
})

describe('Quilibrium node RPC account resolution', () => {
	it('maps a provider-native implicit account reference to its account kind', async () => {
		expect(implicitAccountReference(accountAddress)).toEqual({
			implicitAccount: {
				implicitType: 0,
				address: new Uint8Array(32).fill(0x12),
			},
		})
		await expect(
			accountResolver.resolve.NetworkAccountAddress.resolve({
				$network: network,
				accountAddress,
			})
		).resolves.toMatchObject({
			accountKind: 'implicit',
		})
	})

	it.each([
		'0x1234',
		`0x${'gg'.repeat(32)}`,
		'12'.repeat(32),
	])('rejects malformed provider account address %s', async (malformedAccountAddress) => {
		await expect(
			accountResolver.resolve.NetworkAccountAddress.resolve({
				$network: network,
				accountAddress: malformedAccountAddress,
			})
		).rejects.toThrow('implicit account address must be 0x-prefixed 32-byte hex')
	})

	it('rejects an otherwise valid account on an unrelated network', async () => {
		await expect(
			accountResolver.resolve.NetworkAccountAddress.resolve({
				$network: {
					slug: 'bitcoin',
				},
				accountAddress,
			})
		).rejects.toThrow('QuilibriumNodeRpc_Grpc: unsupported network')
	})
})

describe('Quilibrium node RPC account balance transport', () => {
	it('calls AccountService.GetBalance with the decryptable request unchanged and fail-closes envelopes', async () => {
		const request = {
			request: {
				account: implicitAccountReference(accountAddress),
			},
			keyRing: {
				keys: [],
			},
		}
		const response = { balance: new Uint8Array([1, 2, 3]) }
		const callUnary = vi.fn().mockResolvedValue(response)

		await expect(getAccountBalance({ callUnary, request })).resolves.toEqual(response)
		expect(callUnary).toHaveBeenCalledWith({
			service: 'quilibrium.node.node.pb.AccountService',
			method: 'GetBalance',
			request,
		})

		callUnary.mockResolvedValueOnce({ balance: 'not-bytes' })
		await expect(getAccountBalance({ callUnary, request })).rejects.toThrow('invalid GetBalance response envelope')
	})
})

describe('Quilibrium node RPC pending transactions transport', () => {
	it('calls AccountService.ListPendingTransactions with the decryptable request unchanged and fail-closes envelopes', async () => {
		const request = {
			request: {
				account: implicitAccountReference(accountAddress),
			},
			keyRing: {
				keys: [],
			},
		}
		const response = { pendingTransactions: [] }
		const callUnary = vi.fn().mockResolvedValue(response)

		await expect(listPendingTransactions({ callUnary, request })).resolves.toEqual(response)
		expect(callUnary).toHaveBeenCalledWith({
			service: 'quilibrium.node.node.pb.AccountService',
			method: 'ListPendingTransactions',
			request,
		})

		callUnary.mockResolvedValueOnce({ pendingTransactions: 'nope' })
		await expect(listPendingTransactions({ callUnary, request })).rejects.toThrow('invalid ListPendingTransactions response envelope')
	})
})

describe('Quilibrium node RPC BlockheadQuilibrium account projections', () => {
	const emptyAuth = {
		keyRing: {
			keys: [],
		},
	}

	it('projects account-state tip selectors and authority metadata', async () => {
		setQuilibriumNodeRpcAccountAuthResolver(() => emptyAuth)

		await expect(
			accountStateResolver.resolve.ConnectionIdNetworkAccountAddress.resolve({
				connectionId,
				$network: network,
				accountAddress,
			})
		).resolves.toMatchObject({
			connectionId,
			accountAddress,
			accountKind: 'implicit',
			keyRingRefCount: 0,
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$accountState: {
							connectionId,
							$network: network,
							accountAddress,
						},
						source: Source.QuilibriumNodeRpc_Grpc,
					},
				},
			],
		})
	})

	it('projects balance tip observations through GetBalance', async () => {
		setQuilibriumNodeRpcAccountAuthResolver(() => emptyAuth)
		setQuilibriumNodeRpcGrpcUnaryCall(vi.fn().mockResolvedValue({
			balance: new Uint8Array([0x01, 0x00]),
		}))

		await expect(
			accountStateTimestampResolver.resolve.AccountStateTimestampMsSource.resolve({
				$accountState: {
					connectionId,
					$network: network,
					accountAddress,
				},
				timestampMs: 1,
				source: Source.QuilibriumNodeRpc_Grpc,
			})
		).resolves.toMatchObject({
			balance: 0x100n,
			balanceObservedAt: expect.any(Number),
		})
		expect(bigintFromBalanceBytes(new Uint8Array([0x01, 0x00]))).toBe(0x100n)
	})

	it('projects pending queue rows and singular pending transaction fields', async () => {
		const pendingAddress = new Uint8Array(32).fill(0xab)
		const coinAddress = new Uint8Array(32).fill(0xcd)
		const refundAddress = new Uint8Array(32).fill(0xef)
		setQuilibriumNodeRpcAccountAuthResolver(() => ({
			...emptyAuth,
			deliveryMethod: {
				deliveryType: 1,
				address: new Uint8Array([9]),
			},
		}))
		setQuilibriumNodeRpcGrpcUnaryCall(vi.fn().mockResolvedValue({
			pendingTransactions: [
				{
					pendingTransaction: {
						address: pendingAddress,
					},
					coin: {
						coin: {
							address: coinAddress,
						},
						balance: new Uint8Array([0x2a]),
					},
					refundAccount: {
						implicitAccount: {
							implicitType: 0,
							address: refundAddress,
						},
					},
				},
			],
		}))

		const transactionAddress = hexAddressFromBytes(pendingAddress)
		await expect(
			pendingListResolver.resolve.ConnectionIdNetworkAccountAddress.resolve({
				connectionId,
				$network: network,
				accountAddress,
			})
		).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$accountState: {
						connectionId,
						$network: network,
						accountAddress,
					},
					transactionAddress,
				},
			},
		])

		await expect(
			pendingTransactionResolver.resolve.AccountStateTransactionAddress.resolve({
				$accountState: {
					connectionId,
					$network: network,
					accountAddress,
				},
				transactionAddress,
			})
		).resolves.toMatchObject({
			coinAddress: hexAddressFromBytes(coinAddress),
			amount: 0x2an,
			deliveryType: '1',
			deliveryAddress: '0x09',
			$refundAccount: {
				[EntityMetaKey.Selector]: {
					$network: network,
					accountAddress: hexAddressFromBytes(refundAddress),
				},
			},
		})
	})
})
