import { throwHttpError } from '$/lib/http.ts'
import {
	requiredPublicEnvString,
	type SourcePublicEnv,
} from '$/sources/$sources.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Bithomp/bindings.ts'
import type { operations } from '$/sources/Bithomp/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Bithomp][0]

export const getAccount = async (
	publicEnv: SourcePublicEnv,
	{ address }: operations['getAccount']['parameters']['path']
) => {
	const response = await sourceFetch(
		binding,
		new URL(
			`address/${encodeURIComponent(address)}?ledgerInfo=true`,
			firstHttpUrlForBinding(binding)
		).toString(),
		{
			headers: {
				'x-bithomp-token': requiredPublicEnvString(publicEnv, 'PUBLIC_BITHOMP_API_KEY'),
			},
		}
	)
	if (!response.ok)
		await throwHttpError('Bithomp get account', response)

	return response.json<operations['getAccount']['responses'][200]['content']['application/json']>()
}
