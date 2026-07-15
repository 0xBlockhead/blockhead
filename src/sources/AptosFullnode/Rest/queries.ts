import { throwHttpError } from '$/lib/http.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type {
	AptosAccount,
	AptosBlock,
	AptosEvent,
	AptosLedgerInfo,
	AptosMoveModule,
	AptosMoveResource,
	AptosResponse,
	AptosTableItemRequest,
	AptosTransaction,
} from '$/sources/AptosFullnode/Rest/types.ts'

const requiredHeader = (
	response: Response,
	name: string
) => {
	const value = response.headers.get(name)
	if (value == null)
		throw new Error(`Aptos Fullnode response missing ${name}`)

	return value
}

const request = async <_Body>(
	binding: SourceBinding,
	path = '',
	init?: RequestInit
): Promise<AptosResponse<_Body>> => {
	const response = await sourceFetch(
		binding,
		new URL(path, firstHttpUrlForBinding(binding)).toString(),
		init
	)
	if (!response.ok)
		await throwHttpError(`${binding.source} ${path}`, response)

	return {
		body: await response.json(),
		metadata: {
			chainId: requiredHeader(response, 'x-aptos-chain-id'),
			ledgerVersion: requiredHeader(response, 'x-aptos-ledger-version'),
			oldestLedgerVersion: requiredHeader(response, 'x-aptos-ledger-oldest-version'),
			ledgerTimestampUsec: requiredHeader(response, 'x-aptos-ledger-timestampusec'),
			epoch: requiredHeader(response, 'x-aptos-epoch'),
			blockHeight: requiredHeader(response, 'x-aptos-block-height'),
			oldestBlockHeight: requiredHeader(response, 'x-aptos-oldest-block-height'),
			...(response.headers.has('x-aptos-gas-used') && {
				gasUsed: requiredHeader(response, 'x-aptos-gas-used'),
			}),
			...(response.headers.has('x-aptos-cursor') && {
				cursor: requiredHeader(response, 'x-aptos-cursor'),
			}),
		},
	}
}

const ledgerVersionQuery = (ledgerVersion?: bigint) => (
	ledgerVersion == null ? '' : `?ledger_version=${ledgerVersion.toString()}`
)

export const getLedgerInfo = (binding: SourceBinding) => (
	request<AptosLedgerInfo>(binding)
)

export const getAccount = (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => (
	request<AptosAccount>(binding, `accounts/${encodeURIComponent(address)}${ledgerVersionQuery(ledgerVersion)}`)
)

export const getAccountResources = (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => (
	request<AptosMoveResource[]>(binding, `accounts/${encodeURIComponent(address)}/resources${ledgerVersionQuery(ledgerVersion)}`)
)

export const getAccountModules = (
	binding: SourceBinding,
	address: string,
	ledgerVersion?: bigint
) => (
	request<AptosMoveModule[]>(binding, `accounts/${encodeURIComponent(address)}/modules${ledgerVersionQuery(ledgerVersion)}`)
)

export const getBlockByHeight = (
	binding: SourceBinding,
	height: bigint,
	withTransactions = true
) => (
	request<AptosBlock>(binding, `blocks/by_height/${height.toString()}?with_transactions=${String(withTransactions)}`)
)

export const getBlockByVersion = (
	binding: SourceBinding,
	version: bigint,
	withTransactions = true
) => (
	request<AptosBlock>(binding, `blocks/by_version/${version.toString()}?with_transactions=${String(withTransactions)}`)
)

export const getEventsByEventHandle = (
	binding: SourceBinding,
	address: string,
	eventHandle: string,
	fieldName: string,
	start?: bigint,
	limit?: number
) => {
	const parameters = new URLSearchParams()
	if (start != null)
		parameters.set('start', start.toString())
	if (limit != null)
		parameters.set('limit', String(limit))

	return request<AptosEvent[]>(
		binding,
		`accounts/${encodeURIComponent(address)}/events/${encodeURIComponent(eventHandle)}/${encodeURIComponent(fieldName)}${parameters.size === 0 ? '' : `?${parameters.toString()}`}`
	)
}

export const getTableItem = <_Value>(
	binding: SourceBinding,
	tableHandle: string,
	requestBody: AptosTableItemRequest,
	ledgerVersion?: bigint
) => (
	request<_Value>(
		binding,
		`tables/${encodeURIComponent(tableHandle)}/item${ledgerVersionQuery(ledgerVersion)}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		}
	)
)

export const getTransactionByHash = (
	binding: SourceBinding,
	hash: string
) => (
	request<AptosTransaction>(binding, `transactions/by_hash/${encodeURIComponent(hash)}`)
)

export const getTransactionByVersion = (
	binding: SourceBinding,
	version: bigint
) => (
	request<AptosTransaction>(binding, `transactions/by_version/${version.toString()}`)
)
