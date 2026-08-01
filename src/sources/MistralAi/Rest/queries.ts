import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/MistralAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.MistralAi_Rest]

const requestMistralAiJson = async ({
	path,
	credential,
}: {
	path: string
	credential: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			'authorization': `Bearer ${credential}`,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<JsonValue>()
}

export const listModels = ({
	credential,
}: {
	credential: string
}) => requestMistralAiJson({
	path: '/v1/models',
	credential,
})

export const retrieveModel = ({
	modelId,
	credential,
}: {
	modelId: string
	credential: string
}) => requestMistralAiJson({
	path: `/v1/models/${encodeURIComponent(modelId)}`,
	credential,
})
