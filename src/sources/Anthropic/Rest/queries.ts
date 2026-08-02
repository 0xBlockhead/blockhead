import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/Anthropic/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.Anthropic_Rest][0]

const requestAnthropicJson = async ({
	path,
	credential,
	anthropicVersion,
}: {
	path: string
	credential: string
	anthropicVersion: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		headers: {
			'anthropic-version': anthropicVersion,
			'x-api-key': credential,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<JsonValue>()
}

export const listModels = ({
	credential,
	anthropicVersion,
}: {
	credential: string
	anthropicVersion: string
}) => requestAnthropicJson({
	path: '/v1/models',
	credential,
	anthropicVersion,
})

export const retrieveModel = ({
	modelId,
	credential,
	anthropicVersion,
}: {
	modelId: string
	credential: string
	anthropicVersion: string
}) => requestAnthropicJson({
	path: `/v1/models/${encodeURIComponent(modelId)}`,
	credential,
	anthropicVersion,
})
