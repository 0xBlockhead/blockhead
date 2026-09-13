import { type } from 'arktype'
import * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import * as TransactionEnvelope from 'ox/TxEnvelope'
import { RpcError } from 'webevm'

import type { LocalMutationContext } from '$/collections/localMutations.ts'
import { normalizeBoundaryError } from '$/lib/errors.ts'
import { createEip1193EvmNativeTransferExecutionTransport } from '$/state/sessions/eip1193EvmNativeTransferExecutionTransport.ts'
import {
	persistWebEvmSimulation,
	type WebEvmCallResult,
	type WebEvmReceipt,
} from '$/state/sessions/webevmLocalSimulationPersistence.ts'
import {
	EvmAddress,
	Hash32,
	ZeroExHex,
} from '$/schema/ZeroExHex.ts'
import {
	createWebEvmLocalNode,
	type WebEvmHex,
	type WebEvmLocalNode,
	type WebEvmLocalNodeConfig,
	type WebEvmReadOperation,
} from '$/state/sessions/webevmLocalSimulationNode.ts'

type PersistenceInput = Parameters<typeof persistWebEvmSimulation>[1]

export type WebEvmSimulationSeed = Omit<
	PersistenceInput['simulation'],
	'paramsHash'
>

export type WebEvmCallSimulationInput = {
	readonly session: PersistenceInput['session']
	readonly simulation: WebEvmSimulationSeed
	readonly operation: WebEvmReadOperation
	readonly expectedParamsHash?: WebEvmHex
}

export type WebEvmSendSimulationInput = {
	readonly session: PersistenceInput['session']
	readonly simulation: WebEvmSimulationSeed
	readonly request: PersistenceInput['request']
	readonly rawTransaction: WebEvmHex
	readonly expectedParamsHash?: WebEvmHex
}

export type WebEvmSendSimulationResult = {
	readonly paramsHash: WebEvmHex
	readonly receipt: WebEvmReceiptWire
}

export type WebEvmLocalSimulationConsumer = {
	readonly nodeConfigHash: WebEvmHex
	readonly initialStateRoot: WebEvmHex
	readonly currentStateRoot: () => Promise<WebEvmHex>
	readonly capture: (
		operation: WebEvmReadOperation | { readonly kind: 'sendRawTransaction'; readonly rawTransaction: WebEvmHex }
	) => Promise<WebEvmOperationBasis>
	readonly simulateCall: (
		context: LocalMutationContext,
		input: WebEvmCallSimulationInput
	) => Promise<WebEvmCallResult>
	readonly estimateGas: (
		operation: WebEvmReadOperation
	) => Promise<bigint>
	readonly sendRawTransaction: (
		context: LocalMutationContext,
		input: WebEvmSendSimulationInput
	) => Promise<WebEvmSendSimulationResult>
	readonly dispose: () => Promise<void>
	readonly reset: () => Promise<WebEvmLocalSimulationConsumer>
}

export type WebEvmOperationBasis = {
	readonly paramsHash: WebEvmHex
	readonly forkBlockNumber: bigint
}

export class WebEvmStaleOperationError extends Error {
	readonly expectedParamsHash: WebEvmHex
	readonly actualParamsHash: WebEvmHex

	constructor(expectedParamsHash: WebEvmHex, actualParamsHash: WebEvmHex) {
		super('WebEVM operation basis is stale')
		this.name = 'WebEvmStaleOperationError'
		this.expectedParamsHash = expectedParamsHash
		this.actualParamsHash = actualParamsHash
	}
}

const receiptLogWire = type({
	address: EvmAddress,
	topics: ZeroExHex.array(),
	data: ZeroExHex,
})

const receiptWire = type({
	status: ZeroExHex,
	transactionHash: Hash32,
	gasUsed: ZeroExHex,
	logs: receiptLogWire.array(),
})

type WebEvmReceiptWire = typeof receiptWire.infer

