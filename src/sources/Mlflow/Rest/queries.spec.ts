import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Mlflow/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	getModelVersion,
	getRegisteredModel,
	listArtifacts,
} from '$/sources/Mlflow/Rest/queries.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceFetch,
}))

const bindingDefinition = bindings[Source.Mlflow_Rest][0]

const binding = {
	...bindingDefinition,
	endpoints: bindingDefinition.endpoints.map((endpoint) => ({
		...endpoint,
		locator: 'https://mlflow.example',
	})),
}
const publicEnv = {
	MLFLOW_TRACKING_URL: 'https://mlflow.example',
}

describe('MLflow typed queries', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
		sourceFetch.mockResolvedValue({
			ok: true,
			json: async () => ({}),
		})
	})

	it('addresses registered models and versions with typed response envelopes', async () => {
		await getRegisteredModel({
			name: 'fraud-detector',
			publicEnv,
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://mlflow.example/api/2.0/mlflow/registered-models/get?name=fraud-detector',
			{
				redirect: 'manual',
			}
		)

		await getModelVersion({
			name: 'fraud-detector',
			publicEnv,
			version: '7',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://mlflow.example/api/2.0/mlflow/model-versions/get?name=fraud-detector&version=7',
			{
				redirect: 'manual',
			}
		)
	})

	it('addresses artifacts by run and provider path', async () => {
		await listArtifacts({
			path: 'model/MLmodel',
			publicEnv,
			runId: 'run-123',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://mlflow.example/api/2.0/mlflow/artifacts/list?run_id=run-123&path=model%2FMLmodel',
			{
				redirect: 'manual',
			}
		)
	})

	it('fails closed when the tracking endpoint is not configured', async () => {
		await expect(getRegisteredModel({
			name: 'fraud-detector',
			publicEnv: {},
		})).rejects.toThrow('Missing or empty source endpoint env: MLFLOW_TRACKING_URL')
	})
})
