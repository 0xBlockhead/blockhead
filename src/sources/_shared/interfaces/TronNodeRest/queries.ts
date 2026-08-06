import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	TronNodeAccount,
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import {
	tronNodeAccountWire,
	tronNodeBlockWire,
	tronNodeTransactionInfoWire,
	tronNodeTransactionWire,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import { postJson } from '$/sources/_shared/wire/HttpRest/client.ts'

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`TronNodeRest: invalid ${label} response envelope`)
	}
}

export const tronNodeRest = ({
	binding,
	endpointNamespace,
}: {
	binding: SourceBinding
	endpointNamespace: 'wallet' | 'walletsolidity'
}) => ({
	getAccount: async ({
		address,
	}: {
		address: string
	}) => (
		assertEnvelope(
			'account',
			tronNodeAccountWire,
			await postJson<TronNodeAccount>({
				binding,
				path: `${endpointNamespace}/getaccount`,
				body: {
					address,
					visible: true,
				},
			})
		) as TronNodeAccount
	),
	getBlockById: async ({
		hash,
	}: {
		hash: string
	}) => (
		assertEnvelope(
			'block',
			tronNodeBlockWire,
			await postJson<TronNodeBlock>({
				binding,
				path: `${endpointNamespace}/getblockbyid`,
				body: {
					value: hash,
					visible: true,
				},
			})
		) as TronNodeBlock
	),
	getBlockByNumber: async ({
		height,
	}: {
		height: bigint
	}) => (
		assertEnvelope(
			'block',
			tronNodeBlockWire,
			await postJson<TronNodeBlock>({
				binding,
				path: `${endpointNamespace}/getblockbynum`,
				body: {
					num: Number(height),
					visible: true,
				},
			})
		) as TronNodeBlock
	),
	getTransactionById: async ({
		transactionId,
	}: {
		transactionId: string
	}) => (
		assertEnvelope(
			'transaction',
			tronNodeTransactionWire,
			await postJson<TronNodeTransaction>({
				binding,
				path: `${endpointNamespace}/gettransactionbyid`,
				body: {
					value: transactionId,
					visible: true,
				},
			})
		) as TronNodeTransaction
	),
	getTransactionInfoById: async ({
		transactionId,
	}: {
		transactionId: string
	}) => (
		assertEnvelope(
			'transaction info',
			tronNodeTransactionInfoWire,
			await postJson<TronNodeTransactionInfo>({
				binding,
				path: `${endpointNamespace}/gettransactioninfobyid`,
				body: {
					value: transactionId,
				},
			})
		) as TronNodeTransactionInfo
	),
})
