<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.HyperliquidSpotAsset>
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

	const hyperliquidSpotAsset = useEntity(
		EntityType.HyperliquidSpotAsset,
		entityId,
		{
			name: {},
			szDecimals: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidSpotAsset}
	{entityId}
	title={entityId.assetId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.assetId}
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
