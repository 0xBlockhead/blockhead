<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		layout = EntityLayout.Summary,
		title = 'Rollup',
	}: {
		entityId: EntityId<typeof schema, EntityType.EvmRollup>
		open?: boolean
		layout?: EntityLayout
		title?: string
	} = $props()

	const rollup = useEntity(entityCollectionsContext, EntityType.EvmRollup,
		entityId,
		(
			open ?
				{
					sources: [
						Source.L2Beat_Rest,
					],
					fields: {
						$settlementNetwork: true,
						name: true,
						slug: true,
						type: true,
						category: true,
						hostChain: true,
						isArchived: true,
						isUpcoming: true,
						isUnderReview: true,
					},
				}
			:
				{ fields: {} }
		),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup}
	{entityId}
	{layout}
	bind:open
	{title}
>
	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			placeholderText="Loading rollup…"
			resource={rollup}
		>
			{#snippet children(rollup)}
				<dl data-column-item="center">
					{#if rollup.fields.name !== undefined}
						<div>
							<dt>Name</dt>
							<dd>{rollup.fields.name}</dd>
						</div>
					{/if}

					{#if rollup.fields.type !== undefined}
						<div>
							<dt>Type</dt>
							<dd>{rollup.fields.type}</dd>
						</div>
					{/if}

					{#if rollup.fields.category !== undefined}
						<div>
							<dt>Category</dt>
							<dd>{rollup.fields.category}</dd>
						</div>
					{/if}

					{#if rollup.fields.hostChain !== undefined}
						<div>
							<dt>Host chain</dt>
							<dd>{rollup.fields.hostChain}</dd>
						</div>
					{/if}

					{#if rollup.fields.$settlementNetwork !== undefined}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<EvmNetworkView
									entityId={rollup.fields.$settlementNetwork[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if rollup.fields.isUnderReview === true}
						<div>
							<dt>Status</dt>
							<dd>Under review</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
