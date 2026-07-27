import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { MistralAiJson } from '$/sources/MistralAi/Rest/types.ts'

const requestMistralAiJson = async ({
	binding,
	path,
	credential,
}: {
	binding: SourceBinding
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

	return response.json<MistralAiJson>()
}

export const listModels = ({
	binding,
	credential,
}: {
	binding: SourceBinding
	credential: string
}) => requestMistralAiJson({
	binding,
	path: '/v1/models',
	credential,
})

export const retrieveModel = ({
	binding,
	modelId,
	credential,
}: {
	binding: SourceBinding
	modelId: string
	credential: string
}) => requestMistralAiJson({
	binding,
	path: `/v1/models/${encodeURIComponent(modelId)}`,
	credential,
})
