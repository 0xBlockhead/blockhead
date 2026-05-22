import { getJson } from '$/lib/http.ts'
import {
	lensHeyApiOrigins,
	lensHeyGraphqlUrls,
} from '$/sources/LensHey/Graphql/constants.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type LensHeyGqlResponse<T> = { data: T, errors?: readonly { message?: string }[] }

export const lensHeyGraphql = async <T>(
	publicEnv: SourcePublicEnvFor<Source.Lens_HeyGraphql>,
	body: { query: string, variables?: Record<string, JsonValue> },
): Promise<T> => {
	const k = publicEnv.PUBLIC_LENS_HEY_API_KEY
	const init = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(typeof k === 'string' && k.trim() !== '' && { 'x-lens-app': k.trim() }),
		},
		body: JSON.stringify(body),
	}
	let lastError: Error | undefined
	for (const url of lensHeyGraphqlUrls) {
		try {
			const out = await getJson<LensHeyGqlResponse<T>>(url, {
				origins: lensHeyApiOrigins,
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
