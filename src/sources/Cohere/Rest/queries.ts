import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { CohereJson } from '$/sources/Cohere/Rest/types.ts'

const requestCohereJson = async ({
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

	return response.json<CohereJson>()
}

export const listModels = ({
	binding,
	credential,
}: {
	binding: SourceBinding
	credential: string
}) => requestCohereJson({
	binding,
	path: '/v1/models',
	credential,
})
