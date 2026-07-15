import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { getJson } from '$/lib/http.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'
import {
	lensApiOrigins,
	lensGraphqlUrl,
} from '$/sources/Lens/Graphql/constants.ts'

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

const lensGraphqlUrls = [
	lensGraphqlUrl,
] as const

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
			const out = await getJson<LensGqlResponse<_Result>>(url, {
				origins: lensApiOrigins,
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
