import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import type { paths } from '$/sources/Voyager/OpenApi/openapi.d.ts'
import bindings from '$/sources/Voyager/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Voyager][0]

export const getTransactionByHash = (
	{ txnHash }: paths['/txns/{txnHash}']['get']['parameters']['path']
) => (
	getJson<paths['/txns/{txnHash}']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/txns/${encodeURIComponent(txnHash)}`
	)
)

export const getContractByAddress = (
	{ contractAddress }: paths['/contracts/{contractAddress}']['get']['parameters']['path']
) => (
	getJson<paths['/contracts/{contractAddress}']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/contracts/${encodeURIComponent(contractAddress)}`
	)
)

export const getClassByHash = (
	{ classHash }: paths['/classes/{classHash}']['get']['parameters']['path']
) => (
	getJson<paths['/classes/{classHash}']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/classes/${encodeURIComponent(classHash)}`
	)
)

export const getBlockByHash = (
	{ blockHash }: paths['/blocks/{blockHash}']['get']['parameters']['path']
) => (
	getJson<paths['/blocks/{blockHash}']['get']['responses'][200]['content']['application/json']>(
		binding,
		`/blocks/${encodeURIComponent(blockHash)}`
	)
)

export const getNetworkStats = () => (
	getJson<paths['/stats']['get']['responses'][200]['content']['application/json']>(
		binding,
		'/stats'
	)
)

export const getApiStatus = () => (
	getJson<paths['/api-status']['get']['responses'][200]['content']['application/json']>(
		binding,
		'/api-status'
	)
)
