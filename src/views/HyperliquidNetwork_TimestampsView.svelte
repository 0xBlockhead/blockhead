<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Network snapshots',
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
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidNetwork_TimestampView from '$/views/HyperliquidNetwork_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.HyperliquidNetwork_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>Timestamp hyperliquidNetworkTimestamps hold observed market, spot asset, validator, and staking totals.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Hyperliquid_Rest],
					limit: 16,
				})} placeholderText="Loading network snapshots…">
				{#snippet children(timestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.HyperliquidNetwork_Timestamp}
						id={`${id}-items`}
						href={href}
						getKey={(timestamp) => stringify(timestamp.entitySelector)}
						getSortValue={(timestamp) => -timestamp.entitySelector.timestampMs}
						open={true}
						items={timestamps.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No network snapshots yet.</p>
						{/snippet}
						{#snippet Item({ item })}
							<HyperliquidNetwork_TimestampView
								selector={item.entitySelector}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
