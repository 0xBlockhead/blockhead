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
	}: EntityListViewProps<EntityType.EvmNetwork_Txpool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					pendingCount: true,
					queuedCount: true,
					$network: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkTxpoolTimestamp })}
		{@const evmNetworkTxpoolTimestampSelector = evmNetworkTxpoolTimestamp[EntityMetaKey.Selector]}
		{@const network = evmNetworkTxpoolTimestampSelector.$network}
		<EntityView
			entityType={EntityType.EvmNetwork_Txpool_Timestamp}
			entitySelector={evmNetworkTxpoolTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						timestampMs: String(evmNetworkTxpoolTimestampSelector.timestampMs),
						source: evmNetworkTxpoolTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{[String(evmNetworkTxpoolTimestamp.pendingCount) + ' pending', String(evmNetworkTxpoolTimestamp.queuedCount) + ' queued'].filter(Boolean).join(' ') || 'EVM network txpool timestamp'}
			{/snippet}

			{#snippet Value()}
				{evmNetworkTxpoolTimestamp.pendingCount + ' pending'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkTxpoolTimestamp.$network.name || (evmNetworkTxpoolTimestamp.$network.caip2 == null ? '' : `${evmNetworkTxpoolTimestamp.$network.caip2.namespace}:${evmNetworkTxpoolTimestamp.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
