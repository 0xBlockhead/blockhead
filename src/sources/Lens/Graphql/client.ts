import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { fetchFailedMessage } from '$/lib/http.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceEndpointKind,
	SourceTargetKind,
} from '$/sources/SourceBinding.ts'

import type { introspection } from './graphql-env.d.ts'

export type { introspection }

export const graphql = initGraphQLTada<{
	introspection: introspection
	scalars: {
		DateTime: string
		EvmAddress: `0x${string}`
		PostId: string
	}
}>()

type LensGqlResponse<_Result> = {
	data: _Result
	errors?: readonly {
		message?: string
	}[]
}

const lensGraphqlBindings = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.filter((binding) => (
		binding.source === Source.Lens_Graphql
		&& binding.apiFamily === ApiFamily.GraphqlHttp
		&& binding.target.kind === SourceTargetKind.Global
		&& binding.target.key === 'lens-protocol'
	))

if (lensGraphqlBindings.length !== 1)
	throw new Error('Lens_Graphql: canonical GraphQL source binding is missing or ambiguous')

const lensGraphqlBinding = lensGraphqlBindings[0]
const lensGraphqlUrls = lensGraphqlBinding.endpoints.flatMap((endpoint) => (
	endpoint.endpointKind === SourceEndpointKind.HttpUrl ?
		[endpoint.locator]
	:
		[]
))

export const queryLens = async <
	_Result extends object,
	_Variables extends object,
>(
	publicEnv: SourcePublicEnv,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables
): Promise<_Result> => {
	const apiKey = publicEnv.PUBLIC_LENS_API_KEY
	const trimmedApiKey = (
		typeof apiKey === 'string' ?
			apiKey.trim()
		:
			''
	)
	let lastError: Error | undefined
	for (const url of lensGraphqlUrls) {
		try {
			const response = await sourceFetch(
				lensGraphqlBinding,
				url,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
						...(trimmedApiKey !== '' && { 'x-lens-app': trimmedApiKey }),
					},
					body: JSON.stringify({
						query: print(document),
						variables,
					}),
				}
			)
			if (!response.ok)
				throw new Error(await fetchFailedMessage(url, response))

			const out = await response.json<LensGqlResponse<_Result>>()

			if (out.errors?.[0]?.message != null)
				throw new Error(`Lens_Graphql: ${out.errors[0].message}`)

			return out.data
		}
		catch (error) {
			lastError = (
				error instanceof Error ?
					error
				:
					new Error(String(error))
			)
		}
	}

	throw lastError ?? new Error('Lens_Graphql: all endpoints failed')
}
