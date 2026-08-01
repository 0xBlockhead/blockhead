import {
	optionalPublicEnvString,
	requiredPublicEnvString,
} from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Coingecko/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

const bindingByTargetKey = Object.fromEntries(
	bindings[Source.Coingecko_Rest].map((binding) => ([
		binding.target.key,
		binding,
	] as const))
)

export const coingeckoFetch = (
	publicEnv: SourcePublicEnv,
	path: string,
	init?: RequestInit
) => {
	const binding = bindingByTargetKey[
		optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_PRO_API_KEY') == null ?
			'coingecko-demo'
		:
			'coingecko-pro'
	]
	const apiKey = (
		binding.target.key === 'coingecko-pro' ?
			requiredPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_PRO_API_KEY')
		:
			optionalPublicEnvString(publicEnv, 'PUBLIC_COINGECKO_DEMO_API_KEY')
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
