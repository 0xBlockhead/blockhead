import { QueryClient } from '@tanstack/query-core'
import { client } from '$/client/$client.svelte.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { materializationFixtureSchema } from './client-materialization.fixture.ts'

export const createReferenceErrorFixture = () => {
	const pending = Promise.withResolvers<{ kind: string; sibling: { id: string } }>()
	const context = client({
		schema: materializationFixtureSchema,
		sourceProviders: [{
			provider: 'reference-errors',
			label: 'Reference errors',
			sources: {
				'source-a': { label: 'Source A' },
			},
			bindings: {},
		}],
	})({
		resolvers: [{
			source: 'source-a',
			resolvers: [{
				entityType: 'MaterializationParent',
				resolve: {
					Slug: { resolve: async () => ({}) },
				},
				projections: {
					$$children: () => ['pending', 'failed'].map((id) => ({
						[EntityMetaKey.Selector]: { id },
					})),
				},
			}, {
				entityType: 'MaterializationChild',
				resolve: {
					Id: {
						resolve: async ({ id }): Promise<{ kind: string; sibling: { id: string } }> => {
							if (id === 'pending')
								return pending.promise

							throw new Error('terminal child unavailable')
						},
					},
				},
				projections: {
					kind: () => 'left',
					$sibling: () => ({ [EntityMetaKey.Selector]: { id: 'finished' } }),
				},
			}],
		}],
		sourceIndex: {
			enabledBindingIds: new Set<string>(),
			enabledSources: new Set(['source-a']),
			resolverPublicEnvBySource: new Map([['source-a', {}]]),
		},
	})({
		queryClient: new QueryClient({ defaultOptions: { queries: { retry: false } } }),
		persistence: {
			adapter: {
				loadSubset: async () => [],
				applyCommittedTx: async () => {},
				ensureIndex: async () => {},
			},
		},
		schemaVersion: 1,
	})
	return {
		context,
		close: () => {
			context.destroy()
			pending.resolve({ kind: 'left', sibling: { id: 'finished' } })
		},
	}
}
