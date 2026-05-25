import { print } from 'graphql'
import type { TadaDocumentNode } from 'gql.tada'

import { getJson } from '$/lib/http.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { graphql } from '$/sources/Lens/Graphql/client.ts'
import {
	lensHeyGraphqlUrls,
} from '$/sources/LensHey/Graphql/constants.ts'
import LensHey from '$/sources/LensHey/index.ts'

export { graphql }

type LensHeyGqlResponse<_Result> = {
	data: _Result
	errors?: readonly {
		message?: string
	}[]
}

export const queryLensHey = async <
	_Result extends {
		[key: string]: any
	},
	_Variables extends {
		[key: string]: any
	},
>(
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
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
	for (const url of lensHeyGraphqlUrls) {
		try {
			const out = await getJson<LensHeyGqlResponse<_Result>>(url, {
				origins: LensHey.origins ?? [],
				init,
			})
			if (out.errors?.[0]?.message != null) {
				throw new Error(`Lens_HeyGraphql: ${out.errors[0].message}`)
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
	throw lastError ?? new Error('Lens_HeyGraphql: all endpoints failed')
}
