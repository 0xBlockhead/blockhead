import { query } from '$app/server'
import { env } from '$env/dynamic/private'
import { type } from 'arktype'

import {
	getModelVersion,
	getRegisteredModel,
	listArtifacts,
} from '$/sources/Mlflow/Rest/queries.ts'

const publicEnv = {
	MLFLOW_TRACKING_URL: env.MLFLOW_TRACKING_URL ?? '',
}

export const getMlflowRegisteredModelRemote = query(
	type({ name: 'string > 0' }),
	({ name }) => getRegisteredModel({
		name,
		publicEnv,
	})
)

export const getMlflowModelVersionRemote = query(
	type({
		name: 'string > 0',
		version: 'string > 0',
	}),
	({ name, version }) => getModelVersion({
		name,
		publicEnv,
		version,
	})
)

export const listMlflowArtifactsRemote = query(
	type({
		'path?': 'string > 0',
		runId: 'string > 0',
	}),
	({ path, runId }) => listArtifacts({
		path,
		publicEnv,
		runId,
	})
)
