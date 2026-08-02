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
	getJson,
	postJson,
} from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/TronGrid/bindings.ts'
import type { TronGridAccountTransactions } from '$/sources/TronGrid/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.TronGrid_Rest][0]

export const getRestEndpoints = () => [{
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

export const getNowBlock = () => (
	postJson<TronNodeBlock>({
		binding,
		path: 'wallet/getnowblock',
		body: {
			visible: true,
		},
	})
)

export const getAccountResource = ({
	address,
}: {
	address: string
}) => (
	postJson<TronNodeAccountResource>({
		binding,
		path: 'wallet/getaccountresource',
		body: {
			address,
			visible: true,
		},
	})
)

export const getAccountTransactions = ({
	address,
	limit,
}: {
	address: string
	limit: number
}) => (
	getJson<TronGridAccountTransactions>(
		binding,
		`v1/accounts/${address}/transactions?limit=${limit.toString()}`
	)
)

export const listWitnesses = () => (
	postJson<TronNodeWitnesses>({
		binding,
		path: 'wallet/listwitnesses',
		body: {
			visible: true,
		},
	})
)

export const getChainParameters = () => (
	postJson<TronNodeChainParameters>({
		binding,
		path: 'wallet/getchainparameters',
		body: {},
	})
)

export const getNodeInfo = () => (
	postJson<TronNodeInfo>({
		binding,
		path: 'wallet/getnodeinfo',
		body: {},
	})
)
