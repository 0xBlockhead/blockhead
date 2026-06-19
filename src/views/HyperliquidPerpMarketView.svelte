<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidPerpMarket>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidPerpMarket}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.coin}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.coin}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Hyperliquid perp markets are exchange-layer markets, distinct from HyperEVM contracts.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.Hyperliquid_Rest,
						], fields: { maxLeverage: true, onlyIsolated: true } }),
				)}
			placeholderText="Loading Hyperliquid market…"
		>
			{#snippet children(market)}
				<dl>
					{#if market.fields.maxLeverage != null}
						<div>
							<dt>Max leverage</dt>
							<dd><NumberValue value={market.fields.maxLeverage} />x</dd>
						</div>
					{/if}

					{#if market.fields.onlyIsolated != null}
						<div>
							<dt>Only isolated</dt>
							<dd>{market.fields.onlyIsolated ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
