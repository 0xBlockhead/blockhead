import { type } from 'arktype'
import bindings from '$/sources/OpenAI/bindings.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type {
	OpenAIModel,
	OpenAIModelList,
} from '$/sources/OpenAI/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = Object.fromEntries(bindings[Source.OpenAI_Rest].map((binding) => [binding.target.key, binding]))['openai-api']

const openAiModelWire = type({
	id: 'string > 0',
	object: "'model'",
	created: 'number.integer >= 0',
	owned_by: 'string > 0',
})
const openAiModelListWire = type({
	object: "'list'",
	data: openAiModelWire.array(),
})

const requestOpenAiJson = async ({
	path,
}: {
	path: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString())

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<unknown>()
}

const assertOpenAiModel = (response: unknown): OpenAIModel => {
	try {
		return openAiModelWire.assert(response)
	} catch {
		throw new Error('OpenAI_Rest: invalid model response envelope')
	}
}

const assertOpenAiModelList = (response: unknown): OpenAIModelList => {
	try {
		return openAiModelListWire.assert(response)
	} catch {
		throw new Error('OpenAI_Rest: invalid model list response envelope')
	}
}

export const listModels = () => requestOpenAiJson({
	path: '/v1/models',
}).then(assertOpenAiModelList)

export const retrieveModel = ({
	modelId,
}: {
	modelId: string
}) => requestOpenAiJson({
	path: `/v1/models/${encodeURIComponent(modelId)}`,
}).then(assertOpenAiModel)
