import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Xrpl/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	xrplAccountInfo,
	xrplAccountLines,
	xrplAccountObjects,
	xrplAccountTransactions,
	xrplAmmInfo,
	xrplFeature,
	xrplLedger,
	xrplLedgerData,
	xrplLedgerWithTransactions,
	xrplServerInfo,
	type XrplAccountInfoResult,
	type XrplAccountLinesResult,
	type XrplAccountObjectsResult,
	type XrplAccountTransactionsResult,
	type XrplAmmInfoResult,
	type XrplFeature,
	type XrplFeatureResult,
	type XrplLedgerDataResult,
	type XrplLedgerResult,
	type XrplLedgerSpecifier,
	type XrplLedgerWithTransactionsResult,
	type XrplMarker,
	type XrplServerInfoResult,
} from '$/sources/Xrpl/JsonRpc/types.ts'
import {
	isJsonObject,
} from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Xrpl_Rippled][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Xrpl_Rippled: invalid ${label} response envelope`)
	}
}

const assertFeatureResult = (
	response: unknown
): XrplFeatureResult => {
	if (!isJsonObject(response))
		throw new Error('Xrpl_Rippled: invalid feature response envelope')

	const features: Record<string, XrplFeature> = {}
	for (const [amendmentId, feature] of Object.entries(response)) {
		if (amendmentId.length === 0)
			throw new Error('Xrpl_Rippled: invalid feature response envelope')
		features[amendmentId] = assertEnvelope(
			'feature',
			xrplFeature,
			feature
		)
	}
	return features
}

export const getServerInfo = async () => (
	assertEnvelope(
		'server_info',
		xrplServerInfo,
		await jsonRpc2<unknown>(binding, 'server_info')
	) as XrplServerInfoResult
)

export const getValidatedLedger = async () => (
	assertEnvelope(
		'ledger',
		xrplLedger,
		await jsonRpc2<unknown>(binding, 'ledger', [{ ledger_index: 'validated' }])
	) as XrplLedgerResult
)

export const getValidatedLedgerData = async (
	limit: number,
	ledgerIndex: XrplLedgerSpecifier = 'validated',
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid ledger data limit')

	return assertEnvelope(
		'ledger_data',
		xrplLedgerData,
		await jsonRpc2<unknown>(binding, 'ledger_data', [{
			ledger_index: ledgerIndex,
			limit,
			type: 'state',
			...(marker != null && {
				marker,
			}),
		}])
	) as XrplLedgerDataResult
}

export const getValidatedLedgerTransactions = async () => (
	assertEnvelope(
		'ledger transactions',
		xrplLedgerWithTransactions,
		await jsonRpc2<unknown>(binding, 'ledger', [{
			ledger_index: 'validated',
			transactions: true,
			expand: true,
		}])
	) as XrplLedgerWithTransactionsResult
)

export const getFeatures = async () => (
	assertFeatureResult(
		await jsonRpc2<unknown>(binding, 'feature')
	)
)

export const getAccountInfo = async (
	account: string,
	ledgerIndex: XrplLedgerSpecifier = 'validated'
) => (
	assertEnvelope(
		'account_info',
		xrplAccountInfo,
		await jsonRpc2<unknown>(binding, 'account_info', [{
			account,
			ledger_index: ledgerIndex,
		}])
	) as XrplAccountInfoResult
)

export const getAccountObjects = async (
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account objects limit')

	return assertEnvelope(
		'account_objects',
		xrplAccountObjects,
		await jsonRpc2<unknown>(binding, 'account_objects', [{
			account,
			ledger_index: 'validated',
			limit: Math.min(400, Math.max(10, limit)),
			...(marker != null && {
				marker,
			}),
		}])
	) as XrplAccountObjectsResult
}

export const getAccountLines = async (
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account lines limit')

	return assertEnvelope(
		'account_lines',
		xrplAccountLines,
		await jsonRpc2<unknown>(binding, 'account_lines', [{
			account,
			ledger_index: 'validated',
			limit: Math.min(400, Math.max(10, limit)),
			...(marker != null && {
				marker,
			}),
		}])
	) as XrplAccountLinesResult
}

export const getAccountTransactions = async (
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account transactions limit')

	return assertEnvelope(
		'account_tx',
		xrplAccountTransactions,
		await jsonRpc2<unknown>(binding, 'account_tx', [{
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
	) as XrplAccountTransactionsResult
}

export const getAmmInfo = async (
	ammAccount: string,
	ledgerIndex: XrplLedgerSpecifier = 'validated'
) => {
	if (ammAccount.length === 0)
		throw new Error('Xrpl_Rippled: AMM account must not be empty')

	return assertEnvelope(
		'amm_info',
		xrplAmmInfo,
		await jsonRpc2<unknown>(binding, 'amm_info', [{
			amm_account: ammAccount,
			ledger_index: ledgerIndex,
		}])
	) as XrplAmmInfoResult
}
