import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	XrplFeatureResult,
	XrplLedgerDataResult,
	XrplLedgerResult,
	XrplLedgerWithTransactionsResult,
	XrplServerInfoResult,
} from '$/sources/Xrpl/JsonRpc/types.ts'

export const getServerInfo = (binding: SourceBinding) => (
	jsonRpc2<XrplServerInfoResult>(binding, 'server_info')
)

export const getValidatedLedger = (binding: SourceBinding) => (
	jsonRpc2<XrplLedgerResult>(binding, 'ledger', [{ ledger_index: 'validated' }])
)

export const getValidatedLedgerData = (binding: SourceBinding, limit: number) => (
	jsonRpc2<XrplLedgerDataResult>(binding, 'ledger_data', [{
		ledger_index: 'validated',
		limit,
		type: 'state',
	}])
)

export const getValidatedLedgerTransactions = (binding: SourceBinding) => (
	jsonRpc2<XrplLedgerWithTransactionsResult>(binding, 'ledger', [{
		ledger_index: 'validated',
		transactions: true,
		expand: true,
	}])
)

export const getFeatures = (binding: SourceBinding) => (
	jsonRpc2<XrplFeatureResult>(binding, 'feature')
)
