import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'

import {
	type ActionParamsByActionType,
	ActionType,
	actionTypeDefinitionByActionType,
	zeroAddress,
} from '$/constants/actions.ts'
import { Caip2Namespace } from '$/constants/Network.ts'
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
	writeLocalBlockheadIntentQuote,
	writeLocalBlockheadSessionSimulation,
	writeLocalBlockheadSwapIntent,
	writeLocalBlockheadWalletRequest,
	writeLocalBlockheadWalletRequest_Timestamp,
} from '$/collections/localMutations.ts'
import { Source } from '$/sources/Source.ts'
import type { WalletConnection } from '$/state/wallets/adapters/types.ts'
import { isSelectedWalletConnection } from '$/state/wallets/walletConnectionState.ts'
import { resolveWalletTransactionPrepGate } from '$/state/wallets/walletRequestPreparation.ts'


// Types

type SwapParams = ActionParamsByActionType[ActionType.Swap]
type Session = Pick<
	EntityFieldValues<typeof schema, EntityType.BlockheadSession>,
	'id' | 'lockedAt'
>
type SessionAction = Pick<
	EntityFieldValues<typeof schema, EntityType.BlockheadSessionAction>,
	'sessionId' | 'actionId' | 'indexInSequence' | 'actionType' | 'actionParams' | 'selectedProtocol'
>
type PreparedCall = {
	from: typeof EvmAddress.infer
	to: typeof EvmAddress.infer
	input: typeof ZeroExHex.infer
	value: bigint
}

export type EvmSwapQuoteSource = {
	source: Source
	getQuote(request: SwapParams & {
		fromAddress: typeof EvmAddress.infer
	}): Promise<{
		id: string
		providerProtocol: string
		amountOut: bigint
		amountOutMin?: bigint
		validUntil?: number
		estimatedFillSeconds?: number
		preparedCall: {
			from: string
			to: string
			input: string
			value: bigint
		}
	}>
}

export type EvmSwapSimulationTransport = {
	origin: string
	getBlockNumber(): Promise<bigint>
	simulate(call: PreparedCall & {
		blockNumber: bigint
	}): Promise<{
		output: string
		gasUsed: bigint
	}>
}

export type EvmSwapPreparation = {
	ready: true
	intent: Omit<
		EntityFieldValues<typeof schema, EntityType.BlockheadSwapIntent>,
		'$$quotes'
	> & {
		$network: NonNullable<EntityFieldValues<
			typeof schema,
			EntityType.BlockheadSwapIntent
		>['$network']>
	}
	quote: Omit<
		EntityFieldValues<typeof schema, EntityType.BlockheadIntentQuote>,
		'$$timestamps' | 'requestSummary'
	> & {
		requestSummary?: object
	}
	quoteObservation: Omit<
		EntityFieldValues<typeof schema, EntityType.BlockheadIntentQuote_Timestamp>,
		'inputPreview' | 'outputPreview'
	> & {
		inputPreview?: object
		outputPreview?: object
	}
	preparedCall: PreparedCall
	simulation: Omit<
		EntityFieldValues<typeof schema, EntityType.BlockheadSessionSimulation>,
		'$$calls' | '$$logs'
	>
	simulationCall: EntityFieldValues<typeof schema, EntityType.BlockheadSessionSimulationCall>
	walletRequest: EntitySelector<typeof schema, EntityType.BlockheadWalletRequest>
}


// Functions

const sha256Text = (value: string) => Hash32.assert(Hash.sha256(Hex.fromString(value)))

