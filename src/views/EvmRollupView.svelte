<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		layout = EntityLayout.Summary,
		title = 'Rollup',
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.EvmRollup>
		open?: boolean
		layout?: EntityLayout
		title?: string
	} = $props()


	const rollup = $derived(selection({
			sources: [
				Source.L2Beat_Rest,
			],
		},
	))
	
	
	
	
	
	



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{title}
>
	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary resource={rollup.name} placeholderText="Loading rollup name…">
				{#snippet children(name)}
					{#if name !== undefined}
						<div>
							<dt>Name</dt>
							<dd>{name}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={rollup.type} placeholderText="Loading rollup type…">
				{#snippet children(type)}
					{#if type !== undefined}
						<div>
							<dt>Type</dt>
							<dd>{type}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={rollup.category} placeholderText="Loading rollup category…">
				{#snippet children(category)}
					{#if category !== undefined}
						<div>
							<dt>Category</dt>
							<dd>{category}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={rollup.hostChain} placeholderText="Loading host chain…">
				{#snippet children(hostChain)}
					{#if hostChain !== undefined}
						<div>
							<dt>Host chain</dt>
							<dd>{hostChain}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={rollup.$settlementNetwork} placeholderText="Loading settlement network…">
				{#snippet children(settlementNetwork)}
					{#if settlementNetwork !== undefined}
						<div>
							<dt>Settlement network</dt>
							<dd>
									<EvmNetworkView selection={select(EntityType.EvmNetwork, settlementNetwork.entitySelector)} layout={EntityLayout.Title} open={false} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={rollup.isUnderReview} placeholderText="Loading rollup status…">
				{#snippet children(isUnderReview)}
					{#if isUnderReview === true}
						<div>
							<dt>Status</dt>
							<dd>Under review</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
