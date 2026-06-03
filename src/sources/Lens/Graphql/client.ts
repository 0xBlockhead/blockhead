import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { getJson } from '$/lib/http.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { lensGraphqlUrl } from '$/sources/Lens/Graphql/constants.ts'
import Lens from '$/sources/Lens/index.ts'

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

export const queryLens = async <
	_Result extends {
		[key: string]: any
	},
	_Variables extends {
		[key: string]: any
	},
>(
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables,
): Promise<_Result> => {
	const apiKey = publicEnv.PUBLIC_LENS_API_KEY
	const trimmedApiKey = (
		typeof apiKey === 'string' ?
			apiKey.trim()
		:
			''
	)
	const out = await getJson<LensGqlResponse<_Result>>(lensGraphqlUrl, {
		origins: Lens.origins ?? [],
		init: {
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
		},
	})

	if (out.errors?.[0]?.message != null) {
		throw new Error(`Lens_Graphql: ${out.errors[0].message}`)
	}

	return out.data
}
