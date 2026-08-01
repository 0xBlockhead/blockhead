import { TransportType } from '$/constants/TransportType.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	NearRpcAccount,
	NearRpcAccessKey,
	NearRpcAccessKeyList,
	NearRpcBlock,
	NearRpcChunk,
	NearRpcGasPrice,
	NearRpcReceipt,
	NearRpcStatus,
	NearRpcTransactionStatus,
	NearRpcValidators,
	NearRpcViewState,
} from '$/sources/NearRpc/JsonRpc/types.ts'
import bindings from '$/sources/NearRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.NearRpc_JsonRpc]

export const nearRpcEndpoints = binding.endpoints.map((endpoint) => ({
	url: endpoint.locator,
	transportType: TransportType.Http,
	providerName: 'NEAR',
}))

export const getBlock = ({
	blockId,
}: {
	blockId: bigint | string | 'final'
}) => (
	jsonRpc2<NearRpcBlock>(
		binding,
		'block',
		(
			blockId === 'final' ?
				{
					finality: 'final',
				}
			:
				{
					block_id: typeof blockId === 'bigint' ? Number(blockId) : blockId,
				}
		)
	)
)

export const getTx = ({
	txHash,
	senderAccountId,
}: {
	txHash: string
	senderAccountId: string
}) => (
	jsonRpc2<NearRpcTransactionStatus>(binding, 'tx', {
		tx_hash: txHash,
		sender_account_id: senderAccountId,
		wait_until: 'FINAL',
	})
)

export const getTxStatus = ({
	txHash,
	senderAccountId,
}: {
	txHash: string
	senderAccountId: string
}) => (
	jsonRpc2<NearRpcTransactionStatus>(binding, 'EXPERIMENTAL_tx_status', {
		tx_hash: txHash,
		sender_account_id: senderAccountId,
		wait_until: 'FINAL',
	})
)

export const getReceipt = ({
	receiptId,
}: {
	receiptId: string
}) => (
	jsonRpc2<NearRpcReceipt>(binding, 'EXPERIMENTAL_receipt', {
		receipt_id: receiptId,
	})
)

export const getChunk = ({
	chunkHash,
}: {
	chunkHash: string
}) => (
	jsonRpc2<NearRpcChunk>(binding, 'chunk', {
		chunk_id: chunkHash,
	})
)

export const viewAccount = ({
	accountId,
}: {
	accountId: string
}) => (
	jsonRpc2<NearRpcAccount>(binding, 'query', {
		request_type: 'view_account',
		finality: 'final',
		account_id: accountId,
	})
)

export const viewAccessKeyList = ({
	accountId,
}: {
	accountId: string
}) => (
	jsonRpc2<NearRpcAccessKeyList>(binding, 'query', {
		request_type: 'view_access_key_list',
		finality: 'final',
		account_id: accountId,
	})
)

export const viewAccessKey = ({
	accountId,
	publicKey,
}: {
	accountId: string
	publicKey: string
}) => (
	jsonRpc2<NearRpcAccessKey>(binding, 'query', {
		request_type: 'view_access_key',
		finality: 'final',
		account_id: accountId,
		public_key: publicKey,
	})
)

export const viewState = ({
	accountId,
	prefixBase64,
	blockHeight,
}: {
	accountId: string
	prefixBase64: string
	blockHeight: number
}) => (
	jsonRpc2<NearRpcViewState>(binding, 'query', {
		request_type: 'view_state',
		block_id: blockHeight,
		account_id: accountId,
		prefix_base64: prefixBase64,
	})
)

export const getValidators = () => (
	jsonRpc2<NearRpcValidators>(binding, 'validators', [null])
)

export const getGasPrice = () => (
	jsonRpc2<NearRpcGasPrice>(binding, 'gas_price', [null])
)

export const getStatus = () => (
	jsonRpc2<NearRpcStatus>(binding, 'status', [])
)
