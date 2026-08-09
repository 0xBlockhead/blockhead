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
		title = 'Denoms',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosDenom> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosDenom}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					symbol: true,
					display: true,
					denom: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cosmosDenom })}
		{@const cosmosDenomSelector = cosmosDenom[EntityMetaKey.Selector]}
		{@const network = cosmosDenomSelector.$network}
		<EntityView
			entityType={EntityType.CosmosDenom}
			entitySelector={cosmosDenomSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/denom/[denom=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						denom: cosmosDenomSelector.denom,
					}
				)
			}
		>
			{#snippet Title()}
				{[(cosmosDenom.symbol ?? ''), (cosmosDenom.display ?? ''), cosmosDenomSelector.denom].filter(Boolean).join(' ') || 'Cosmos denom'}
			{/snippet}

			{#snippet Value()}
				{cosmosDenomSelector.denom}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosDenom.$network.name || `${cosmosDenom.$network.caip2.namespace}:${cosmosDenom.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
