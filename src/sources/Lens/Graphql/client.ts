import { getJson } from '$/lib/http.ts'
import { lensApiOrigins, lensGraphqlUrl } from '$/sources/Lens/Graphql/constants.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

type LensGqlResponse<T> = { data: T, errors?: readonly { message?: string }[] }

export const lensGraphql = async <T>(
	publicEnv: SourcePublicEnvFor<Source.Lens_Graphql>,
	body: { query: string, variables?: Record<string, JsonValue> },
): Promise<T> => {
	const k = publicEnv.PUBLIC_LENS_API_KEY
	const out = await getJson<LensGqlResponse<T>>(lensGraphqlUrl, {
		origins: lensApiOrigins,
		init: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(
					typeof k === 'string' && k.trim() !== '' ?
						{ 'x-lens-app': k.trim() }
					:
						{}
				),
			},
			body: JSON.stringify(body),
		},
	})
	if (out.errors?.[0]?.message != null) {
		throw new Error(`Lens_Graphql: ${out.errors[0].message}`)
	}
	return out.data
}
