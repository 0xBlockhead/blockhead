import { TransportType } from '$/constants/TransportType.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { tronNodeRest } from '$/sources/_shared/interfaces/TronNodeRest/queries.ts'
import type {
	TronNodeAccountResource,
	TronNodeBlock,
	TronNodeChainParameters,
	TronNodeInfo,
	TronNodeWitnesses,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import {
	tronNodeAccountResourceWire,
	tronNodeBlockWire,
	tronNodeChainParametersWire,
	tronNodeInfoWire,
	tronNodeWitnessesWire,
} from '$/sources/_shared/interfaces/TronNodeRest/types.ts'
import {
	getJson,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/TronGrid/bindings.ts'
import {
	tronGridAccountTransactionsWire,
	type TronGridAccountTransactions,
} from '$/sources/TronGrid/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TronGrid_Rest][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`TronGrid_Rest: invalid ${label} response envelope`)
	}
}

export const restEndpoints = [{
	url: firstHttpUrlForBinding(binding),
	transportType: TransportType.Http,
	providerName: 'TronGrid',
}]

export const {
	getAccount,
	getBlockByNumber,
	getTransactionById,
	getTransactionInfoById,
} = tronNodeRest({
	binding,
	endpointNamespace: 'wallet',
})

export const getNowBlock = async () => (
	assertEnvelope(
		'now block',
		tronNodeBlockWire,
		await postJson<TronNodeBlock>({
			binding,
			path: 'wallet/getnowblock',
			body: {
				visible: true,
			},
		})
	) as TronNodeBlock
)

export const getAccountResource = async ({
	address,
}: {
	address: string
}) => (
	assertEnvelope(
		'account resource',
		tronNodeAccountResourceWire,
		await postJson<TronNodeAccountResource>({
			binding,
			path: 'wallet/getaccountresource',
			body: {
				address,
				visible: true,
			},
		})
	) as TronNodeAccountResource
)

export const getAccountTransactions = async ({
	address,
	limit,
}: {
	address: string
	limit: number
}) => (
	assertEnvelope(
		'account transactions',
		tronGridAccountTransactionsWire,
		await getJson<TronGridAccountTransactions>(
			binding,
			`v1/accounts/${address}/transactions?limit=${limit.toString()}`
		)
	) as TronGridAccountTransactions
)

export const listWitnesses = async () => (
	assertEnvelope(
		'witnesses',
		tronNodeWitnessesWire,
		await postJson<TronNodeWitnesses>({
			binding,
			path: 'wallet/listwitnesses',
			body: {
				visible: true,
			},
		})
	) as TronNodeWitnesses
)

export const getChainParameters = async () => (
	assertEnvelope(
		'chain parameters',
		tronNodeChainParametersWire,
		await postJson<TronNodeChainParameters>({
			binding,
			path: 'wallet/getchainparameters',
			body: {},
		})
	) as TronNodeChainParameters
)

export const getNodeInfo = async () => (
	assertEnvelope(
		'node info',
		tronNodeInfoWire,
		await postJson<TronNodeInfo>({
			binding,
			path: 'wallet/getnodeinfo',
			body: {},
		})
	) as TronNodeInfo
)