const captureOperation = async (
	localNode: WebEvmLocalNode,
	operation: WebEvmReadOperation | { readonly kind: 'sendRawTransaction'; readonly rawTransaction: WebEvmHex }
): Promise<WebEvmOperationBasis> => {
	const basis = await localNode.captureOperation(operation)

	return {
		paramsHash: basis.paramsHash,
		forkBlockNumber: basis.head.number,
	}
}

const assertFresh = (
	expectedParamsHash: WebEvmHex | undefined,
	actualParamsHash: WebEvmHex
): void => {
	if (expectedParamsHash != null && expectedParamsHash !== actualParamsHash)
		throw new WebEvmStaleOperationError(expectedParamsHash, actualParamsHash)
}

const callResultFromError = (
	error: Error
): Extract<WebEvmCallResult, { readonly kind: 'revert' }> => {
	if (!(error instanceof RpcError) || error.code !== 3)
		throw error

	return {
		kind: 'revert',
		data: ZeroExHex.assert(error.data),
	}
}

const receiptStatus = (
	status: WebEvmHex
): WebEvmReceipt['status'] => {
	if (status === '0x0' || status === '0x1')
		return status

	throw new Error('WebEVM receipt has an unsupported status')
}

const requestValue = (
	value: WebEvmSendSimulationInput['request']['value']
): bigint => {
	if (value == null)
		return 0n

	// oxlint-disable-next-line no-runtime-shape-guards/guards -- WebEVM 0.5 exposes this wire field as bigint | hex.
	if (typeof value === 'bigint')
		return value

	return Hex.toBigInt(ZeroExHex.assert(value))
}

const requestFromSignedTransaction = (
	localNode: WebEvmLocalNode,
	rawTransaction: WebEvmHex
): PersistenceInput['request'] => {
	const envelope = TransactionEnvelope.deserialize(rawTransaction)
	const signature = Signature.extract(envelope)

	if (signature === undefined)
		throw new Error('WebEVM signed transaction is missing its signature')

	if (envelope.chainId !== localNode.chainId)
		throw new Error('WebEVM signed transaction chain does not match the local node')

	const to = (
		envelope.to == null ? envelope.to
		: EvmAddress.assert(envelope.to.toLowerCase())
	)

	return {
		from: EvmAddress.assert(Secp256k1.recoverAddress({
			payload: TransactionEnvelope.getSignPayload(envelope),
			signature,
		}).toLowerCase()),
		to,
		value: envelope.value ?? 0n,
		input: ZeroExHex.assert(envelope.data ?? '0x'),
	}
}

const assertRequestMatchesSignedTransaction = (
	request: PersistenceInput['request'],
	derived: PersistenceInput['request']
): void => {
	const from = (
		request.from == null ? undefined
		: EvmAddress.assert(request.from.toLowerCase())
	)
	const to = (
		request.to == null ? request.to
		: EvmAddress.assert(request.to.toLowerCase())
	)
	const input = ZeroExHex.assert(request.input ?? '0x')

	if (
		from !== derived.from
		|| to !== derived.to
		|| requestValue(request.value) !== derived.value
		|| input !== derived.input
	)
		throw new Error('WebEVM persisted request does not match the signed transaction')
}

