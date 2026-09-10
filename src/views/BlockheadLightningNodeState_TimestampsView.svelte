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
	}: EntityListViewProps<EntityType.BlockheadLightningNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				syncedToChain: true,
				syncedToGraph: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLightningNodeStateTimestamp })}
		{@const blockheadLightningNodeStateTimestampSelector = blockheadLightningNodeStateTimestamp[EntityMetaKey.Selector]}
		{@const localNodeState = blockheadLightningNodeStateTimestampSelector.$localNodeState}
		<EntityView
			entityType={EntityType.BlockheadLightningNodeState_Timestamp}
			entitySelector={blockheadLightningNodeStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/lightning/connection/[connectionId=stringSegment]/node-state/(blockheadLightningNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in localNodeState.$network.$network ?
								caip2StringFromValue(localNodeState.$network.$network.caip2)
							:
								localNodeState.$network.$network.slug
						),
						connectionId: localNodeState.connectionId,
						timestampMs: String(blockheadLightningNodeStateTimestampSelector.timestampMs),
						source: blockheadLightningNodeStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLightningNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadLightningNodeStateTimestamp.syncedToChain ?? ''), String(blockheadLightningNodeStateTimestamp.syncedToGraph ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLightningNodeStateTimestamp.blockHeight ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
