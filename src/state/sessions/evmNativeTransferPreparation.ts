import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import {
	type ActionParamsByActionType,
	ActionType,
	actionTypeDefinitionByActionType,
	zeroAddress,
} from '$/actions/index.ts'
import { Caip2Namespace } from '$/constants/Network.ts'
import { WalletCapability } from '$/constants/Wallet.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import {
	EntityMetaKey,
	type EntityFieldValues,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import type { schema } from '$/schema/index.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress, Hash32, ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	type LocalMutationContext,
	writeLocalBlockheadActionOutcome,
	writeLocalBlockheadActionReadinessChecks,
	writeLocalBlockheadIntentInvocation,
	writeLocalBlockheadSessionSimulation,
	writeLocalBlockheadTransferIntent,
	writeLocalBlockheadWalletRequest,
	writeLocalBlockheadWalletRequest_Timestamp,
} from '$/collections/localMutations.ts'
import { Source } from '$/sources/Source.ts'
import { voltaireJsonRpcTransports } from '$/sources/Voltaire/JsonRpc/queries.ts'
import type { RpcBlockWire } from '$/sources/_shared/interfaces/EvmExecutionJsonRpc/types.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'
import { isSelectedWalletConnection } from '$/state/wallets/walletConnectionState.ts'


// Types

type TransferParams = ActionParamsByActionType[ActionType.Transfer]
type EvmAddressValue = typeof EvmAddress.infer
type ZeroExHexValue = typeof ZeroExHex.infer

type Session = Pick<
	EntityFieldValues<typeof schema, EntityType.BlockheadSession>,
	'id' | 'lockedAt'
>

type SessionAction = (
	& Pick<
		EntityFieldValues<typeof schema, EntityType.BlockheadSessionAction>,
		'sessionId' | 'actionId' | 'indexInSequence'
	>
	& { $action: Pick<EntityFieldValues<typeof schema, EntityType.BlockheadAction>, 'id' | 'content' | 'contentRevisionHash'> }
)

type ExecutionCall = {
	from: EvmAddressValue
	to: EvmAddressValue
	input: ZeroExHexValue
	value: bigint
	blockTag: ZeroExHexValue
}

type EvmNativeTransferSimulationDispatch = {
	invocationPayloadHash: ZeroExHexValue
	sourceSelector: EntitySelector<typeof schema, EntityType.Account>
	targetSelector: EntitySelector<typeof schema, EntityType.Account>
}

export type EvmNativeTransferExecutionTransport = {
	origin: string
	getBlockByNumber(request: {
		blockNumber: 'latest'
		txObjects: false
	}): Promise<Pick<RpcBlockWire, 'number'> | null>
	getCall(call: ExecutionCall): Promise<string>
	estimateGas(call: ExecutionCall): Promise<bigint>
}

export type EvmNativeTransferReadinessCheckId = (
	| 'session-locked'
	| 'single-transfer-action'
	| 'native-transfer-params'
	| 'wallet-account'
	| 'send-transaction-capability'
	| 'eth-send-transaction-scope'
	| 'rpc-simulation'
)

export type EvmNativeTransferReadinessStatus = 'ready' | 'blocked' | 'not-evaluated'

type ReadinessCheckPayload = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadActionReadinessCheck>,
	'$$timestamps'
>
type ReadinessObservationPayload = EntityFieldValues<
	typeof schema,
	EntityType.BlockheadActionReadinessCheck_Timestamp
>

export type EvmNativeTransferReadiness = {
	checkId: EvmNativeTransferReadinessCheckId
	status: EvmNativeTransferReadinessStatus
	error?: string
	check?: ReadinessCheckPayload
	observation?: ReadinessObservationPayload
}

export type BlockheadTransferIntentPayload = EntityFieldValues<
	typeof schema,
	EntityType.BlockheadTransferIntent
>

export type BlockheadSessionSimulationPayload = Omit<
	EntityFieldValues<typeof schema, EntityType.BlockheadSessionSimulation>,
	'$$calls' | '$$logs'
>

export type BlockheadSessionSimulationCallPayload = EntityFieldValues<
	typeof schema,
	EntityType.BlockheadSessionSimulationCall
>

