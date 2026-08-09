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
	}: EntityListViewProps<EntityType.EvmNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					blockHeight: true,
					timestampMs: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkTimestamp })}
		{@const evmNetworkTimestampSelector = evmNetworkTimestamp[EntityMetaKey.Selector]}
		{@const network = evmNetworkTimestampSelector.$network}
		<EntityView
			entityType={EntityType.EvmNetwork_Timestamp}
			entitySelector={evmNetworkTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(evmNetworkTimestampSelector.timestampMs),
						source: evmNetworkTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{['Block ' + String(evmNetworkTimestamp.blockHeight), String(evmNetworkTimestampSelector.timestampMs)].filter(Boolean).join(' ') || 'EVM network timestamp'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkTimestamp.blockHeight}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkTimestamp.$network.name || `${evmNetworkTimestamp.$network.caip2.namespace}:${evmNetworkTimestamp.$network.caip2.reference}` || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
