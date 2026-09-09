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
		title = 'Blockhead Kaspa node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadKaspaNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				isSynced: true,
				hasUtxoIndex: true,
				peerCount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadKaspaNodeStateTimestamp })}
		{@const blockheadKaspaNodeStateTimestampSelector = blockheadKaspaNodeStateTimestamp[EntityMetaKey.Selector]}
		{@const nodeState = blockheadKaspaNodeStateTimestampSelector.$nodeState}
		<EntityView
			entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
			entitySelector={blockheadKaspaNodeStateTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/~/kaspa/connection/[connectionId=stringSegment]/node-state/(blockheadKaspaNodeState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in nodeState.$network.$network ?
								caip2StringFromValue(nodeState.$network.$network.caip2)
							:
								nodeState.$network.$network.slug
						),
						connectionId: nodeState.connectionId,
						timestampMs: String(blockheadKaspaNodeStateTimestampSelector.timestampMs),
						source: blockheadKaspaNodeStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadKaspaNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadKaspaNodeStateTimestamp.isSynced ?? ''), String(blockheadKaspaNodeStateTimestamp.hasUtxoIndex ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadKaspaNodeStateTimestamp.peerCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
