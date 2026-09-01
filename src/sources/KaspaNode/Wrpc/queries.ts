import bindings from '$/sources/KaspaNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { KaspaNodeWrpcMethodResult } from '$/sources/KaspaNode/Wrpc/types.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'

const binding = bindings[Source.KaspaNode_Wrpc][0]

const request = async <_Method extends keyof KaspaNodeWrpcMethodResult>(
	method: _Method,
	params: Record<string, unknown> = {}
) => {
	const endpoint = firstHttpUrlForBinding(binding).replace(/^http/, 'ws')
	if (typeof WebSocket === 'undefined')
		throw new Error('KaspaNode_Wrpc: WebSocket is unavailable')

	return new Promise<KaspaNodeWrpcMethodResult[_Method]>((resolve, reject) => {
		const socket = new WebSocket(endpoint)
		const id = crypto.randomUUID()
		const close = () => socket.close()
		socket.addEventListener('open', () => socket.send(JSON.stringify({ id, method, params })))
		socket.addEventListener('message', (event) => {
			let response: {
				id?: string
				result?: KaspaNodeWrpcMethodResult[_Method]
				error?: { message?: string }
			}
			try {
				response = JSON.parse(String(event.data))
			} catch {
				close()
				reject(new Error(`KaspaNode_Wrpc: ${method} returned malformed JSON`))
				return
			}
			if (response.id !== id)
				return
			close()
			if (response.error != null)
				reject(new Error(`KaspaNode_Wrpc: ${response.error.message ?? 'upstream RPC error'}`))
			else if (response.result == null)
				reject(new Error(`KaspaNode_Wrpc: ${method} returned no result`))
			else
				resolve(response.result)
		})
		socket.addEventListener('error', () => {
			close()
			reject(new Error(`KaspaNode_Wrpc: ${method} transport failed`))
		})
	})
}

export const getBlockDagInfo = () => request('getBlockDagInfo')
export const getServerInfo = () => request('getServerInfo')
export const getAddressBalance = ({ address }: { address: string }) => request('getBalanceByAddress', { address })
export const getAddressUtxos = ({ address }: { address: string }) => request('getUtxosByAddresses', { addresses: [address] })
export const getBlock = ({ blockHash }: { blockHash: string }) => request('getBlock', { hash: blockHash, includeTransactions: true })
export const getTransaction = ({ transactionId }: { transactionId: string }) => request('getTransaction', { transactionId })
export const getVirtualChain = ({ startHash, minConfirmationCount }: { startHash: string; minConfirmationCount?: number }) => request('getVirtualChainFromBlock', { startHash, includeAcceptedTransactionIds: true, ...(minConfirmationCount != null && { minConfirmationCount }) })
