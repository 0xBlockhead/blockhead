import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	TronNodeAccount,
	TronNodeBlock,
	TronNodeTransaction,
	TronNodeTransactionInfo,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import { postJson } from '$/sources/_shared/wire/HttpRest/client.ts'

export const tronNodeRest = ({
	binding,
	endpointNamespace,
}: {
	binding: SourceBinding
	endpointNamespace: 'wallet' | 'walletsolidity'
}) => ({
	getAccount: ({
		address,
	}: {
		address: string
	}) => (
		postJson<TronNodeAccount>({
			binding,
			path: `${endpointNamespace}/getaccount`,
			body: {
				address,
				visible: true,
			},
		})
	),
	getBlockById: ({
		hash,
	}: {
		hash: string
	}) => (
		postJson<TronNodeBlock>({
			binding,
			path: `${endpointNamespace}/getblockbyid`,
			body: {
				value: hash,
				visible: true,
			},
		})
	),
	getTransactionById: ({
		transactionId,
	}: {
		transactionId: string
	}) => (
		postJson<TronNodeTransaction>({
			binding,
			path: `${endpointNamespace}/gettransactionbyid`,
			body: {
				value: transactionId,
				visible: true,
			},
		})
	),
	getTransactionInfoById: ({
		transactionId,
	}: {
		transactionId: string
	}) => (
		postJson<TronNodeTransactionInfo>({
			binding,
			path: `${endpointNamespace}/gettransactioninfobyid`,
			body: {
				value: transactionId,
			},
		})
	),
})
