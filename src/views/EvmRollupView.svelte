<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		layout = EntityLayout.Summary,
		title = 'Rollup',
	}: {
		selector: EntitySelector<typeof schema, EntityType.EvmRollup>
		open?: boolean
		layout?: EntityLayout
		title?: string
	} = $props()

	const rollup = subscribe(EntityType.EvmRollup,
		selector,
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
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup}
	entitySelector={selector}
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
									selector={rollup.fields.$settlementNetwork[EntityMetaKey.Selector]}
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
