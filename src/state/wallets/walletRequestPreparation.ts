import { WalletCapability } from '$/constants/Wallet.ts'
import type { WalletAccount, WalletConnection } from './adapters/types.ts'
import {
	isSelectedWalletConnection,
	walletConnectionKey,
} from './walletConnectionState.ts'


export type SelectedConnectedWallet = Extract<
	WalletConnection,
	{
		selected: true
	}
>

export type WalletRequestCallPreparation = {
	toAddress?: string
	value?: bigint
	inputDataHash: string
}

export type WalletPrepSelectionReady = {
	ready: true
	connection: SelectedConnectedWallet
	connectionKey: string
	account: WalletAccount
}

export type WalletPrepSelectionBlocked = {
	ready: false
	error: string
}

export type WalletPrepSelection = WalletPrepSelectionReady | WalletPrepSelectionBlocked

export type WalletTransactionPrepGateReady = WalletPrepSelectionReady & {
	requestMethod: string
	capability: WalletCapability
}

export type WalletTransactionPrepGate = WalletTransactionPrepGateReady | WalletPrepSelectionBlocked

export type WalletRequestCallsPreparation =
	| {
		ready: true
		calls: readonly WalletRequestCallPreparation[]
	}
	| {
		ready: false
		error: string
	}

export type PreparedWalletRequestObservation = {
	status: 'prepared'
	submittedAt?: undefined
}

export type ExecutableWalletRequestPrepReady = {
	ready: true
	gate: WalletTransactionPrepGateReady
	calls: readonly WalletRequestCallPreparation[]
	observation: PreparedWalletRequestObservation
}

export type ExecutableWalletRequestPrep =
	| ExecutableWalletRequestPrepReady
	| WalletPrepSelectionBlocked
	| Extract<WalletRequestCallsPreparation, { ready: false }>


export const selectedConnectedWalletConnections = (
	connections: readonly WalletConnection[]
) => (
	connections.filter(isSelectedWalletConnection)
)

export const resolveWalletPrepSelection = (
	connections: readonly WalletConnection[]
): WalletPrepSelection => {
	const selected = selectedConnectedWalletConnections(connections)
	if (selected.length !== 1)
		return {
			ready: false,
			error: `Wallet request preparation requires exactly one selected wallet connection; received ${selected.length}.`,
		}

	const connection = selected[0]
	const connectionKey = connection.connectionKey
	if (connectionKey == null || connectionKey === '')
		return {
			ready: false,
			error: 'Selected wallet connection has no connectionKey for request binding.',
		}

	const account = connection.activeAccount
	if (account == null)
		return {
			ready: false,
			error: 'Selected wallet connection has no active account.',
		}

	return {
		ready: true,
		connection,
		connectionKey,
		account,
	}
}

export const resolveWalletTransactionPrepGate = ({
	connections,
	namespace,
	reference,
	accountAddress,
	requestMethod = 'eth_sendTransaction',
	capability = WalletCapability.SendTransaction,
}: {
	connections: readonly WalletConnection[]
	namespace: string
	reference: string
	accountAddress: string
	requestMethod?: string
	capability?: WalletCapability
}): WalletTransactionPrepGate => {
	const selection = resolveWalletPrepSelection(connections)
	if (!selection.ready)
		return selection

	const { account, connection } = selection
	if (account.namespace !== namespace)
		return {
			ready: false,
			error: `Selected wallet account is not a ${namespace} account.`,
		}
	if (account.reference !== reference)
		return {
			ready: false,
			error: 'Selected wallet account is connected to a different chain.',
		}
	if (account.accountAddress.toLowerCase() !== accountAddress.toLowerCase())
		return {
			ready: false,
			error: 'Selected wallet account does not match the request sender.',
		}
	if (!account.capabilities.includes(capability))
		return {
			ready: false,
			error: 'Selected wallet account does not authorize transaction sending.',
		}
	if (!connection.scopes.some((scope) => (
		scope.namespace === namespace
		&& scope.reference === reference
		&& scope.methods.includes(requestMethod)
	)))
		return {
			ready: false,
			error: `Selected wallet scope does not authorize ${requestMethod} on the request chain.`,
		}

	return {
		...selection,
		requestMethod,
		capability,
	}
}

/** Ordered BlockheadWalletRequestCall rows are required for executable prep; empty batches are not preparable. */
export const resolveWalletRequestCallsPreparation = (
	calls: readonly WalletRequestCallPreparation[]
): WalletRequestCallsPreparation => (
	calls.length === 0 ?
		{
			ready: false,
			error: 'Wallet request preparation requires at least one BlockheadWalletRequestCall.',
		}
	: calls.some((call) => call.inputDataHash === '') ?
		{
			ready: false,
			error: 'Each BlockheadWalletRequestCall requires a non-empty inputDataHash.',
		}
	:
		{
			ready: true,
			calls,
		}
)

/** Prep-without-send: prepared local requests never carry submittedAt or a public tx hash binding. */
export const preparedWalletRequestObservation = (): PreparedWalletRequestObservation => ({
	status: 'prepared',
})

export const resolveExecutableWalletRequestPrep = ({
	connections,
	namespace,
	reference,
	accountAddress,
	calls,
	requestMethod = 'eth_sendTransaction',
	capability = WalletCapability.SendTransaction,
}: {
	connections: readonly WalletConnection[]
	namespace: string
	reference: string
	accountAddress: string
	calls: readonly WalletRequestCallPreparation[]
	requestMethod?: string
	capability?: WalletCapability
}): ExecutableWalletRequestPrep => {
	const gate = resolveWalletTransactionPrepGate({
		connections,
		namespace,
		reference,
		accountAddress,
		requestMethod,
		capability,
	})
	if (!gate.ready)
		return gate

	const callBatch = resolveWalletRequestCallsPreparation(calls)
	if (!callBatch.ready)
		return callBatch

	return {
		ready: true,
		gate,
		calls: callBatch.calls,
		observation: preparedWalletRequestObservation(),
	}
}

export const isPreparedWalletRequestWithoutSend = (
	request: {
		submittedAt?: number
		status?: string
		evmTransactionIds?: readonly string[]
	}
) => (
	request.submittedAt == null
	&& request.status === 'prepared'
	&& (request.evmTransactionIds?.length ?? 0) === 0
)

export const walletPrepSelectionKey = (
	selection: WalletPrepSelectionReady
) => (
	walletConnectionKey(selection.connection)
)
