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
	}: EntityListViewProps<EntityType.StarknetStorageEntry_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetStorageEntry_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$entry: true,
				blockNumber: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetStorageEntryTimestamp })}
		{@const starknetStorageEntryTimestampSelector = starknetStorageEntryTimestamp[EntityMetaKey.Selector]}
		{@const entry = starknetStorageEntryTimestampSelector.$entry}
		<EntityView
			entityType={EntityType.StarknetStorageEntry_Timestamp}
			entitySelector={starknetStorageEntryTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/storage/[storageKey=stringSegment]/(starknetStorageEntry)/block/[blockNumber=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in entry.$contract.$network.$network ?
								caip2StringFromValue(entry.$contract.$network.$network.caip2)
							:
								entry.$contract.$network.$network.slug
						),
						accountId: entry.$contract.address,
						storageKey: entry.storageKey,
						blockNumber: String(starknetStorageEntryTimestampSelector.blockNumber),
						source: starknetStorageEntryTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetStorageEntryTimestampSelector.$entry.storageKey || 'starknet storage entry'}
			{/snippet}

			{#snippet Value()}
				{starknetStorageEntryTimestampSelector.blockNumber}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetStorageEntryTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
