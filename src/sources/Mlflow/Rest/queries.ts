import { throwHttpError } from '$/lib/http.ts'
import { resolveEnvLocator, type SourcePublicEnv } from '$/sources/$sources.ts'
import bindings from '$/sources/Mlflow/bindings.ts'
import { sourceFetch } from '$/sources/_runtime/http.ts'
import { httpUrl } from '$/sources/_shared/wire/HttpRest/client.ts'
import type {
	MlflowGetModelVersionResponse,
	MlflowGetRegisteredModelResponse,
	MlflowListArtifactsResponse,
	MlflowSearchModelVersionsResponse,
	MlflowSearchRegisteredModelsResponse,
} from '$/sources/Mlflow/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Mlflow_Rest][0]

const fetchMlflowJson = async <_Result>({
	credential,
	path,
	publicEnv,
}: {
	credential?: string
	path: string
	publicEnv: SourcePublicEnv
}) => {
	const resolvedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => ({
			...endpoint,
			locator: resolveEnvLocator(endpoint.locator, publicEnv),
		})),
	}
	const response = await sourceFetch(resolvedBinding, httpUrl(resolvedBinding, path), {
		...(credential != null && credential !== '' && {
			headers: {
				'authorization': `Bearer ${credential}`,
			},
		}),
	})

	if (!response.ok)
		await throwHttpError(resolvedBinding.source, response)

	return response.json<_Result>()
}

export const searchRegisteredModels = ({
	credential,
	filter,
	publicEnv,
}: {
	credential?: string
	filter?: string
	publicEnv: SourcePublicEnv
}) => fetchMlflowJson<MlflowSearchRegisteredModelsResponse>({
	path: `/api/2.0/mlflow/registered-models/search${
		filter == null || filter === '' ?
			''
		:
			`?${new URLSearchParams({ filter })}`
	}`,
	credential,
	publicEnv,
})

export const searchModelVersions = ({
	credential,
	filter,
	publicEnv,
}: {
	credential?: string
	filter?: string
	publicEnv: SourcePublicEnv
}) => fetchMlflowJson<MlflowSearchModelVersionsResponse>({
	path: `/api/2.0/mlflow/model-versions/search${
		filter == null || filter === '' ?
			''
		:
			`?${new URLSearchParams({ filter })}`
	}`,
	credential,
	publicEnv,
})

export const getRegisteredModel = ({
	credential,
	name,
	publicEnv,
}: {
	credential?: string
	name: string
	publicEnv: SourcePublicEnv
}) => fetchMlflowJson<MlflowGetRegisteredModelResponse>({
	path: `/api/2.0/mlflow/registered-models/get?${new URLSearchParams({ name })}`,
	credential,
	publicEnv,
})

export const getModelVersion = ({
	credential,
	name,
	publicEnv,
	version,
}: {
	credential?: string
	name: string
	publicEnv: SourcePublicEnv
	version: string
}) => fetchMlflowJson<MlflowGetModelVersionResponse>({
	path: `/api/2.0/mlflow/model-versions/get?${new URLSearchParams({
		name,
		version,
	})}`,
	credential,
	publicEnv,
})

export const listArtifacts = ({
	credential,
	path,
	publicEnv,
	runId,
}: {
	credential?: string
	path?: string
	publicEnv: SourcePublicEnv
	runId: string
}) => fetchMlflowJson<MlflowListArtifactsResponse>({
	path: `/api/2.0/mlflow/artifacts/list?${new URLSearchParams({
		run_id: runId,
		...(path != null && path !== '' && { path }),
	})}`,
	credential,
	publicEnv,
})
