import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

export const listModels = async (binding: SourceBinding, {
	credential,
}: {
	credential: string
}) => {
	const response = await sourceFetch(binding, new URL('/v1/models', firstHttpUrlForBinding(binding)).toString(), {
		redirect: 'manual',
		headers: {
			'authorization': `Bearer ${credential}`,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<JsonValue>()
}