export const prepareEvmSwap = async ({
	session,
	action,
	fromAddress,
	walletConnections,
	quoteSource,
	simulationTransport,
	simulationId = globalThis.crypto.randomUUID(),
	timestampMs = Date.now(),
}: {
	session: Session
	action: SessionAction
	fromAddress: string
	walletConnections: readonly WalletConnection[]
	quoteSource: EvmSwapQuoteSource
	simulationTransport: EvmSwapSimulationTransport
	simulationId?: string
	timestampMs?: number
}): Promise<EvmSwapPreparation> => {
	if (session.lockedAt == null)
		throw new Error('Session must be locked before swap preparation.')
	if (
		action.sessionId !== session.id
		|| action.indexInSequence !== 0
		|| action.actionType !== ActionType.Swap
	)
		throw new Error('Swap preparation requires the leading Swap action from the locked session.')

	const params = actionTypeDefinitionByActionType[ActionType.Swap].params.assert(action.actionParams ?? {})
	if (params.amount <= 0n)
		throw new Error('Swap amount must be greater than zero.')
	if (params.tokenIn.toLowerCase() === params.tokenOut.toLowerCase())
		throw new Error('Swap input and output tokens must differ.')

	const normalizedFromAddress = EvmAddress.assert(fromAddress.toLowerCase())
	const walletGate = resolveWalletTransactionPrepGate({
		connections: walletConnections,
		namespace: Caip2Namespace.Eip155,
		reference: String(params.chainId),
		accountAddress: normalizedFromAddress,
	})
	if (!walletGate.ready)
		throw new Error(walletGate.error)

	const networkCaip2 = {
		namespace: Caip2Namespace.Eip155,
		reference: String(params.chainId),
	} as const
	const tokenSelector = (address: typeof EvmAddress.infer) => ({
		$network: {
			caip2: networkCaip2,
		},
		...(
			address === zeroAddress ?
				{
					type: CoinInstanceType.NativeCurrency,
				}
			:
				{
					type: CoinInstanceType.Erc20Token,
					address,
				}
		),
	})
	const intent = {
		sessionId: session.id,
		actionId: action.actionId,
		$sessionAction: {
			[EntityMetaKey.Selector]: {
				sessionId: session.id,
				actionId: action.actionId,
			},
		},
		networkCaip2,
		assetInCaip19: params.tokenIn === zeroAddress ?
			`eip155:${params.chainId}/slip44:60`
		:
			`eip155:${params.chainId}/erc20:${params.tokenIn}`,
		assetOutCaip19: params.tokenOut === zeroAddress ?
			`eip155:${params.chainId}/slip44:60`
		:
			`eip155:${params.chainId}/erc20:${params.tokenOut}`,
		chainId: params.chainId,
		tokenInAddress: params.tokenIn,
		tokenOutAddress: params.tokenOut,
		$network: { [EntityMetaKey.Selector]: { caip2: networkCaip2 } },
		$evmNetwork: { [EntityMetaKey.Selector]: { caip2: networkCaip2 } },
		$tokenIn: { [EntityMetaKey.Selector]: tokenSelector(params.tokenIn) },
		$tokenOut: { [EntityMetaKey.Selector]: tokenSelector(params.tokenOut) },
		amount: params.amount,
		slippage: params.slippage,
	} satisfies EvmSwapPreparation['intent']
	const quoteRequestHash = sha256Text(JSON.stringify([
		params.chainId,
		params.tokenIn,
		params.tokenOut,
		params.amount.toString(),
		params.slippage,
		normalizedFromAddress,
	]))
	const sourceQuote = await quoteSource.getQuote({
		...params,
		fromAddress: normalizedFromAddress,
	})
	const preparedCall = {
		from: EvmAddress.assert(sourceQuote.preparedCall.from.toLowerCase()),
		to: EvmAddress.assert(sourceQuote.preparedCall.to.toLowerCase()),
		input: ZeroExHex.assert(sourceQuote.preparedCall.input),
		value: sourceQuote.preparedCall.value,
	}
	if (preparedCall.from !== normalizedFromAddress)
		throw new Error('Swap quote sender does not match the selected wallet account.')
	if (sourceQuote.amountOut <= 0n)
		throw new Error('Swap quote output must be greater than zero.')

	const quotePayloadHash = sha256Text(JSON.stringify([
		sourceQuote.id,
		sourceQuote.providerProtocol,
		sourceQuote.amountOut.toString(),
		sourceQuote.amountOutMin?.toString(),
		sourceQuote.validUntil,
		preparedCall.from,
		preparedCall.to,
		preparedCall.input,
		preparedCall.value.toString(),
	]))
	const quote = {
		id: sha256Text(JSON.stringify([
			'swap-quote',
			session.id,
			action.actionId,
			quoteRequestHash,
			sourceQuote.id,
		])),
		source: quoteSource.source,
		quoteRequestHash,
		$sessionAction: intent.$sessionAction,
		providerProtocol: sourceQuote.providerProtocol,
		intentType: ActionType.Swap,
		userInteropAddress: normalizedFromAddress,
		requestedAt: timestampMs,
		requestPayloadHash: quoteRequestHash,
		requestSummary: {
			chainId: params.chainId,
			tokenIn: params.tokenIn,
			tokenOut: params.tokenOut,
			amount: params.amount.toString(),
			slippage: params.slippage,
		},
	} satisfies EvmSwapPreparation['quote']
	const quoteObservation = {
		$quote: { [EntityMetaKey.Selector]: { id: quote.id } },
		timestampMs,
		source: quoteSource.source,
		quoteId: sourceQuote.id,
		validUntil: sourceQuote.validUntil,
		estimatedFillSeconds: sourceQuote.estimatedFillSeconds,
		inputPreview: {
			amount: params.amount.toString(),
			token: params.tokenIn,
		},
		outputPreview: {
			amount: sourceQuote.amountOut.toString(),
			...(sourceQuote.amountOutMin != null && {
				minimumAmount: sourceQuote.amountOutMin.toString(),
			}),
			token: params.tokenOut,
		},
		quotePayloadHash,
	} satisfies EntityFieldValues<typeof schema, EntityType.BlockheadIntentQuote_Timestamp>

	const blockNumber = await simulationTransport.getBlockNumber()
	const simulationResult = await simulationTransport.simulate({
		...preparedCall,
		blockNumber,
	})
	const output = ZeroExHex.assert(simulationResult.output)
	const paramsHash = sha256Text(JSON.stringify([
		quotePayloadHash,
		blockNumber.toString(),
		simulationTransport.origin,
	]))
	const simulation = {
		id: simulationId,
		$session: { [EntityMetaKey.Selector]: { id: session.id } },
		status: 'succeeded',
		createdAt: timestampMs,
		completedAt: timestampMs,
		paramsHash,
		forkBlockNumber: blockNumber,
		forkRpcOrigin: UrlString.assert(simulationTransport.origin),
		actionCount: 1,
		gasUsed: simulationResult.gasUsed,
		resultPayloadHash: sha256Text(JSON.stringify([
			Hash.sha256(output),
			simulationResult.gasUsed.toString(),
		])),
	} satisfies EvmSwapPreparation['simulation']
	const simulationCall = {
		simulationId,
		callPath: '0',
		$simulation: { [EntityMetaKey.Selector]: { id: simulationId } },
		depth: 0,
		callIndex: 0,
		callType: 'CALL',
		fromAddress: preparedCall.from,
		toAddress: preparedCall.to,
		value: preparedCall.value,
		inputSelector: preparedCall.input.length >= 10 ? ZeroExHex.assert(preparedCall.input.slice(0, 10)) : undefined,
		inputDataHash: Hash.sha256(preparedCall.input),
		outputDataHash: Hash.sha256(output),
		gasUsed: simulationResult.gasUsed,
		reverted: false,
	} satisfies EvmSwapPreparation['simulationCall']
	const walletRequest = {
		id: sha256Text(JSON.stringify([
			'evm-swap-prepared-request',
			session.id,
			action.actionId,
			quote.id,
			simulation.id,
			walletGate.connectionKey,
		])),
	}

	return {
		ready: true,
		intent,
		quote,
		quoteObservation,
		preparedCall,
		simulation,
		simulationCall,
		walletRequest,
	}
}

