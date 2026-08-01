import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/Cohere/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Cohere_Rest]

export const listModels = async ({
	credential,
}: {
	credential: string
}) => {
	const response = await sourceFetch(binding, new URL('/v1/models', firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			'authorization': `Bearer ${credential}`,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<JsonValue>()
}
