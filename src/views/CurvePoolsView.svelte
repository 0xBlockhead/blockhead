<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CurvePool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CurvePool}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				symbol: true,
				virtualPrice: true,
				usdTotal: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: curvePool })}
		{@const curvePoolSelector = curvePool[EntityMetaKey.Selector]}
		{@const network = curvePoolSelector.$network}
		<EntityView
			entityType={EntityType.CurvePool}
			entitySelector={curvePoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/curve-pool/[poolAddress=evmAddress]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						poolAddress: curvePoolSelector.poolAddress,
					}
				)
			}
		>
			{#snippet Title()}
				{[curvePool.name, curvePool.symbol].filter(Boolean).join(' ') || 'Curve pool'}
			{/snippet}

			{#snippet Value()}
				{[(curvePool.virtualPrice ?? ''), String(curvePool.usdTotal ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{curvePool.$network.name || (curvePool.$network.caip2 == null ? '' : `${curvePool.$network.caip2.namespace}:${curvePool.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