export const applyEvmSwapPreparation = async ({
	context,
	session,
	action,
	fromAddress,
	walletConnections,
	quoteSource,
	simulationTransport,
	simulationId,
	timestampMs,
}: Parameters<typeof prepareEvmSwap>[0] & {
	context: LocalMutationContext
}) => {
	const preparation = await prepareEvmSwap({
		session,
		action,
		fromAddress,
		walletConnections,
		quoteSource,
		simulationTransport,
		simulationId,
		timestampMs,
	})
	const sessionActionSelector = {
		sessionId: session.id,
		actionId: action.actionId,
	}
	const swapIntentSelector = await writeLocalBlockheadSwapIntent(context, preparation.intent)
	await Promise.all([
		writeLocalBlockheadIntentQuote(
			context,
			sessionActionSelector,
			swapIntentSelector,
			preparation.quote,
			preparation.quoteObservation
		),
		writeLocalBlockheadSessionSimulation(
			context,
			{ id: session.id },
			preparation.simulation,
			preparation.simulationCall
		),
	])
	const selectedWalletConnections = walletConnections.filter(isSelectedWalletConnection)
	const selectedWallet = selectedWalletConnections.length === 1 ? selectedWalletConnections[0] : undefined
	if (selectedWallet?.connectionKey == null || selectedWallet.activeAccount == null)
		throw new Error('Swap preparation lost the selected wallet binding.')

	await writeLocalBlockheadWalletRequest(context, {
		id: preparation.walletRequest.id,
		sessionAction: sessionActionSelector,
		walletConnection: {
			connectionKey: selectedWallet.connectionKey,
		},
		account: {
			caip10: {
				namespace: selectedWallet.activeAccount.namespace,
				reference: selectedWallet.activeAccount.reference,
				accountAddress: selectedWallet.activeAccount.accountAddress,
			},
		},
		requestKind: 'transaction',
		requestMethod: 'eth_sendTransaction',
		requestPayloadHash: sha256Text(JSON.stringify([
			preparation.preparedCall.from,
			preparation.preparedCall.to,
			preparation.preparedCall.input,
			preparation.preparedCall.value.toString(),
		])),
		requestedAt: timestampMs ?? preparation.simulation.createdAt,
		evm: {
			network: preparation.intent.$network[EntityMetaKey.Selector],
			simulation: {
				id: preparation.simulation.id,
			},
			calls: [{
				toAddress: preparation.preparedCall.to,
				value: preparation.preparedCall.value,
				inputDataHash: preparation.simulationCall.inputDataHash ?? Hash.sha256(preparation.preparedCall.input),
			}],
		},
	}, walletConnections)
	await writeLocalBlockheadWalletRequest_Timestamp(context, preparation.walletRequest, {
		timestampMs: timestampMs ?? preparation.simulation.createdAt,
		source: Source.Local_Internal,
		status: 'prepared',
	})

	return preparation
}