const compose = (
	localNode: WebEvmLocalNode
): WebEvmLocalSimulationConsumer => {
	const operations = createEip1193EvmNativeTransferExecutionTransport(
		localNode.node
	)

	let tail = Promise.resolve()
	let disposal: Promise<void> | undefined
	let resetResult: Promise<WebEvmLocalSimulationConsumer> | undefined
	let terminalFailure: Error | undefined
	let closed = false

	const enqueue = <_Result>(operation: () => Promise<_Result>): Promise<_Result> => {
		if (terminalFailure !== undefined)
			return Promise.reject(terminalFailure)

		if (closed)
			return Promise.reject(new Error('WebEVM simulation consumer is disposed'))

		const result = tail.then(() => {
			if (terminalFailure !== undefined)
				throw terminalFailure

			return operation()
		})
		tail = result.then(() => undefined, () => undefined)
		return result
	}

	const dispose = (): Promise<void> => {
		closed = true
		if (disposal === undefined) {
			disposal = (
				resetResult === undefined ? tail.then(() => localNode.dispose())
				: resetResult.then((next) => next.dispose())
			)
		}
		return disposal
	}

	const capture = (
		operation: WebEvmReadOperation | { readonly kind: 'sendRawTransaction'; readonly rawTransaction: WebEvmHex }
	): Promise<WebEvmOperationBasis> => {
		const retainedOperation = structuredClone(operation)
		return enqueue(() => captureOperation(localNode, retainedOperation))
	}

	const simulateCall = (
		context: LocalMutationContext,
		input: WebEvmCallSimulationInput
	): Promise<WebEvmCallResult> => {
		const retainedInput = structuredClone(input)
		return enqueue(async () => {
			const basis = await captureOperation(localNode, retainedInput.operation)
			assertFresh(retainedInput.expectedParamsHash, basis.paramsHash)
			let call: WebEvmCallResult

			try {
				call = {
					kind: 'success',
					data: ZeroExHex.assert(await operations.getCall(retainedInput.operation)),
				}
			}
			catch (error) {
				call = callResultFromError(normalizeBoundaryError(error))
			}

			await persistWebEvmSimulation(context, {
				session: retainedInput.session,
				simulation: {
					...retainedInput.simulation,
					paramsHash: basis.paramsHash,
					forkBlockNumber: basis.forkBlockNumber,
				},
				request: retainedInput.operation,
				kind: 'call',
				call,
			})

			return call
		})
	}

	const sendRawTransaction = async (
		context: LocalMutationContext,
		input: WebEvmSendSimulationInput
	): Promise<WebEvmSendSimulationResult> => {
		const retainedInput = structuredClone(input)
		return enqueue(async () => {
			const operation = {
				kind: 'sendRawTransaction',
				rawTransaction: retainedInput.rawTransaction,
			} as const
			const request = requestFromSignedTransaction(
				localNode,
				retainedInput.rawTransaction
			)
			assertRequestMatchesSignedTransaction(retainedInput.request, request)
			const basis = await captureOperation(localNode, operation)
			assertFresh(retainedInput.expectedParamsHash, basis.paramsHash)

			try {
				const receipt = receiptWire.assert(
					await localNode.sendRawTransaction(retainedInput.rawTransaction)
				)
				const persistedReceipt: WebEvmReceipt = {
					status: receiptStatus(receipt.status),
					gasUsed: receipt.gasUsed,
					logs: receipt.logs,
				}

				await persistWebEvmSimulation(context, {
					session: retainedInput.session,
					simulation: {
						...retainedInput.simulation,
						paramsHash: basis.paramsHash,
						forkBlockNumber: basis.forkBlockNumber,
					},
					request,
					kind: 'receipt',
					receipt: persistedReceipt,
				})

				return {
					paramsHash: basis.paramsHash,
					receipt,
				}
			}
			catch (error) {
				terminalFailure = error instanceof Error ? error : new Error('WebEVM mutation failed without an error value')
				closed = true
				throw terminalFailure
			}
		})
	}

	const reset = (): Promise<WebEvmLocalSimulationConsumer> => {
		if (disposal !== undefined)
			return Promise.reject(new Error('WebEVM simulation consumer is disposed'))

		closed = true
		if (resetResult === undefined)
			resetResult = tail.then(() => localNode.reset()).then(compose)
		return resetResult
	}

	return Object.freeze({
		nodeConfigHash: localNode.nodeConfigHash,
		initialStateRoot: localNode.stateRoot,
		currentStateRoot: () => enqueue(() => localNode.currentStateRoot()),
		capture,
		simulateCall,
		estimateGas: (operation: WebEvmReadOperation) => {
			const retainedOperation = structuredClone(operation)
			return enqueue(() => operations.estimateGas(retainedOperation))
		},
		sendRawTransaction,
		dispose,
		reset,
	})
}

export const createWebEvmLocalSimulationConsumer = async (
	config: WebEvmLocalNodeConfig
): Promise<WebEvmLocalSimulationConsumer> => compose(
	await createWebEvmLocalNode(config)
)
