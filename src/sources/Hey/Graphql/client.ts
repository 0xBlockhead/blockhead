import { print } from 'graphql'
import {
	initGraphQLTada,
	type TadaDocumentNode,
} from 'gql.tada'

import { getJson } from '$/lib/http.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import type { introspection } from './graphql-env.d.ts'
import {
	heyGraphqlUrls,
} from '$/sources/Hey/Graphql/constants.ts'
import Hey from '$/sources/Hey/index.ts'

export const graphql = initGraphQLTada<{
	introspection: introspection
	scalars: {
		DateTime: string
		EvmAddress: `0x${string}`
		PostId: string
	}
}>()

type HeyGqlResponse<_Result> = {
	data: _Result
	errors?: readonly {
		message?: string
	}[]
}

export const queryHey = async <
	_Result extends {
		[key: string]: any
	},
	_Variables extends {
		[key: string]: any
	},
>(
	publicEnv: SourcePublicEnvFor<Source.Hey_Graphql>,
	document: TadaDocumentNode<_Result, _Variables>,
	variables?: _Variables,
): Promise<_Result> => {
	const apiKey = publicEnv.PUBLIC_LENS_HEY_API_KEY
	const trimmedApiKey = typeof apiKey === 'string' ? apiKey.trim() : ''
	const init = {
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
	let lastError: Error | undefined
	for (const url of heyGraphqlUrls) {
		try {
			const out = await getJson<HeyGqlResponse<_Result>>(url, {
				origins: Hey.origins ?? [],
				init,
			})
			if (out.errors?.[0]?.message != null) {
				throw new Error(`Hey_Graphql: ${out.errors[0].message}`)
			}
			return out.data
		}
		catch (error) {
			lastError = (
				error instanceof Error ?
					error
				:	new Error(String(error))
			)
		}
	}
	throw lastError ?? new Error('Hey_Graphql: all endpoints failed')
}
