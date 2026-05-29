<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.HyperliquidPerpMarket>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const market = useEntity(
		EntityType.HyperliquidPerpMarket,
		entityId,
		{
			$: [
				Source.Hyperliquid_Rest,
			],
			maxLeverage: {},
			onlyIsolated: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidPerpMarket}
	{entityId}
	title={entityId.coin}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.coin}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Hyperliquid perp markets are exchange-layer markets, distinct from HyperEVM contracts.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={market}
			placeholderText="Loading Hyperliquid market…"
		>
			{#snippet children(market)}
				<dl>
					{#if market.maxLeverage != null}
						<div>
							<dt>Max leverage</dt>
							<dd><NumberValue value={market.maxLeverage} />x</dd>
						</div>
					{/if}

					{#if market.onlyIsolated != null}
						<div>
							<dt>Only isolated</dt>
							<dd>{market.onlyIsolated ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
