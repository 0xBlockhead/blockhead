import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type {
	OpenAIModel,
	OpenAIModelList,
} from '$/sources/OpenAI/Rest/types.ts'

const getJson = async <_Response>({
	binding,
	path,
}: {
	binding: SourceBinding
	path: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString())

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<_Response>()
}

export const listModels = ({
	binding,
}: {
	binding: SourceBinding
}) => getJson<OpenAIModelList>({
	binding,
	path: '/v1/models',
})

export const retrieveModel = ({
	binding,
	modelId,
}: {
	binding: SourceBinding
	modelId: string
}) => getJson<OpenAIModel>({
	binding,
	path: `/v1/models/${encodeURIComponent(modelId)}`,
})
