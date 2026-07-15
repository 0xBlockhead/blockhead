import { throwHttpError } from '$/lib/http.ts'
import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { firstHttpUrlForBinding, sourceFetch } from '$/sources/_runtime/http.ts'
import type {
	MlflowGetModelVersionResponse,
	MlflowGetRegisteredModelResponse,
	MlflowListArtifactsResponse,
	MlflowSearchModelVersionsResponse,
	MlflowSearchRegisteredModelsResponse,
} from '$/sources/Mlflow/Rest/types.ts'

const getJson = async <_Result>({
	binding,
	path,
	credential,
}: {
	binding: SourceBinding
	path: string
	credential?: string
}) => {
	const response = await sourceFetch(binding, new URL(path, firstHttpUrlForBinding(binding)).toString(), {
		...(credential != null && credential !== '' && {
			headers: {
				'authorization': `Bearer ${credential}`,
			},
		}),
	})

	if (!response.ok)
		await throwHttpError(binding.source, response)

	return response.json<_Result>()
}

export const searchRegisteredModels = ({
	binding,
	credential,
	filter,
}: {
	binding: SourceBinding
	credential?: string
	filter?: string
}) => getJson<MlflowSearchRegisteredModelsResponse>({
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
	credential?: string
	filter?: string
}) => getJson<MlflowSearchModelVersionsResponse>({
	binding,
	path: `/api/2.0/mlflow/model-versions/search${
		filter == null || filter === '' ?
			''
		:
			`?${new URLSearchParams({ filter })}`
	}`,
	credential,
})

export const getRegisteredModel = ({
	binding,
	credential,
	name,
}: {
	binding: SourceBinding
	credential?: string
	name: string
}) => getJson<MlflowGetRegisteredModelResponse>({
	binding,
	path: `/api/2.0/mlflow/registered-models/get?${new URLSearchParams({ name })}`,
	credential,
})

export const getModelVersion = ({
	binding,
	credential,
	name,
	version,
}: {
	binding: SourceBinding
	credential?: string
	name: string
	version: string
}) => getJson<MlflowGetModelVersionResponse>({
	binding,
	path: `/api/2.0/mlflow/model-versions/get?${new URLSearchParams({
		name,
		version,
	})}`,
	credential,
})

export const listArtifacts = ({
	binding,
	credential,
	runId,
	path,
}: {
	binding: SourceBinding
	credential?: string
	runId: string
	path?: string
}) => getJson<MlflowListArtifactsResponse>({
	binding,
	path: `/api/2.0/mlflow/artifacts/list?${new URLSearchParams({
		run_id: runId,
		...(path != null && path !== '' && { path }),
	})}`,
	credential,
})
