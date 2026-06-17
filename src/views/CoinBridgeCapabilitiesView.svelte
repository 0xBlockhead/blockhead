<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Bridge capabilities',
		open = $bindable(true),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.CoinBridgeCapability
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
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: (
							entityFieldReference.entityType === EntityType.Coin ?
								[
									Source.Constants_Internal,
									Source.Coingecko_Rest,
								]
							:
								[
									Source.Constants_Internal,
									Source.Coingecko_Rest,
									Source.Lifi_Rest,
								]
						),
					}
				).field(entityFieldReference.fieldName, {
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
