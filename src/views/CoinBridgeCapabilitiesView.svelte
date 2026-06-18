<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Bridge capabilities',
		open = $bindable(true),
		collapsible = true,
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
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinBridgeCapabilityView from '$/views/CoinBridgeCapabilityView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CoinBridgeCapability}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Directed edges between deployments for this coin, one row per LI.FI bridge tool.
		</p>
		<p>
			Mechanics (rail, settlement, verification, asset outcome) come from the catalog, not live quotes.
		</p>
		<p>
			For executable routes and amounts, use bridge quote flows elsewhere in the app.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No bridge capabilities yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Constants_Internal,
						Source.Lifi_Rest,
					],
				})} placeholderText="Loading bridge capabilities…">
				{#snippet children(capabilities)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.CoinBridgeCapability}
				{title}
				open={true}
				items={capabilities.entities}
				getKey={(capability) => stringify(capability.entitySelector)}
				getSortValue={(capability) => stringify(capability.entitySelector)}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No bridge capabilities yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<CoinBridgeCapabilityView
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
