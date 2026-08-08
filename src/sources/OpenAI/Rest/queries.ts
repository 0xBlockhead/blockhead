import bindings from '$/sources/OpenAI/bindings.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type {
	OpenAIModel,
	OpenAIModelList,
} from '$/sources/OpenAI/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.OpenAI_Rest].at(0)!

const requestOpenAiJson = async <_Response>({
	path,
}: {
	path: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString())

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<_Response>()
}

export const listModels = () => requestOpenAiJson<OpenAIModelList>({
	path: '/v1/models',
})

export const retrieveModel = ({
	modelId,
}: {
	modelId: string
}) => requestOpenAiJson<OpenAIModel>({
	path: `/v1/models/${encodeURIComponent(modelId)}`,
})
