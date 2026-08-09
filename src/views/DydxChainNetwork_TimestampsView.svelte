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
		title = 'dYdX chain network observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainNetwork_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					health: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dydxChainNetworkTimestamp })}
		{@const dydxChainNetworkTimestampSelector = dydxChainNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainNetwork_Timestamp}
			entitySelector={dydxChainNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in dydxChainNetworkTimestampSelector.$network.$network ?
								caip2StringFromValue(dydxChainNetworkTimestampSelector.$network.$network.caip2)
							:
								dydxChainNetworkTimestampSelector.$network.$network.slug
						),
						timestampMs: String(dydxChainNetworkTimestampSelector.timestampMs),
						source: dydxChainNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{dydxChainNetworkTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainNetworkTimestamp.health ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
