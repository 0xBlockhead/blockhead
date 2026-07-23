import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	XrplAccountInfoResult,
	XrplAccountLinesResult,
	XrplAccountObjectsResult,
	XrplAccountTransactionsResult,
	XrplFeatureResult,
	XrplLedgerDataResult,
	XrplLedgerResult,
	XrplLedgerSpecifier,
	XrplLedgerWithTransactionsResult,
	XrplMarker,
	XrplServerInfoResult,
} from '$/sources/Xrpl/JsonRpc/types.ts'

export const getServerInfo = (binding: SourceBinding) => (
	jsonRpc2<XrplServerInfoResult>(binding, 'server_info')
)

export const getValidatedLedger = (binding: SourceBinding) => (
	jsonRpc2<XrplLedgerResult>(binding, 'ledger', [{ ledger_index: 'validated' }])
)

export const getValidatedLedgerData = (
	binding: SourceBinding,
	limit: number,
	ledgerIndex: XrplLedgerSpecifier = 'validated',
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid ledger data limit')

	return jsonRpc2<XrplLedgerDataResult>(binding, 'ledger_data', [{
		ledger_index: ledgerIndex,
		limit,
		type: 'state',
		...(marker != null && {
			marker,
		}),
	}])
}

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

export const getAccountInfo = (
	binding: SourceBinding,
	account: string,
	ledgerIndex: XrplLedgerSpecifier = 'validated'
) => (
	jsonRpc2<XrplAccountInfoResult>(binding, 'account_info', [{
		account,
		ledger_index: ledgerIndex,
	}])
)

export const getAccountObjects = (
	binding: SourceBinding,
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account objects limit')

	return jsonRpc2<XrplAccountObjectsResult>(binding, 'account_objects', [{
		account,
		ledger_index: 'validated',
		limit: Math.min(400, Math.max(10, limit)),
		...(marker != null && {
			marker,
		}),
	}])
}

export const getAccountLines = (
	binding: SourceBinding,
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account lines limit')

	return jsonRpc2<XrplAccountLinesResult>(binding, 'account_lines', [{
		account,
		ledger_index: 'validated',
		limit: Math.min(400, Math.max(10, limit)),
		...(marker != null && {
			marker,
		}),
	}])
}

export const getAccountTransactions = (
	binding: SourceBinding,
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account transactions limit')

	return jsonRpc2<XrplAccountTransactionsResult>(binding, 'account_tx', [{
		account,
		binary: false,
		forward: false,
		ledger_index_min: -1,
		ledger_index_max: -1,
		limit: Math.min(400, Math.max(1, limit)),
		...(marker != null && {
			marker,
		}),
	}])
}
