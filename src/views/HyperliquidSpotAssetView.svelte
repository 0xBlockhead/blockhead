<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidSpotAsset>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
		entityType={EntityType.HyperliquidSpotAsset}
	entitySelector={selection.entitySelector}
	title={String(selection.entitySelector.assetId)}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={String(selection.entitySelector.assetId)}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { name: true, szDecimals: true } })}
			placeholderText={`Loading Hyperliquid Spot Asset...`}
		>
			{#snippet children(hyperliquidSpotAsset)}
				<dl>
					{#if hyperliquidSpotAsset.name != null}
						<div>
							<dt>Name</dt>
							<dd>{hyperliquidSpotAsset.name}</dd>
						</div>
					{/if}

					{#if hyperliquidSpotAsset.szDecimals != null}
						<div>
							<dt>Sz Decimals</dt>
							<dd><NumberValue value={hyperliquidSpotAsset.szDecimals} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
