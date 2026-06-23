import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { sourceFetch, firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { throwHttpError } from '$/lib/http.ts'
import type { MlflowJson } from '$/sources/Mlflow/Rest/types.ts'

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

	return response.json<MlflowJson>()
}

export const searchRegisteredModels = ({
	binding,
	credential,
	filter,
}: {
	binding: SourceBinding
	credential: string
	filter?: string
}) => getJson({
	binding,
	path: `/api/2.0/mlflow/registered-models/search${
		filter == null || filter === '' ?
			''
		:
			`?${new URLSearchParams({ filter })}`
	}`,
	credential,
})

export const searchModelVersions = ({
	binding,
	credential,
	filter,
}: {
	binding: SourceBinding
	credential: string
	filter?: string
}) => getJson({
	binding,
	path: `/api/2.0/mlflow/model-versions/search${
		filter == null || filter === '' ?
			''
		:
			`?${new URLSearchParams({ filter })}`
	}`,
	credential,
})
