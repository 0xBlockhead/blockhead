import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { AnthropicJson } from '$/sources/Anthropic/Rest/types.ts'

const requestAnthropicJson = async ({
	binding,
	path,
	credential,
	anthropicVersion,
}: {
	binding: SourceBinding
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

	return response.json<AnthropicJson>()
}

export const listModels = ({
	binding,
	credential,
	anthropicVersion,
}: {
	binding: SourceBinding
	credential: string
	anthropicVersion: string
}) => requestAnthropicJson({
	binding,
	path: '/v1/models',
	credential,
	anthropicVersion,
})

export const retrieveModel = ({
	binding,
	modelId,
	credential,
	anthropicVersion,
}: {
	binding: SourceBinding
	modelId: string
	credential: string
	anthropicVersion: string
}) => requestAnthropicJson({
	binding,
	path: `/v1/models/${encodeURIComponent(modelId)}`,
	credential,
	anthropicVersion,
})
