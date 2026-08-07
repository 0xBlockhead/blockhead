import type {
	QuilibriumAccountAllowanceReference,
	QuilibriumBalanceAccountResponse,
	QuilibriumDecryptableBalanceAccountRequest,
	QuilibriumDecryptablePendingTransactionsAccountRequest,
	QuilibriumDeliveryMethod,
	QuilibriumGrpcUnaryCall,
	QuilibriumKeyRing,
	QuilibriumPendingTransactionsAccountResponse,
	QuilibriumSignature,
} from '$/sources/QuilibriumNodeRpc/Grpc/types.ts'
import {
	balanceAccountResponseWire,
	pendingTransactionsAccountResponseWire,
} from '$/sources/QuilibriumNodeRpc/Grpc/types.ts'


export type QuilibriumNodeRpcAccountAuth = {
	keyRing: QuilibriumKeyRing
	allowance?: QuilibriumAccountAllowanceReference
	signature?: QuilibriumSignature
	deliveryMethod?: QuilibriumDeliveryMethod
}

export type QuilibriumNodeRpcAccountAuthResolver = (
	params: {
		connectionId: string
		accountAddress: string
	}
) => QuilibriumNodeRpcAccountAuth | undefined


const implicitAccountAddress = /^0x([0-9a-fA-F]{64})$/

export const implicitAccountReference = (
	accountAddress: string
) => {
	const addressMatch = implicitAccountAddress.exec(accountAddress)
	if (addressMatch == null)
		throw new Error('QuilibriumNodeRpc_Grpc: implicit account address must be 0x-prefixed 32-byte hex')

	return {
		implicitAccount: {
			implicitType: 0,
			address: Uint8Array.from(
				addressMatch[1].match(/.{2}/g) ?? [],
				(byte) => Number.parseInt(byte, 16)
			),
		},
	}
}

const originatedAccountAddress = /^0x([0-9a-fA-F]+)$/

export const originatedAccountReference = (
	accountAddress: string
) => {
	const addressMatch = originatedAccountAddress.exec(accountAddress)
	if (addressMatch == null || addressMatch[1].length === 0 || addressMatch[1].length % 2 !== 0)
		throw new Error('QuilibriumNodeRpc_Grpc: originated account address must be 0x-prefixed hex')

	return {
		originatedAccount: {
			address: Uint8Array.from(
				addressMatch[1].match(/.{2}/g) ?? [],
				(byte) => Number.parseInt(byte, 16)
			),
		},
	}
}

export const accountReferenceForAddress = (
	accountAddress: string
) => {
	try {
		return implicitAccountReference(accountAddress)
	} catch {
		return originatedAccountReference(accountAddress)
	}
}

const accountService = 'quilibrium.node.node.pb.AccountService'

let grpcUnaryCall: QuilibriumGrpcUnaryCall | undefined
let accountAuthResolver: QuilibriumNodeRpcAccountAuthResolver | undefined

export const setQuilibriumNodeRpcGrpcUnaryCall = (
	callUnary: QuilibriumGrpcUnaryCall | undefined
) => {
	grpcUnaryCall = callUnary
}

export const setQuilibriumNodeRpcAccountAuthResolver = (
	resolver: QuilibriumNodeRpcAccountAuthResolver | undefined
) => {
	accountAuthResolver = resolver
}

const requireUnaryCall = (
	callUnary: QuilibriumGrpcUnaryCall | undefined
) => {
	const resolved = callUnary ?? grpcUnaryCall
	if (resolved == null)
		throw new Error('QuilibriumNodeRpc_Grpc: gRPC unary call is not configured')
	return resolved
}

export const requireAccountAuth = (
	params: {
		connectionId: string
		accountAddress: string
	}
) => {
	const auth = accountAuthResolver?.(params)
	if (auth == null)
		throw new Error(`QuilibriumNodeRpc_Grpc: no key-ring auth for connection ${params.connectionId}`)
	return auth
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`QuilibriumNodeRpc_Grpc: invalid ${label} response envelope`)
	}
}

export const getAccountBalance = async ({
	callUnary,
	request,
}: {
	callUnary?: QuilibriumGrpcUnaryCall
	request: QuilibriumDecryptableBalanceAccountRequest
}) => (
	assertEnvelope(
		'GetBalance',
		balanceAccountResponseWire,
		await requireUnaryCall(callUnary)<
			QuilibriumDecryptableBalanceAccountRequest,
			QuilibriumBalanceAccountResponse
		>({
			service: accountService,
			method: 'GetBalance',
			request,
		})
	)
)

export const listPendingTransactions = async ({
	callUnary,
	request,
}: {
	callUnary?: QuilibriumGrpcUnaryCall
	request: QuilibriumDecryptablePendingTransactionsAccountRequest
}) => (
	assertEnvelope(
		'ListPendingTransactions',
		pendingTransactionsAccountResponseWire,
		await requireUnaryCall(callUnary)<
			QuilibriumDecryptablePendingTransactionsAccountRequest,
			QuilibriumPendingTransactionsAccountResponse
		>({
			service: accountService,
			method: 'ListPendingTransactions',
			request,
		})
	)
)
