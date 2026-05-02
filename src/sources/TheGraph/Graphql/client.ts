import { print } from 'graphql'
import type {
	TadaDocumentNode,
} from 'gql.tada'

import {
	optionalPublicEnvString,
} from '$/lib/sources.ts'
import { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'

export const queryTheGraph = async <
	_Result extends {
		[key: string]: any
	},
	_Variables extends {
		[key: string]: any
	},
>({
	document,
	endpointUrl,
	publicEnv,
	variables,
}: {
	document: TadaDocumentNode<_Result, _Variables>
	endpointUrl: string
	publicEnv: SourcePublicEnvFor<Source.TheGraph_Graphql>
	variables?: _Variables
}): Promise<_Result> => {
	const apiKey = optionalPublicEnvString(publicEnv, 'PUBLIC_THEGRAPH_API_KEY')

	if (
		apiKey == null
		&& endpointUrl.includes('gateway.thegraph.com')
	) {
		throw new Error('PUBLIC_THEGRAPH_API_KEY is required for The Graph gateway queries')
	}

	const response = await fetch(endpointUrl, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(apiKey != null ? { Authorization: `Bearer ${apiKey}` } : {}),
		},
		body: JSON.stringify({
			query: print(document),
			variables,
		}),
	})

	if (!response.ok) {
		throw new Error(`The Graph API error: ${response.status} ${response.statusText}`)
	}

	const payload = await response.json() as {
		data?: _Result
		errors?: {
			message?: string
		}[]
	}

	if ((payload.errors?.length ?? 0) > 0) {
		const errors = payload.errors ?? []

		throw new Error(
			`The Graph query error: ${
				errors
					.map((error) => error.message ?? 'Unknown error')
					.join(', ')
			}`,
		)
	}

	if (payload.data == null) throw new Error('The Graph query returned no data')

	return payload.data
}
