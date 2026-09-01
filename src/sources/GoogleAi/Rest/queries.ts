import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import bindings from '$/sources/GoogleAi/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'

const binding = bindings[Source.GoogleAi_Rest][0]

const requestGoogleAiJson = async ({
	path,
	credential,
}: {
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

	return response.json<JsonValue>()
}

export const listModels = ({
	credential,
}: {
	credential: string
}) => requestGoogleAiJson({
	path: '/v1beta/models',
	credential,
})

export const retrieveModel = ({
	modelName,
	credential,
}: {
	modelName: string
	credential: string
}) => requestGoogleAiJson({
	path: `/v1beta/${modelName.split('/').map(encodeURIComponent).join('/')}`,
	credential,
})
