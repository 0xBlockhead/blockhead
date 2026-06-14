<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.HyperliquidSpotAsset>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const hyperliquidSpotAsset = subscribe(EntityType.HyperliquidSpotAsset,
		selector,
		({ fields: { name: true, szDecimals: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
		entityType={EntityType.HyperliquidSpotAsset}
	entitySelector={selector}
	title={String(selector.assetId)}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={String(selector.assetId)}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidSpotAsset}
			placeholderText={`Loading Hyperliquid Spot Asset...`}
		>
			{#snippet children(hyperliquidSpotAsset)}
				<dl>
					{#if hyperliquidSpotAsset.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{hyperliquidSpotAsset.fields.name}</dd>
						</div>
					{/if}

					{#if hyperliquidSpotAsset.fields.szDecimals != null}
						<div>
							<dt>Sz Decimals</dt>
							<dd><NumberValue value={hyperliquidSpotAsset.fields.szDecimals} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
