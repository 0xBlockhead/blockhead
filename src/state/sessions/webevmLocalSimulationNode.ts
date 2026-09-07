import { type } from 'arktype'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import {
	createNode,
	type SlimNode,
} from 'webevm'

import {
	EvmAddress,
	EvmRpcQuantity,
	EvmTopicHash,
	Hash32,
	ZeroExHex,
} from '$/schema/ZeroExHex.ts'

export type WebEvmHex = `0x${string}`

type CanonicalValue = string | readonly CanonicalValue[]

type Account = {
	readonly balance?: bigint
	readonly nonce?: bigint
	readonly code?: WebEvmHex
	readonly storage?: Readonly<Record<string, WebEvmHex>>
}

export type WebEvmLocalNodeConfig = {
	readonly chainId: number
	readonly stateMode: 'trie'
	readonly senderMode: 'recover'
	readonly miningConfig: {
		readonly type: 'manual'
	}
	readonly baseFeePerGas: bigint
	readonly gasPrice: bigint
	readonly blockGasLimit: bigint
	readonly initialState: Readonly<Record<string, Account>>
	readonly blockEnv: {
		readonly coinbase: WebEvmHex
		readonly baseFeePerGas: bigint
		readonly number: bigint
		readonly timestamp: bigint
		readonly gasLimit: bigint
		readonly prevRandao: WebEvmHex
	}
}

export type WebEvmReadOperation = {
	readonly kind: 'call' | 'estimateGas'
	readonly from: WebEvmHex
	readonly to: WebEvmHex
	readonly value: bigint
	readonly input: WebEvmHex
	readonly blockTag: typeof EvmRpcQuantity.infer
}

export type WebEvmSignedMutation = {
	readonly kind: 'sendRawTransaction'
	readonly rawTransaction: WebEvmHex
}

export type WebEvmBlockBasis = {
	readonly number: bigint
	readonly hash: WebEvmHex
}

export type WebEvmReceipt = {
	readonly status: WebEvmHex
	readonly transactionHash: WebEvmHex
	readonly gasUsed: WebEvmHex
	readonly logs: readonly {
		readonly address: WebEvmHex
		readonly topics: readonly WebEvmHex[]
		readonly data: WebEvmHex
	}[]
}

export type WebEvmCapturedOperationBasis = {
	readonly paramsHash: WebEvmHex
	readonly stateRoot: WebEvmHex
	readonly head: WebEvmBlockBasis
}

export type WebEvmLocalNode = {
	readonly node: SlimNode
	readonly chainId: number
	readonly nodeConfigHash: WebEvmHex
	readonly stateRoot: WebEvmHex
	readonly currentStateRoot: () => Promise<WebEvmHex>
	readonly captureOperation: (
		operation: WebEvmReadOperation | WebEvmSignedMutation
	) => Promise<WebEvmCapturedOperationBasis>
	readonly operationParamsHash: (
		operation: WebEvmReadOperation | WebEvmSignedMutation
	) => Promise<WebEvmHex>
	readonly sendRawTransaction: (
		rawTransaction: WebEvmHex
	) => Promise<WebEvmReceipt>
	readonly dispose: () => Promise<void>
	readonly reset: () => Promise<WebEvmLocalNode>
}

const LatestBlockWire = type({
	number: ZeroExHex,
	hash: Hash32,
})

const ReceiptLogWire = type({
	address: EvmAddress,
	topics: EvmTopicHash.array(),
	data: ZeroExHex,
})

const SynchronousReceiptWire = type({
	status: ZeroExHex,
	transactionHash: Hash32,
	gasUsed: ZeroExHex,
	logs: ReceiptLogWire.array(),
})

const compareCodeUnits = (
	left: string,
	right: string
): number => left < right ? -1 : left > right ? 1 : 0

const canonicalHex = (
	value: string
): WebEvmHex => ZeroExHex.assert(value.toLowerCase())

const address = (
	value: string
): WebEvmHex => EvmAddress.assert(canonicalHex(value))

const hash32 = (
	value: string
): WebEvmHex => Hash32.assert(canonicalHex(value))

const quantity = (
	value: bigint,
	name: string
): string => {
	if (value < 0n)
		throw new Error(`invalid ${name}`)

	return value.toString(10)
}

const digest = (
	tuple: CanonicalValue
): WebEvmHex => Hash32.assert(Hash.sha256(Hex.fromString(JSON.stringify(tuple))))

const sortedEntries = <_Value>(
	record: Readonly<Record<string, _Value>>
): readonly (readonly [
	string,
	_Value,
])[] => (
	Object.entries(record)
		.sort(([left], [right]) =>
			compareCodeUnits(left, right)
		)
)

const retainConfig = (
	input: WebEvmLocalNodeConfig
): WebEvmLocalNodeConfig => {
	if (!Number.isSafeInteger(input.chainId) || input.chainId <= 0)
		throw new Error('chainId must be positive and safe')

	const initialState: Record<string, Account> = {}

	for (const [rawAddress, account] of sortedEntries(input.initialState)) {
		const normalizedAddress = address(rawAddress)

		if (initialState[normalizedAddress] !== undefined)
			throw new Error('duplicate account address')

		const storage: Record<string, WebEvmHex> = {}

		for (const [rawKey, rawValue] of sortedEntries(account.storage ?? {})) {
			const key = hash32(rawKey)

			if (storage[key] !== undefined)
				throw new Error('duplicate storage key')

			storage[key] = hash32(rawValue)
		}

		initialState[normalizedAddress] = {
			balance: account.balance,
			nonce: account.nonce,
			code: (
				account.code === undefined ? undefined
				: canonicalHex(account.code)
			),
			storage,
		}
	}

	return structuredClone({
		...input,
		initialState,
		blockEnv: {
			...input.blockEnv,
			coinbase: address(input.blockEnv.coinbase),
			prevRandao: hash32(input.blockEnv.prevRandao),
		},
	})
}

