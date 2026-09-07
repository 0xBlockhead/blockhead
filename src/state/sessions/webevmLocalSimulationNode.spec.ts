import {
	describe,
	expect,
	it,
} from 'vitest'

import {
	EvmRpcQuantity,
	Hash32,
	ZeroExHex,
} from '$/schema/ZeroExHex.ts'
import {
	createWebEvmLocalNode,
	operationParamsHash,
	type WebEvmLocalNodeConfig,
	type WebEvmReadOperation,
} from '$/state/sessions/webevmLocalSimulationNode.ts'

const sender = ZeroExHex.assert('0x19e7e376e7c213b7e7e7e46cc70a5dd086daff2a')
const recipient = ZeroExHex.assert('0x0000000000000000000000000000000000000020')
const basisHash = Hash32.assert(`0x${'11'.repeat(32)}`)
const storageKey = Hash32.assert(`0x${'00'.repeat(32)}`)
const rawTransaction = ZeroExHex.assert('0x02f86b827a6980010182520894000000000000000000000000000000000000002087038d7ea4c6800080c080a07ba5e874e8d78ee210942b26c9575e463039fd95ea2f1c9b09ecbb88f600f42fa04ccec800073eec849df9349408de8130c7bf9fab51433ee72709bdb9617c3ee9')

const config = (
	reordered = false
) => ({
	chainId: 31337,
	stateMode: 'trie',
	senderMode: 'recover',
	miningConfig: {
		type: 'manual',
	},
	baseFeePerGas: 1n,
	gasPrice: 1n,
	blockGasLimit: 30_000_000n,
	initialState: (
		reordered ? {
			[sender.toUpperCase()]: {
				balance: 10n ** 18n,
				storage: {
					[storageKey]: basisHash,
				},
			},
			[recipient]: {
				balance: 0n,
			},
		} : {
			[recipient]: {
				balance: 0n,
			},
			[sender]: {
				balance: 10n ** 18n,
				storage: {
					[storageKey]: basisHash,
				},
			},
		}
	),
	blockEnv: {
		coinbase: ZeroExHex.assert('0x0000000000000000000000000000000000000004'),
		baseFeePerGas: 1n,
		number: 7n,
		timestamp: 1_700_000_000n,
		gasLimit: 30_000_000n,
		prevRandao: basisHash,
	},
} as const satisfies WebEvmLocalNodeConfig)

describe('WebEVM local node semantic contract', () => {
	it('canonicalizes reorder and distinguishes changed config values', async () => {
		const first = await createWebEvmLocalNode(config())
		const reordered = await createWebEvmLocalNode(config(true))
		const altered = await createWebEvmLocalNode({
			...config(),
			initialState: {
				...config().initialState,
				[sender]: {
					...config().initialState[sender],
					balance: 2n,
				},
			},
		})

		expect(reordered.nodeConfigHash).toBe(first.nodeConfigHash)
		expect(altered.nodeConfigHash).not.toBe(first.nodeConfigHash)

		await first.dispose()
		await reordered.dispose()
		await altered.dispose()
	})

	it('distinguishes method, arguments, tag, head, and pre-state', () => {
		const call = {
			kind: 'call',
			from: sender,
			to: recipient,
			value: 0n,
			input: ZeroExHex.assert('0x'),
			blockTag: EvmRpcQuantity.assert('0x0'),
		} as const satisfies WebEvmReadOperation
		const configHash = Hash32.assert(`0x${'aa'.repeat(32)}`)
		const alternateStateRoot = Hash32.assert(`0x${'22'.repeat(32)}`)
		const alternateBlockHash = Hash32.assert(`0x${'33'.repeat(32)}`)
		const at = (
			operation: WebEvmReadOperation,
			root = basisHash,
			number = 7n,
			hash = basisHash
		) => operationParamsHash(configHash, operation, root, {
			number,
			hash,
		})

		expect(at(call)).not.toBe(at({
			...call,
			kind: 'estimateGas',
		}))
		expect(at(call)).not.toBe(at({
			...call,
			value: 1n,
		}))
		expect(at(call)).not.toBe(at({
			...call,
			blockTag: basisHash,
		}))
		expect(at(call)).not.toBe(at(call, alternateStateRoot))
		expect(at(call, basisHash, 8n)).not.toBe(at(call))
		expect(at(call, basisHash, 7n, alternateBlockHash)).not.toBe(at(call))
	})

	it('rejects invalid and duplicate normalized identities', async () => {
		await expect(createWebEvmLocalNode({
			...config(),
			chainId: 0,
		})).rejects.toThrow('chainId')

		await expect(createWebEvmLocalNode({
			...config(),
			initialState: {
				...config().initialState,
				['0X19E7E376E7C213B7E7E7E46CC70A5DD086DAFF2A']: {
					balance: 1n,
				},
			},
		})).rejects.toThrow('duplicate')
	})

	it('proves receiver mutation, replay rejection, reset, and shared disposal', async () => {
		const local = await createWebEvmLocalNode(config())
		const before = local.stateRoot
		const senderBalanceBefore = EvmRpcQuantity.assert(await local.node.request({
			method: 'eth_getBalance',
			params: [
				sender,
				'latest',
			],
		}))
		const recipientBalanceBefore = EvmRpcQuantity.assert(await local.node.request({
			method: 'eth_getBalance',
			params: [
				recipient,
				'latest',
			],
		}))
		const receipt = await local.sendRawTransaction(rawTransaction)

		expect(receipt.status).toBe(ZeroExHex.assert('0x1'))
		const senderBalanceAfter = EvmRpcQuantity.assert(await local.node.request({
			method: 'eth_getBalance',
			params: [
				sender,
				'latest',
			],
		}))
		const recipientBalanceAfter = EvmRpcQuantity.assert(await local.node.request({
			method: 'eth_getBalance',
			params: [
				recipient,
				'latest',
			],
		}))
		expect(BigInt(recipientBalanceAfter) - BigInt(recipientBalanceBefore)).toBe(10n ** 15n)
		expect(BigInt(senderBalanceBefore) - BigInt(senderBalanceAfter)).toBe(
			10n ** 15n + BigInt(receipt.gasUsed)
		)

		const changed = await local.node.getStateRoot()

		expect(changed).not.toBe(before)

		await expect(local.sendRawTransaction(rawTransaction)).rejects.toBeDefined()
		expect(await local.node.getStateRoot()).toBe(changed)

		const reset = await local.reset()

		expect(reset.stateRoot).toBe(before)
		expect(reset.nodeConfigHash).toBe(local.nodeConfigHash)
		expect(await reset.node.request({
			method: 'eth_getBalance',
			params: [
				sender,
				'latest',
			],
		})).toBe(senderBalanceBefore)
		expect(await reset.node.request({
			method: 'eth_getBalance',
			params: [
				recipient,
				'latest',
			],
		})).toBe(recipientBalanceBefore)
		expect(await local.node.getStateRoot()).toBe(changed)

		const one = reset.dispose()
		const two = reset.dispose()

		expect(await Promise.all([one, two])).toHaveLength(2)
	})
})
