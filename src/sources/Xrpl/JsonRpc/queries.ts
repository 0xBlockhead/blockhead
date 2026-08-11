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
	type XrplAccountLinesResult,
	type XrplAccountObjectsResult,
	type XrplAccountTransactionsResult,
	type XrplFeature,
	type XrplFeatureResult,
	type XrplLedgerSpecifier,
	type XrplMarker,
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
	)
)

export const getLedger = async (
	specifier: XrplLedgerSpecifier | {
		ledgerHash: string
	} = 'validated'
) => {
	if (typeof specifier === 'object') {
		if (!/^[0-9a-fA-F]{64}$/.test(specifier.ledgerHash))
			throw new Error('Xrpl_Rippled: ledger hash must be canonical hexadecimal')
	} else if (specifier !== 'validated') {
		if (!Number.isSafeInteger(specifier) || specifier < 0)
			throw new Error('Xrpl_Rippled: ledger index must be a nonnegative safe integer')
	}

	const ledger = assertEnvelope(
		'ledger',
		xrplLedger,
		await jsonRpc2<unknown>(binding, 'ledger', [{
			...(
				typeof specifier === 'object' ?
					{
						ledger_hash: specifier.ledgerHash,
					}
				:
					{
						ledger_index: specifier,
					}
			),
			transactions: false,
			expand: false,
		}])
	)
	if (
		(typeof specifier === 'object' && ledger.ledger_hash.toLowerCase() !== specifier.ledgerHash.toLowerCase())
		|| (typeof specifier === 'number' && ledger.ledger_index !== specifier)
		|| (specifier === 'validated' && !ledger.validated)
	)
		throw new Error('Xrpl_Rippled: ledger response does not match request')
	return ledger
}

export const getValidatedLedger = async () => (
	getLedger('validated')
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
	)
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
	)
)

export const getFeatures = async () => (
	assertFeatureResult(
		await jsonRpc2<unknown>(binding, 'feature')
	)
)

export const getAccountInfo = async (
	account: string,
	ledgerIndex: XrplLedgerSpecifier = 'validated'
) => {
	if (account === '')
		throw new Error('Xrpl_Rippled: account must not be empty')
	const response = assertEnvelope(
		'account_info',
		xrplAccountInfo,
		await jsonRpc2<unknown>(binding, 'account_info', [{
			account,
			ledger_index: ledgerIndex,
		}])
	)
	if (response.account_data.Account !== account)
		throw new Error('Xrpl_Rippled: account_info response does not match request')
	return response
}

export const getAccountObjects = async (
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (account === '')
		throw new Error('Xrpl_Rippled: account must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account objects limit')

	const response = assertEnvelope(
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
	if (response.account !== account)
		throw new Error('Xrpl_Rippled: account_objects response does not match request')
	return response
}

export const getAccountLines = async (
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (account === '')
		throw new Error('Xrpl_Rippled: account must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account lines limit')

	const response = assertEnvelope(
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
	if (response.account !== account)
		throw new Error('Xrpl_Rippled: account_lines response does not match request')
	return response
}

export const getAccountTransactions = async (
	account: string,
	limit: number,
	marker?: XrplMarker
) => {
	if (account === '')
		throw new Error('Xrpl_Rippled: account must not be empty')
	if (!Number.isSafeInteger(limit) || limit < 1 || limit > 400)
		throw new Error('Xrpl_Rippled: invalid account transactions limit')

	const response = assertEnvelope(
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
	if (response.account !== account)
		throw new Error('Xrpl_Rippled: account_tx response does not match request')
	return response
}

export const getAmmInfo = async (
	ammAccount: string,
	ledgerIndex: XrplLedgerSpecifier = 'validated'
) => {
	if (ammAccount.length === 0)
		throw new Error('Xrpl_Rippled: AMM account must not be empty')

	const response = assertEnvelope(
		'amm_info',
		xrplAmmInfo,
		await jsonRpc2<unknown>(binding, 'amm_info', [{
			amm_account: ammAccount,
			ledger_index: ledgerIndex,
		}])
	)
	if (response.amm.account !== ammAccount)
		throw new Error('Xrpl_Rippled: amm_info response does not match request')
	return response
}
