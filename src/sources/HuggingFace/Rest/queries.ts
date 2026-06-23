import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { HuggingFaceJson } from '$/sources/HuggingFace/Rest/types.ts'

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
			'authorization': `Bearer ${credential}`,
		},
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<HuggingFaceJson>()
}

export const listModels = ({
	binding,
	credential,
	search,
}: {
	binding: SourceBinding
	credential: string
	search?: string
}) => getJson({
	binding,
	path: `/api/models${
		search == null || search === '' ?
			''
		:
			`?${new URLSearchParams({ search })}`
	}`,
	credential,
})

export const retrieveModel = ({
	binding,
	repoId,
	credential,
}: {
	binding: SourceBinding
	repoId: string
	credential: string
}) => getJson({
	binding,
	path: `/api/models/${repoId}`,
	credential,
})
