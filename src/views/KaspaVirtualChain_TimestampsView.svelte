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
		title = 'Kaspa virtual-chain observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.KaspaVirtualChain_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaVirtualChain_Timestamp}
	{title}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaVirtualChainTimestamp })}
		{@const kaspaVirtualChainTimestampSelector = kaspaVirtualChainTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.KaspaVirtualChain_Timestamp}
			entitySelector={kaspaVirtualChainTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/virtual-chain/[startHash=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							kaspaVirtualChainTimestampSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(kaspaVirtualChainTimestampSelector.$network.$network.caip2)
							:
								kaspaVirtualChainTimestampSelector.$network.$network.slug
						),
						startHash: kaspaVirtualChainTimestampSelector.startHash,
						timestampMs: String(kaspaVirtualChainTimestampSelector.timestampMs),
						source: kaspaVirtualChainTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
