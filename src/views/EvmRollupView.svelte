<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const rollup = useEntity(
		EntityType.EvmRollup,
		entityId,
		(
			open ?
				{
					$: [
						Source.L2Beat_Rest,
					],
					$settlementNetwork: {},
					name: {},
					slug: {},
					type: {},
					category: {},
					hostChain: {},
					isArchived: {},
					isUpcoming: {},
					isUnderReview: {},
				}
			:
				{}
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
					{#if rollup.name !== undefined}
						<div>
							<dt>Name</dt>
							<dd>{rollup.name}</dd>
						</div>
					{/if}

					{#if rollup.type !== undefined}
						<div>
							<dt>Type</dt>
							<dd>{rollup.type}</dd>
						</div>
					{/if}

					{#if rollup.category !== undefined}
						<div>
							<dt>Category</dt>
							<dd>{rollup.category}</dd>
						</div>
					{/if}

					{#if rollup.hostChain !== undefined}
						<div>
							<dt>Host chain</dt>
							<dd>{rollup.hostChain}</dd>
						</div>
					{/if}

					{#if rollup.$settlementNetwork !== undefined}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<EvmNetworkView
									entityId={rollup.$settlementNetwork[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if rollup.isUnderReview === true}
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
