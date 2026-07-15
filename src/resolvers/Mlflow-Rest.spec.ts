import { describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'

const getRegisteredModel = vi.hoisted(() => vi.fn())
const getModelVersion = vi.hoisted(() => vi.fn())
const listArtifacts = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Mlflow/Rest/queries.ts', () => ({
	getRegisteredModel,
	getModelVersion,
	listArtifacts,
}))

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	publicEnv: {
		MLFLOW_TRACKING_URL: 'https://mlflow.example',
	},
} as const

describe('MLflow resolver mappings', () => {
	it('maps registered model versions without replacing provider model identity', async () => {
		getRegisteredModel.mockResolvedValue({
			registered_model: {
				name: 'fraud-detector',
				creation_timestamp: 1_700_000_000_000,
				latest_versions: [{
					name: 'fraud-detector',
					version: '7',
				}],
			},
		})
		const { mlflowResolvers } = await import('$/resolvers/Mlflow-Rest.ts')
		const model = await mlflowResolvers[0].resolve.ProviderModelId({
			$provider: {
				providerId: 'mlflow',
			},
			providerModelId: 'fraud-detector',
		}, context)

		expect(mlflowResolvers[0].projections.$$versions(model)).toEqual([{
			[EntityMetaKey.Selector]: {
				$model: {
					$provider: {
						providerId: 'mlflow',
					},
					providerModelId: 'fraud-detector',
				},
				versionId: '7',
			},
		}])
	})

	it('maps model-version artifacts and artifact-backed documents', async () => {
		getModelVersion.mockResolvedValue({
			model_version: {
				name: 'fraud-detector',
				version: '7',
				run_id: 'run-123',
				source: 'model/MLmodel',
			},
		})
		listArtifacts.mockResolvedValue({
			root_uri: 'https://mlflow.example/artifacts/run-123',
			files: [{
				path: 'model/MLmodel',
				is_dir: false,
				file_size: 128,
			}],
		})
		const { mlflowResolvers } = await import('$/resolvers/Mlflow-Rest.ts')
		const version = await mlflowResolvers[1].resolve.ModelVersionId({
			$model: {
				$provider: {
					providerId: 'mlflow',
				},
				providerModelId: 'fraud-detector',
			},
			versionId: '7',
		}, context)
		expect(mlflowResolvers[1].projections.$artifact(version)).toEqual({
			[EntityMetaKey.Selector]: {
				$provider: {
					providerId: 'mlflow',
				},
				providerArtifactId: 'run-123::model/MLmodel',
			},
		})

		const artifact = await mlflowResolvers[2].resolve.ProviderArtifactId({
			$provider: {
				providerId: 'mlflow',
			},
			providerArtifactId: 'run-123::model/MLmodel',
		}, context)
		expect(mlflowResolvers[2].projections.size(artifact)).toBe(128)
		expect(mlflowResolvers[2].projections.$$documents(artifact)).toHaveLength(1)
	})

	it('fails closed when the MLflow endpoint is not configured', async () => {
		const { mlflowResolvers } = await import('$/resolvers/Mlflow-Rest.ts')
		await expect(mlflowResolvers[0].resolve.ProviderModelId({
			$provider: {
				providerId: 'mlflow',
			},
			providerModelId: 'fraud-detector',
		}, {
			...context,
			publicEnv: {},
		})).rejects.toThrow('Missing or empty source endpoint env: MLFLOW_TRACKING_URL')
	})
})
