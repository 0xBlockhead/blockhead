import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { fetchFailedMessage } from '$/lib/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Lens/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	firstHttpUrlForBinding,
	sourceFetch,
} from '$/sources/_runtime/http.ts'

import type { introspection } from './graphql-env.d.ts'

const binding = bindings[Source.Lens_Graphql]

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
	const url = firstHttpUrlForBinding(binding)
	const response = await sourceFetch(
		binding,
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
