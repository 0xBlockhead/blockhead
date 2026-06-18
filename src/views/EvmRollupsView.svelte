<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
		// State
	let {
		selection,
		title = 'Rollups',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmRollup}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			L2Beat rollup projects linked to this execution network when chain metadata matches.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
				<ResourceBoundary
					resource={selection({
						sources: [
							Source.L2Beat_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading rollups…"
			>
				{#snippet children(rollups)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmRollup}
				id={`${id}-items`}
				href={href}
				getKey={(rollup) => rollup[EntityMetaKey.Selector].projectId}
				placeholderText="Loading rollups…"
				items={rollups.values}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No rollups mapped here yet.
					</p>
				{/snippet}

				{#snippet Item({ item: rollup })}
					<EvmRollupView
						selector={rollup[EntityMetaKey.Selector]}
						layout={EntityLayout.Summary}

					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