const configTuple = (
	config: WebEvmLocalNodeConfig,
	engineId: string,
	root: WebEvmHex
): CanonicalValue => {
	if (engineId.length === 0)
		throw new Error('missing engine id')

	const accounts: CanonicalValue[] = []

	for (const [account, value] of sortedEntries(config.initialState)) {
		const storage: CanonicalValue[] = []

		for (const [key, stored] of sortedEntries(value.storage ?? {}))
			storage.push([key, stored])

		accounts.push([
			account,
			quantity(value.balance ?? 0n, 'balance'),
			quantity(value.nonce ?? 0n, 'nonce'),
			value.code ?? '0x',
			storage,
		])
	}

	return [
		'blockhead:webevm-local-node:v3',
		'webevm@0.5.0',
		engineId,
		quantity(BigInt(config.chainId), 'chainId'),
		'cancun',
		config.stateMode,
		config.senderMode,
		config.miningConfig.type,
		quantity(config.baseFeePerGas, 'base fee'),
		quantity(config.gasPrice, 'gas price'),
		quantity(config.blockGasLimit, 'block gas limit'),
		accounts,
		[
			config.blockEnv.coinbase,
			quantity(config.blockEnv.baseFeePerGas, 'block base fee'),
			quantity(config.blockEnv.number, 'block number'),
			quantity(config.blockEnv.timestamp, 'timestamp'),
			quantity(config.blockEnv.gasLimit, 'block gas limit'),
			config.blockEnv.prevRandao,
		],
		root,
	]
}

const operationTuple = (
	configHash: WebEvmHex,
	operation: WebEvmReadOperation | WebEvmSignedMutation,
	root: WebEvmHex,
	head: WebEvmBlockBasis
): CanonicalValue => {
	const basis: CanonicalValue = [
		root,
		quantity(head.number, 'head number'),
		head.hash,
	]

	if (operation.kind === 'sendRawTransaction')
		return [
			'blockhead:webevm-operation:v3',
			configHash,
			'eth_sendRawTransactionSync',
			Hash32.assert(Hash.sha256(operation.rawTransaction)),
			basis,
		]

	return [
		'blockhead:webevm-operation:v3',
		configHash,
		operation.kind,
		operation.kind === 'call' ? 'eth_call' : 'eth_estimateGas',
		[
			address(operation.from),
			address(operation.to),
			quantity(operation.value, 'value'),
			canonicalHex(operation.input),
			EvmRpcQuantity.assert(operation.blockTag),
		],
		basis,
	]
}

const currentBasis = async (
	node: SlimNode
): Promise<WebEvmBlockBasis> => {
	const block = LatestBlockWire.assert(await node.request({
		method: 'eth_getBlockByNumber',
		params: ['latest', false],
	}))

	return {
		number: BigInt(block.number),
		hash: Hash32.assert(block.hash),
	}
}

export const operationParamsHash = (
	configHash: WebEvmHex,
	operation: WebEvmReadOperation | WebEvmSignedMutation,
	root: WebEvmHex,
	head: WebEvmBlockBasis
): WebEvmHex => digest(operationTuple(
	Hash32.assert(configHash),
	operation,
	Hash32.assert(root),
	{
		number: head.number,
		hash: Hash32.assert(head.hash),
	}
))

export const createWebEvmLocalNode = async (
	input: WebEvmLocalNodeConfig
): Promise<WebEvmLocalNode> => {
	const retained = retainConfig(input)
	const node = await createNode(retained)
	const root = Hash32.assert(await node.getStateRoot())
	const configHash = digest(configTuple(retained, node.engine.id, root))
	let disposal: Promise<void> | undefined

	const dispose = (): Promise<void> => {
		if (disposal === undefined)
			disposal = node.dispose()

		return disposal
	}

	const sendRawTransaction = async (
		rawTransaction: WebEvmHex
	): Promise<WebEvmReceipt> => SynchronousReceiptWire.assert(await node.request({
		method: 'eth_sendRawTransactionSync',
		params: [canonicalHex(rawTransaction)],
	}))

	const captureOperation = async (
		operation: WebEvmReadOperation | WebEvmSignedMutation
	): Promise<WebEvmCapturedOperationBasis> => {
		const stateRoot = Hash32.assert(await node.getStateRoot())
		const head = await currentBasis(node)

		return {
			paramsHash: operationParamsHash(
				configHash,
				operation,
				stateRoot,
				head
			),
			stateRoot,
			head,
		}
	}

	const operationParamsHashForNode = async (
		operation: WebEvmReadOperation | WebEvmSignedMutation
	): Promise<WebEvmHex> => (await captureOperation(operation)).paramsHash

	const reset = async (): Promise<WebEvmLocalNode> => {
		await dispose()

		const next = await createWebEvmLocalNode(retained)

		if (
			next.stateRoot !== root
			|| next.nodeConfigHash !== configHash
		) {
			await next.dispose()
			throw new Error('reset identity mismatch')
		}

		return next
	}

	return Object.freeze({
		node,
		chainId: retained.chainId,
		nodeConfigHash: configHash,
		stateRoot: root,
		currentStateRoot: async () => Hash32.assert(await node.getStateRoot()),
		captureOperation,
		operationParamsHash: operationParamsHashForNode,
		sendRawTransaction,
		dispose,
		reset,
	})
}
