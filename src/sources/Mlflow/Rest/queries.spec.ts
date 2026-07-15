import { beforeEach, describe, expect, it, vi } from 'vitest'

import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
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

const bindingDefinition = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => candidate.source === Source.Mlflow_Rest)

if (bindingDefinition == null)
	throw new Error('MLflow test binding is missing')

const binding = {
	...bindingDefinition,
	endpoints: bindingDefinition.endpoints.map((endpoint) => ({
		...endpoint,
		locator: 'https://mlflow.example',
	})),
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
			binding,
			name: 'fraud-detector',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://mlflow.example/api/2.0/mlflow/registered-models/get?name=fraud-detector',
			{}
		)

		await getModelVersion({
			binding,
			name: 'fraud-detector',
			version: '7',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://mlflow.example/api/2.0/mlflow/model-versions/get?name=fraud-detector&version=7',
			{}
		)
	})

	it('addresses artifacts by run and provider path', async () => {
		await listArtifacts({
			binding,
			runId: 'run-123',
			path: 'model/MLmodel',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://mlflow.example/api/2.0/mlflow/artifacts/list?run_id=run-123&path=model%2FMLmodel',
			{}
		)
	})
})