export type EvmNativeTransferPreparation = (
	| {
		ready: true
		paramsHash: ZeroExHexValue
		intent: BlockheadTransferIntentPayload & {
			$network: NonNullable<BlockheadTransferIntentPayload['$network']>
		}
		transaction: Omit<ExecutionCall, 'blockTag'>
		simulation: BlockheadSessionSimulationPayload
	}
	| {
		ready: false
		paramsHash?: ZeroExHexValue
		intent?: BlockheadTransferIntentPayload
		transaction?: Omit<ExecutionCall, 'blockTag'>
		simulation?: BlockheadSessionSimulationPayload
	}
) & {
	error?: string
	readiness: EvmNativeTransferReadiness[]
	simulationCall?: BlockheadSessionSimulationCallPayload
	walletRequest?: EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
}


// Functions

const sha256Text = (value: string) => Hash.sha256(Hex.fromString(value))

export const prepareEvmNativeTransfer = async ({
	session,
	actions,
	walletConnections,
	executionTransport,
	onSimulationDispatch,
	simulationId: providedSimulationId,
	timestampMs = Date.now(),
}: {
	session: Session
	actions: readonly SessionAction[]
	walletConnections: readonly WalletConnection[]
	executionTransport?: EvmNativeTransferExecutionTransport
	onSimulationDispatch?: (dispatch: EvmNativeTransferSimulationDispatch) => Promise<void>
	simulationId?: string
	timestampMs?: number
}): Promise<EvmNativeTransferPreparation> => {
	const action = actions.length === 1 ? actions[0] : undefined
	const sessionLockError = session.lockedAt == null ? 'Session must be locked before transfer preparation.' : undefined
	const actionShapeError = (
		action == null ?
			`Transfer preparation requires exactly one action; received ${actions.length}.`
		: action.sessionId !== session.id ?
			'Transfer action belongs to a different session.'
		: action.indexInSequence !== 0 ?
			'The single transfer action must be first in the session sequence.'
		: action.$action.content.type !== ActionType.Transfer ?
			'The session action must be a Transfer action.'
		:
			undefined
	)

	let transferParams: TransferParams | undefined
	let nativeParamsError: string | undefined
	if (actionShapeError == null && action != null) {
		try {
			const validatedTransferParams = actionTypeDefinitionByActionType[ActionType.Transfer].params.assert(
				action.$action.content.params
			)
			transferParams = validatedTransferParams
			if (!Number.isSafeInteger(validatedTransferParams.chainId) || validatedTransferParams.chainId <= 0)
				nativeParamsError = 'Transfer chain ID must be a positive safe integer.'
			else if (validatedTransferParams.tokenAddress.toLowerCase() !== zeroAddress)
				nativeParamsError = 'Only native EVM transfers are supported by this preparation path.'
			else if (validatedTransferParams.amount <= 0n)
				nativeParamsError = 'Transfer amount must be greater than zero.'
		}
		catch {
			nativeParamsError = 'Transfer action parameters are invalid.'
		}
	}

	const normalizedParams = transferParams == null ? undefined : {
		...transferParams,
		fromActor: EvmAddress.assert(transferParams.fromActor.toLowerCase()),
		toActor: EvmAddress.assert(transferParams.toActor.toLowerCase()),
		tokenAddress: EvmAddress.assert(transferParams.tokenAddress.toLowerCase()),
	}
	const nativeParamsReady = (
		actionShapeError == null
		&& nativeParamsError == null
		&& normalizedParams != null
	)
	const selectedWalletConnections = walletConnections.filter(isSelectedWalletConnection)
	const walletConnection = selectedWalletConnections.length === 1 ? selectedWalletConnections[0] : undefined
	const walletAccount = walletConnection?.activeAccount
	const walletAccountError = (
		!nativeParamsReady ?
			undefined
		: selectedWalletConnections.length !== 1 ?
			`Transfer preparation requires exactly one selected wallet connection; received ${selectedWalletConnections.length}.`
		: walletConnection?.connectionKey == null ?
			'Selected wallet connection has no persistent identity.'
		: walletAccount == null ?
			'Selected wallet connection has no active account.'
		: walletAccount.namespace !== Caip2Namespace.Eip155 ?
			'Selected wallet account is not an EIP-155 account.'
		: walletAccount.reference !== String(normalizedParams.chainId) ?
			'Selected wallet account is connected to a different EIP-155 chain.'
		: walletAccount.accountAddress.toLowerCase() !== normalizedParams.fromActor ?
			'Selected wallet account does not match the transfer sender.'
		:
			undefined
	)
	const walletCapabilityError = (
		nativeParamsReady && walletAccountError == null && walletAccount != null
		&& !walletAccount.capabilities.includes(WalletCapability.SendTransaction) ?
			'Selected wallet account does not authorize transaction sending.'
		:
			undefined
	)
	const walletScopeError = (
		nativeParamsReady && walletAccountError == null && walletConnection != null
		&& !walletConnection.scopes.some((scope) => (
			scope.namespace === Caip2Namespace.Eip155
			&& scope.reference === String(normalizedParams.chainId)
			&& scope.methods.includes('eth_sendTransaction')
		)) ?
			'Selected wallet scope does not authorize eth_sendTransaction on the transfer chain.'
		:
			undefined
	)

	const readinessEvidence = ({
		checkId,
		status,
		error,
		checkFields,
		observationFields,
	}: Pick<EvmNativeTransferReadiness, 'checkId' | 'status' | 'error'> & {
		checkFields?: Partial<ReadinessCheckPayload>
		observationFields?: Partial<ReadinessObservationPayload>
	}): EvmNativeTransferReadiness => ({
		checkId,
		status,
		...(error != null && { error }),
		...(action?.sessionId !== session.id ? {} : {
			check: {
				...checkFields,
				sessionId: session.id,
				actionId: action.actionId,
				checkId,
				$sessionAction: {
					[EntityMetaKey.Selector]: {
						sessionId: session.id,
						actionId: action.actionId,
					},
				},
				checkKind: checkId,
				createdAt: timestampMs,
			},
			observation: {
				...observationFields,
				$readinessCheck: {
					[EntityMetaKey.Selector]: {
						sessionId: session.id,
						actionId: action.actionId,
						checkId,
					},
				},
				timestampMs,
				source: checkId === 'rpc-simulation' ? Source.Voltaire_JsonRpc : Source.Local_Internal,
				status,
				...(error != null && { error }),
			},
		}),
	})
	const parameterCheckFields = normalizedParams == null ? {} : {
		networkCaip2: {
			namespace: Caip2Namespace.Eip155,
			reference: String(normalizedParams.chainId),
		},
		accountCaip10: {
			namespace: Caip2Namespace.Eip155,
			reference: String(normalizedParams.chainId),
			accountAddress: normalizedParams.fromActor,
		},
		chainId: normalizedParams.chainId,
		accountAddress: normalizedParams.fromActor,
		tokenAddress: normalizedParams.tokenAddress,
		requiredAmount: normalizedParams.amount,
	}
	const parameterObservationFields = normalizedParams == null ? {} : {
		requiredAmount: normalizedParams.amount,
	}
	const readiness = (
		rpcStatus: EvmNativeTransferReadinessStatus,
		rpcError?: string
	): EvmNativeTransferReadiness[] => [
		readinessEvidence({
			checkId: 'session-locked',
			status: sessionLockError == null ? 'ready' : 'blocked',
			error: sessionLockError,
		}),
		readinessEvidence({
			checkId: 'single-transfer-action',
			status: actionShapeError == null ? 'ready' : 'blocked',
			error: actionShapeError,
		}),
		readinessEvidence({
			checkId: 'native-transfer-params',
			status: actionShapeError != null ? 'not-evaluated' : nativeParamsError == null ? 'ready' : 'blocked',
			error: actionShapeError != null ?
				'Native transfer parameters require one valid Transfer action.'
			: nativeParamsError,
			checkFields: parameterCheckFields,
			observationFields: parameterObservationFields,
		}),
		readinessEvidence({
			checkId: 'wallet-account',
			status: !nativeParamsReady ? 'not-evaluated' : walletAccountError == null ? 'ready' : 'blocked',
			error: !nativeParamsReady ?
				'Wallet account readiness requires valid native transfer parameters.'
			: walletAccountError,
			checkFields: {
				...parameterCheckFields,
				capabilityKey: 'wallet-account',
			},
			observationFields: {
				...parameterObservationFields,
				observedCapabilityStatus: !nativeParamsReady ? 'not-evaluated' : walletAccountError == null ? 'ready' : 'blocked',
			},
		}),
		readinessEvidence({
			checkId: 'send-transaction-capability',
			status: !nativeParamsReady || walletAccountError != null ? 'not-evaluated' : walletCapabilityError == null ? 'ready' : 'blocked',
			error: !nativeParamsReady || walletAccountError != null ?
				'Transaction capability readiness requires a matching connected wallet account.'
			: walletCapabilityError,
			checkFields: {
				...parameterCheckFields,
				capabilityKey: WalletCapability.SendTransaction,
			},
			observationFields: {
				...parameterObservationFields,
				observedCapabilityStatus: !nativeParamsReady || walletAccountError != null ? 'not-evaluated' : walletCapabilityError == null ? 'ready' : 'blocked',
			},
		}),
		readinessEvidence({
			checkId: 'eth-send-transaction-scope',
			status: !nativeParamsReady || walletAccountError != null ? 'not-evaluated' : walletScopeError == null ? 'ready' : 'blocked',
			error: !nativeParamsReady || walletAccountError != null ?
				'Wallet method scope readiness requires a matching connected wallet account.'
			: walletScopeError,
			checkFields: {
				...parameterCheckFields,
				capabilityKey: 'eth_sendTransaction',
			},
			observationFields: {
				...parameterObservationFields,
				observedCapabilityStatus: !nativeParamsReady || walletAccountError != null ? 'not-evaluated' : walletScopeError == null ? 'ready' : 'blocked',
			},
		}),
		readinessEvidence({
			checkId: 'rpc-simulation',
			status: rpcStatus,
			error: rpcError,
			checkFields: parameterCheckFields,
			observationFields: parameterObservationFields,
		}),
	]

	const preparationInputError = (
		sessionLockError
		?? actionShapeError
		?? nativeParamsError
	)
	if (preparationInputError != null || action == null || normalizedParams == null)
		return {
			ready: false,
			error: preparationInputError ?? 'Transfer preparation input is incomplete.',
			readiness: readiness(
				'not-evaluated',
				'RPC simulation requires all local readiness checks to pass.'
			),
		}

	const paramsHash = sha256Text(JSON.stringify([
		'blockhead-evm-native-transfer-v1',
		session.id,
		action.sessionId,
		action.actionId,
		action.$action.content.type,
		{
			chainId: normalizedParams.chainId,
			fromActor: normalizedParams.fromActor,
			toActor: normalizedParams.toActor,
			tokenAddress: normalizedParams.tokenAddress,
			amount: normalizedParams.amount.toString(),
		},
	]))
	const networkCaip2 = {
		namespace: Caip2Namespace.Eip155,
		reference: String(normalizedParams.chainId),
	} as const
	const fromCaip10 = {
		...networkCaip2,
		accountAddress: normalizedParams.fromActor,
	}
	const toCaip10 = {
		...networkCaip2,
		accountAddress: normalizedParams.toActor,
	}
	const intent = {
		sessionId: session.id,
		actionId: action.actionId,
		$sessionAction: {
			[EntityMetaKey.Selector]: {
				sessionId: session.id,
				actionId: action.actionId,
			},
		},
		fromCaip10,
		toCaip10,
		networkCaip2,
		assetCaip19: `${Caip2Namespace.Eip155}:${normalizedParams.chainId}/slip44:60`,
		fromAddress: normalizedParams.fromActor,
		toAddress: normalizedParams.toActor,
		chainId: normalizedParams.chainId,
		tokenAddress: normalizedParams.tokenAddress,
		$fromAccount: { [EntityMetaKey.Selector]: { caip10: fromCaip10 } },
		$toAccount: { [EntityMetaKey.Selector]: { caip10: toCaip10 } },
		$from: { [EntityMetaKey.Selector]: { address: normalizedParams.fromActor } },
		$to: { [EntityMetaKey.Selector]: { address: normalizedParams.toActor } },
		$network: { [EntityMetaKey.Selector]: { caip2: networkCaip2 } },
		$evmNetwork: { [EntityMetaKey.Selector]: { caip2: networkCaip2 } },
		$token: {
			[EntityMetaKey.Selector]: {
				$network: { caip2: networkCaip2 },
				type: CoinInstanceType.NativeCurrency,
			},
		},
		amount: normalizedParams.amount,
	} satisfies BlockheadTransferIntentPayload
	const transaction = {
		from: normalizedParams.fromActor,
		to: normalizedParams.toActor,
		input: '0x',
		value: normalizedParams.amount,
	} as const
	const walletReadinessError = (
		walletAccountError
		?? walletCapabilityError
		?? walletScopeError
	)
	if (walletReadinessError != null)
		return {
			ready: false,
			error: walletReadinessError,
			paramsHash,
			intent,
			readiness: readiness(
				'not-evaluated',
				'RPC simulation requires wallet readiness checks to pass.'
			),
			transaction,
		}
	const simulationId = providedSimulationId ?? globalThis.crypto.randomUUID()

	if (executionTransport == null) {
		const error = 'No EVM execution transport is available for the transfer chain.'
		return {
			ready: false,
			error,
			paramsHash,
			intent,
			readiness: readiness('blocked', error),
			transaction,
			simulation: {
				id: simulationId,
				$session: { [EntityMetaKey.Selector]: { id: session.id } },
				status: 'failed',
				createdAt: timestampMs,
				completedAt: timestampMs,
				paramsHash,
				actionCount: 1,
				error,
			},
		}
	}

	let forkRpcOrigin: typeof UrlString.infer
	try {
		forkRpcOrigin = UrlString.assert(executionTransport.origin)
	}
	catch (cause) {
		const error = `RPC simulation could not capture an execution block: ${cause instanceof Error ? cause.message : String(cause)}`
		return {
			ready: false,
			error,
			paramsHash,
			intent,
			readiness: readiness('blocked', error),
			transaction,
			simulation: {
				id: simulationId,
				$session: { [EntityMetaKey.Selector]: { id: session.id } },
				status: 'failed',
				createdAt: timestampMs,
				completedAt: timestampMs,
				paramsHash,
				actionCount: 1,
				error,
			},
		}
	}

	await onSimulationDispatch?.({
		invocationPayloadHash: paramsHash,
		sourceSelector: {
			caip10: fromCaip10,
		},
		targetSelector: {
			caip10: toCaip10,
		},
	})

	let forkBlockNumber: bigint
	let blockTag: ZeroExHexValue
	try {
		const block = await executionTransport.getBlockByNumber({
			blockNumber: 'latest',
			txObjects: false,
		})
		if (block == null)
			throw new Error('EVM execution transport returned no latest block.')

		blockTag = ZeroExHex.assert(block.number)
		forkBlockNumber = BigInt(blockTag)
	}
	catch (cause) {
		const error = `RPC simulation could not capture an execution block: ${cause instanceof Error ? cause.message : String(cause)}`
		return {
			ready: false,
			error,
			paramsHash,
			intent,
			readiness: readiness('blocked', error),
			transaction,
			simulation: {
				id: simulationId,
				$session: { [EntityMetaKey.Selector]: { id: session.id } },
				status: 'failed',
				createdAt: timestampMs,
				completedAt: timestampMs,
				paramsHash,
				actionCount: 1,
				error,
			},
		}
	}

	const simulationCall = {
		...transaction,
		blockTag,
	}
	const [callResult, gasResult] = await Promise.allSettled([
		executionTransport.getCall(simulationCall),
		executionTransport.estimateGas(simulationCall),
	])
	let callOutput: ZeroExHexValue | undefined
	let callOutputError: string | undefined
	if (callResult.status === 'fulfilled')
		try {
			callOutput = ZeroExHex.assert(callResult.value)
		}
		catch {
			callOutputError = 'EVM execution transport returned malformed eth_call data.'
		}
	const callError = callResult.status === 'rejected' ?
		callResult.reason instanceof Error ? callResult.reason.message : String(callResult.reason)
	: callOutputError
	const gasError = gasResult.status === 'rejected' ? (
		gasResult.reason instanceof Error ? gasResult.reason.message : String(gasResult.reason)
	) : gasResult.value < 0n ?
		'EVM execution transport returned invalid negative eth_estimateGas data.'
	: undefined
	const gasValue = gasResult.status === 'fulfilled' && gasError == null ? gasResult.value : undefined
	const simulationError = [
		...(callError == null ? [] : [`eth_call: ${callError}`]),
		...(gasError == null ? [] : [`eth_estimateGas: ${gasError}`]),
	].join('; ') || undefined
	const simulationCallPayload = {
		simulationId,
		callPath: '0',
		$simulation: { [EntityMetaKey.Selector]: { id: simulationId } },
		depth: 0,
		callIndex: 0,
		callType: 'CALL',
		fromAddress: normalizedParams.fromActor,
		toAddress: normalizedParams.toActor,
		value: normalizedParams.amount,
		inputDataHash: Hash.sha256('0x'),
		...(callOutput != null && {
			outputDataHash: Hash.sha256(callOutput),
		}),
		...(gasValue != null && { gasUsed: gasValue }),
		...(callError == null && { reverted: false }),
		...(simulationError != null && { error: simulationError }),
	} satisfies BlockheadSessionSimulationCallPayload

	if (callError != null || gasValue == null)
		return {
			ready: false,
			error: simulationError,
			paramsHash,
			intent,
			readiness: readiness('blocked', simulationError),
			transaction,
			simulation: {
				id: simulationId,
				$session: { [EntityMetaKey.Selector]: { id: session.id } },
				status: 'failed',
				createdAt: timestampMs,
				completedAt: timestampMs,
				paramsHash,
				forkBlockNumber,
				forkRpcOrigin,
				actionCount: 1,
				...(gasValue != null && { gasUsed: gasValue }),
				error: simulationError,
			},
			simulationCall: simulationCallPayload,
		}

	const resultPayloadHash = sha256Text(JSON.stringify([
		callOutput,
		gasValue?.toString(),
		forkBlockNumber.toString(),
		forkRpcOrigin,
	]))
	return {
		ready: true,
		paramsHash,
		intent,
		readiness: readiness('ready'),
		transaction,
		simulation: {
			id: simulationId,
			$session: { [EntityMetaKey.Selector]: { id: session.id } },
			status: 'succeeded',
			createdAt: timestampMs,
			completedAt: timestampMs,
			paramsHash,
			forkBlockNumber,
			forkRpcOrigin,
			actionCount: 1,
			gasUsed: gasValue,
			resultPayloadHash,
		},
		simulationCall: simulationCallPayload,
	}
}

