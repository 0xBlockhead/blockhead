<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.LiquidityPool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Dexscreener-backed liquidity pools are token-pair pool rows, not an exhaustive on-chain registry.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LiquidityPool}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Dexscreener_OpenApi,
			],
			fields: {
				id: true,
				$network: true,
			},
			limit: 300,
		})
	}
>
	{#snippet Item({ item: liquidityPool })}
		{@const liquidityPoolSelector = liquidityPool[EntityMetaKey.Selector]}
		{@const network = liquidityPoolSelector.$network}
		<EntityView
			entityType={EntityType.LiquidityPool}
			entitySelector={liquidityPoolSelector}
			href={
				'caip2' in network ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]',
						{
							chainId: network.caip2.reference,
							poolId: liquidityPoolSelector.id,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{liquidityPoolSelector.id || 'liquidity pool'}
			{/snippet}

			{#snippet Value()}
				{liquidityPoolSelector.id}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{liquidityPool.$network.name || (liquidityPoolSelector.$network.caip2 == null ? '' : `${liquidityPoolSelector.$network.caip2.namespace}:${liquidityPoolSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
