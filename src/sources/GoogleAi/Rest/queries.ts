import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { GoogleAiJson } from '$/sources/GoogleAi/Rest/types.ts'

const getJson = async ({
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
			'x-goog-api-key': credential,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<GoogleAiJson>()
}

export const listModels = ({
	binding,
	credential,
}: {
	binding: SourceBinding
	credential: string
}) => getJson({
	binding,
	path: '/v1beta/models',
	credential,
})

export const retrieveModel = ({
	binding,
	modelName,
	credential,
}: {
	binding: SourceBinding
	modelName: string
	credential: string
}) => getJson({
	binding,
	path: `/v1beta/${modelName}`,
	credential,
})
