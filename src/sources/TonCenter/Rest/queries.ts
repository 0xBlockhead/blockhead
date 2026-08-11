import type { components, operations } from '$/sources/TonCenter/OpenApi/openapi.d.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import bindings from '$/sources/TonCenter/bindings.ts'
import { ApiFamily } from '$/sources/SourceBinding.ts'
import { Source } from '$/sources/Source.ts'

const bindingByNetwork = Object.fromEntries(
	bindings[Source.TonCenter]
		.filter((binding) => binding.apiFamily === ApiFamily.OpenApiHttp)
		.map((binding) => [
			binding.target.key,
			binding,
		])
)

type TonlibOperationResponse<_Result> = (
	& Omit<components['schemas']['TonlibResponse'], 'result'>
	& { result: _Result }
)
type TonCenterV2Binding = Extract<
	typeof bindings[Source.TonCenter][number],
	{ apiFamily: ApiFamily.OpenApiHttp }
>
type TonCenterV2Network = TonCenterV2Binding['target']['key']

const assertResultObject = <_Result>(result: _Result, operation: string) => {
	if (result == null)
		throw new Error(`TonCenter_Rest: ${operation} response result is missing`)
	return result
}

export const getAddressInformation = (
	network: TonCenterV2Network,
	{
		address,
		seqno,
	}: operations['getAddressInformation_get']['parameters']['query']
) => (
	getJson<TonlibOperationResponse<components['schemas']['AddressInformation']>>(
		bindingByNetwork[network],
		`getAddressInformation?${new URLSearchParams({
			address,
			...(seqno != null && {
				seqno: String(seqno),
			}),
		})}`
		).then(({ result }) => assertResultObject(result, 'getAddressInformation'))
)

export const getMasterchainInfo = (
	network: TonCenterV2Network
) => (
	getJson<TonlibOperationResponse<components['schemas']['MasterchainInfo']>>(
		bindingByNetwork[network],
		'getMasterchainInfo'
		).then(({ result }) => assertResultObject(result, 'getMasterchainInfo'))
)
