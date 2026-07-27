import {
	optionalPublicEnvString,
	requiredPublicEnvString,
} from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import bindings from '$/sources/Coingecko/bindings.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Coingecko_Rest].map((binding) => [
		binding.target.key,
		binding,
	])
)

export const coingeckoRestFetch = (
	publicEnv: SourcePublicEnv,
	path: string,
	init?: RequestInit
): Promise<Response> => {
	const binding = bindingByTargetKey[
		optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_PRO_API_KEY') == null ?
			'coingecko-demo'
		:
			'coingecko-pro'
	]
	const apiKey = (
		binding.target.key === 'coingecko-pro' ?
			requiredPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_PRO_API_KEY')
		: binding.target.key === 'coingecko-demo' ?
			optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_DEMO_API_KEY')
		:
			undefined
	)
	const headers = new Headers({
		Accept: 'application/json',
	})

	if (apiKey != null)
		headers.set(
			binding.target.key === 'coingecko-pro' ?
				'x-cg-pro-api-key'
			:
				'x-cg-demo-api-key',
			apiKey
		)

	if (init?.headers != null)
		new Headers(init.headers)
			.forEach((value, key) => headers.set(key, value))

	return sourceFetch(
		binding,
		`${firstHttpUrlForBinding(binding)}${path}`,
		{
			...init,
			headers,
		}
	)
}
