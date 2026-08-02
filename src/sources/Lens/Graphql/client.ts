import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { fetchFailedMessage } from '$/lib/http.ts'
import { optionalPublicEnvString } from '$/sources/$sources.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'
import type { GraphqlResponse } from '$/sources/_shared/wire/Graphql/client.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

import type { introspection } from './graphql-env.d.ts'

const binding = bindings[Source.Lens_Graphql][0]

export type { introspection }

export const graphql = initGraphQLTada<{
	introspection: introspection
	scalars: {
		DateTime: string
		EvmAddress: `0x${string}`
		PostId: string
	}
}>()

export const queryLens = async <
	_Result extends object,
	_Variables extends JsonValue & object,
>(
	publicEnv: SourcePublicEnv,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables
) => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_LENS_API_KEY')
	const url = firstHttpUrlForBinding(binding)
	const response = await sourceFetch(
		binding,
		url,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(apiKey != null && { 'x-lens-app': apiKey }),
			},
			body: JSON.stringify({
				query: print(document),
				variables,
			}),
		}
	)
	if (!response.ok)
		throw new Error(await fetchFailedMessage(url, response))

	const payload = await response.json<GraphqlResponse<_Result>>()
	if (payload.errors?.[0]?.message != null)
		throw new Error(`Lens_Graphql: ${payload.errors[0].message}`)
	if (payload.data == null)
		throw new Error('Lens_Graphql: response data is missing')

	return payload.data
}
