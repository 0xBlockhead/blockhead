<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		title = 'Pool observations',
		open = $bindable(true),
		selection,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LiquidityPool_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LiquidityPool_TimestampView from '$/views/LiquidityPool_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.LiquidityPool_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped pool observations separate volatile market metrics from the stable pool identity.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No pool observations yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [Source.Dexscreener_OpenApi],
					limit: 64,
				})} placeholderText="Loading pool observations…">
				{#snippet children(timestamps)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						{...EntitiesListProps}
						entityType={EntityType.LiquidityPool_Timestamp}
						getKey={(timestamp) => stringify(timestamp.entitySelector)}
						getSortValue={(timestamp) => String(timestamp.entitySelector.timestampMs)}
						placeholderKeys={new SvelteSet<string>()}
						items={timestamps.entities}
						{title}
						open={true}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No pool observations yet.</p>
						{/snippet}
						{#snippet Item({ item })}
							<LiquidityPool_TimestampView
								selection={select(EntityType.LiquidityPool_Timestamp, item.entitySelector)}
								id={stringify(item.entitySelector)}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