const transferParamsFromAction = (
	action: SessionAction | undefined
) => {
	if (action?.$action.content.type !== ActionType.Transfer)
		return undefined

	try {
		return actionTypeDefinitionByActionType[ActionType.Transfer].params.assert(
			action.$action.content.params
		)
	} catch {
		return undefined
	}
}

const readinessStatus = (
	preparation: EvmNativeTransferPreparation,
	checkId: EvmNativeTransferReadinessCheckId
) => (
	preparation.readiness.find((check) => check.checkId === checkId)?.status
)

const shouldRetryPreparationOnNextTransport = (
	preparation: EvmNativeTransferPreparation
) => (
	!preparation.ready
	&& readinessStatus(preparation, 'session-locked') === 'ready'
	&& readinessStatus(preparation, 'single-transfer-action') === 'ready'
	&& readinessStatus(preparation, 'native-transfer-params') === 'ready'
	&& readinessStatus(preparation, 'wallet-account') === 'ready'
	&& readinessStatus(preparation, 'send-transaction-capability') === 'ready'
	&& readinessStatus(preparation, 'eth-send-transaction-scope') === 'ready'
	&& readinessStatus(preparation, 'rpc-simulation') === 'blocked'
)

export const applyEvmNativeTransferPreparation = async ({
	context,
	session,
	actions,
	walletConnections,
	executionTransportsByChainId = voltaireJsonRpcTransports.httpTransportsByChainId,
	simulationId,
	timestampMs,
}: {
	context: LocalMutationContext
	session: Session
	actions: readonly SessionAction[]
	walletConnections: readonly WalletConnection[]
	executionTransportsByChainId?: Partial<Record<number, readonly EvmNativeTransferExecutionTransport[]>>
	simulationId?: string
	timestampMs?: number
}) => {
	const action = actions.length === 1 ? actions[0] : undefined
	const transferParams = transferParamsFromAction(action)
	const preparationTimestampMs = timestampMs ?? Date.now()
	const preparationId = simulationId ?? globalThis.crypto.randomUUID()
	const lifecycleId = Hash32.assert(sha256Text(JSON.stringify([
		'evm-native-transfer-preparation-lifecycle',
		session.id,
		action?.actionId,
		preparationId,
		preparationTimestampMs,
	])))
	const executionTransports = (
		transferParams != null
		&& Number.isSafeInteger(transferParams.chainId)
		&& transferParams.chainId > 0
		&& transferParams.tokenAddress.toLowerCase() === zeroAddress
		&& transferParams.amount > 0n
	) ? (executionTransportsByChainId[transferParams.chainId] ?? []) : []
	let simulationDispatched = false

	let preparation = await prepareEvmNativeTransfer({
		session,
		actions,
		walletConnections,
		executionTransport: executionTransports[0],
		onSimulationDispatch: action == null ? undefined : async ({
			invocationPayloadHash,
			sourceSelector,
			targetSelector,
		}) => {
			await writeLocalBlockheadIntentInvocation(
				context,
				{ id: session.id },
				{
					invocationId: lifecycleId,
					modality: 'click',
					sourceEntityType: EntityType.Account,
					sourceSelector,
					targetEntityType: EntityType.Account,
					targetSelector,
					sourcePlacement: 'From',
					targetPlacement: 'To',
					invocationPayloadHash,
					resolvedIntentType: EntityType.BlockheadTransferIntent,
					intentDefinitionKey: ActionType.Transfer,
					createdAt: preparationTimestampMs,
					createdAction: {
						sessionId: session.id,
						actionId: action.actionId,
					},
				}
			)
			simulationDispatched = true
		},
		simulationId: preparationId,
		timestampMs: preparationTimestampMs,
	})
	if (shouldRetryPreparationOnNextTransport(preparation)) {
		for (const executionTransport of executionTransports.slice(1)) {
			preparation = await prepareEvmNativeTransfer({
				session,
				actions,
				walletConnections,
				executionTransport,
				simulationId: preparationId,
				timestampMs: preparationTimestampMs,
			})
			if (preparation.ready || !shouldRetryPreparationOnNextTransport(preparation))
				break
		}
	}
	const readinessChecks = preparation.readiness.flatMap(({ check, observation }) => (
		check != null && observation != null ? [{
			check,
			observation,
		}] : []
	))
	await Promise.all([
		...(preparation.intent == null ? [] : [
			writeLocalBlockheadTransferIntent(context, preparation.intent),
		]),
		...(readinessChecks.length === 0 ? [] : [
			writeLocalBlockheadActionReadinessChecks(
				context,
				{
					sessionId: readinessChecks[0].check.sessionId,
					actionId: readinessChecks[0].check.actionId,
				} satisfies EntitySelector<typeof schema, EntityType.BlockheadSessionAction>,
				readinessChecks
			),
		]),
		...(preparation.simulation == null ? [] : [
			writeLocalBlockheadSessionSimulation(
				context,
				{ id: session.id },
				preparation.simulation,
				preparation.simulationCall == null ? [] : [preparation.simulationCall]
			),
		]),
	])

	if (
		!preparation.ready
		|| action == null
	) {
		// oxlint-disable-next-line typescript/no-unnecessary-condition -- The awaited dispatch callback mutates this state before an RPC result returns.
		if (action != null && preparation.simulation != null && simulationDispatched) {
			const outcomePayloadHash = Hash32.assert(sha256Text(JSON.stringify([
				preparation.simulation.id,
				preparation.paramsHash,
				preparation.error,
			])))
			await writeLocalBlockheadActionOutcome(
				context,
				{
					sessionId: session.id,
					actionId: action.actionId,
				},
				{
					outcomeId: lifecycleId,
					outcomeKind: 'simulation',
					simulation: {
						id: preparation.simulation.id,
					},
					createdAt: preparation.simulation.createdAt,
					outcomePayloadHash,
				},
				{
					timestampMs: preparation.simulation.completedAt ?? preparation.simulation.createdAt,
					source: Source.Local_Internal,
					status: 'failed',
					sourcePayloadHash: outcomePayloadHash,
					...(preparation.error != null && { error: preparation.error }),
				}
			)
		}

		return preparation
	}

	const selectedWalletConnections = walletConnections.filter(isSelectedWalletConnection)
	const walletConnection = selectedWalletConnections.length === 1 ? selectedWalletConnections[0] : undefined
	const walletAccount = walletConnection?.activeAccount
	const connectionKey = walletConnection?.connectionKey
	if (walletConnection == null || walletAccount == null || connectionKey == null)
		return {
			...preparation,
			ready: false,
			error: 'Preparation could not bind a wallet request to the selected connection.',
		}

	const walletRequestSelector = {
		id: Hash32.assert(sha256Text(JSON.stringify([
			'evm-native-transfer',
			session.id,
			action.actionId,
			preparation.paramsHash,
			connectionKey,
			preparation.simulation.id,
		]))),
	} as const satisfies EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
	const requestPayloadHash = Hash32.assert(sha256Text(JSON.stringify([
		1,
		'eth_sendTransaction',
		{
			namespace: walletAccount.namespace,
			reference: walletAccount.reference,
			accountAddress: walletAccount.accountAddress.toLowerCase(),
		},
		{
			from: preparation.transaction.from,
			to: preparation.transaction.to,
			input: preparation.transaction.input,
			value: preparation.transaction.value.toString(),
		},
		preparation.simulation.id,
		preparation.paramsHash,
	])))
	const requestedAt = preparationTimestampMs
	try {
		try {
			await writeLocalBlockheadWalletRequest(context, {
				id: walletRequestSelector.id,
				sessionAction: {
					sessionId: session.id,
					actionId: action.actionId,
				},
				walletConnection: {
					connectionKey,
				},
				account: {
					caip10: {
						namespace: walletAccount.namespace,
						reference: walletAccount.reference,
						accountAddress: EvmAddress.assert(walletAccount.accountAddress.toLowerCase()),
					},
				},
				requestKind: 'transaction',
				requestMethod: 'eth_sendTransaction',
				requestPayloadHash,
				requestedAt,
				evm: {
					network: preparation.intent.$network[EntityMetaKey.Selector],
					simulation: {
						id: preparation.simulation.id,
					},
					calls: [{
						toAddress: preparation.transaction.to,
						value: preparation.transaction.value,
						inputDataHash: (
							preparation.simulationCall?.inputDataHash
							?? Hash.sha256(preparation.transaction.input)
						),
					}],
				},
			}, walletConnections)
		}
		catch (error) {
			if (!(error instanceof Error) || !error.message.startsWith('Wallet request definition already exists:'))
				throw error
		}
		await writeLocalBlockheadWalletRequest_Timestamp(context, walletRequestSelector, {
			timestampMs: requestedAt,
			source: Source.Local_Internal,
			status: 'prepared',
		})
	}
	catch (error) {
		const preparationError = `Preparation could not save the wallet request: ${error instanceof Error ? error.message : String(error)}`
		const outcomePayloadHash = Hash32.assert(sha256Text(JSON.stringify([
			preparation.simulation.id,
			preparation.paramsHash,
			preparationError,
		])))
		await writeLocalBlockheadActionOutcome(
			context,
			{
				sessionId: session.id,
				actionId: action.actionId,
			},
			{
				outcomeId: lifecycleId,
				outcomeKind: 'wallet-request',
				simulation: {
					id: preparation.simulation.id,
				},
				createdAt: requestedAt,
				outcomePayloadHash,
			},
			{
				timestampMs: requestedAt,
				source: Source.Local_Internal,
				status: 'failed',
				sourcePayloadHash: outcomePayloadHash,
				error: preparationError,
			}
		)
		return {
			...preparation,
			ready: false,
			error: preparationError,
		}
	}
	await writeLocalBlockheadActionOutcome(
		context,
		{
			sessionId: session.id,
			actionId: action.actionId,
		},
		{
			outcomeId: lifecycleId,
			outcomeKind: 'wallet-request',
			walletRequest: walletRequestSelector,
			simulation: {
				id: preparation.simulation.id,
			},
			createdAt: requestedAt,
			outcomePayloadHash: requestPayloadHash,
		},
		{
			timestampMs: requestedAt,
			source: Source.Local_Internal,
			status: 'prepared',
			sourcePayloadHash: requestPayloadHash,
		}
	)

	return {
		...preparation,
		walletRequest: walletRequestSelector,
	}
}
