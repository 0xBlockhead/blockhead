import {
	corsFetch,
	getJson,
	getText,
} from '$/lib/http.ts'
import {
	SourceEndpointKind,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import type { SourceOrigin } from '$/sources/SourceProvider.ts'

export const httpOriginsForBinding = (
	binding: SourceBinding
): readonly SourceOrigin[] => (
	binding.endpoints.flatMap((endpoint) => (
		endpoint.endpointKind !== SourceEndpointKind.HttpUrl || endpoint.origin == null ?
			[]
		:
			[{
				origin: endpoint.origin,
				corsEnabled: endpoint.corsEnabled === true,
			}]
	))
)

export const firstHttpUrlForBinding = (
	binding: SourceBinding
): string => {
	const endpoint = binding.endpoints.find((candidate) => (
		candidate.endpointKind === SourceEndpointKind.HttpUrl
	))
	if (endpoint == null)
		throw new Error(`${binding.source}: missing HTTP endpoint`)

	return endpoint.locator
}

export const sourceFetch = (
	binding: SourceBinding,
	url: string,
	init?: RequestInit
): Promise<Response> => (
	corsFetch(url, {
		delivery: binding.delivery,
		init,
		origins: httpOriginsForBinding(binding),
	})
)

export const sourceGetJson = <_Json>(
	binding: SourceBinding,
	url: string
): Promise<_Json> => (
	getJson<_Json>(url, {
		delivery: binding.delivery,
		origins: httpOriginsForBinding(binding),
	})
)

export const sourceGetText = (
	binding: SourceBinding,
	url: string
): Promise<string> => (
	getText(url, {
		delivery: binding.delivery,
		origins: httpOriginsForBinding(binding),
	})
)
