import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	XrplLedgerResult,
	XrplServerInfoResult,
} from '$/sources/Xrpl/JsonRpc/types.ts'

export const getServerInfo = (binding: SourceBinding) => (
	jsonRpc2<XrplServerInfoResult>(binding, 'server_info')
)

export const getValidatedLedger = (binding: SourceBinding) => (
	jsonRpc2<XrplLedgerResult>(binding, 'ledger', [{ ledger_index: 'validated' }])
)
