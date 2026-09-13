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
	}: EntityListViewProps<EntityType.TonShard_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonShard_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonShardTimestamp })}
		{@const tonShardTimestampSelector = tonShardTimestamp[EntityMetaKey.Selector]}
		{@const workchain = tonShardTimestampSelector.$workchain}
		<EntityView
			entityType={EntityType.TonShard_Timestamp}
			entitySelector={tonShardTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/workchain/[workchain=nonNegativeInteger]/(tonWorkchain)/shard/[shardPrefix=stringSegment]/[seqno=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							workchain.$network.caip2 !== undefined ?
								caip2StringFromValue(workchain.$network.caip2)
							:
								workchain.$network.slug
						),
						workchain: String(workchain.workchain),
						shardPrefix: tonShardTimestampSelector.shardPrefix,
						seqno: String(tonShardTimestampSelector.seqno),
						source: tonShardTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON shard timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
