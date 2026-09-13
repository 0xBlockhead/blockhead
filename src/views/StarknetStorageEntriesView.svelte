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
		id = 'StarknetStorageEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StarknetStorageEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetStorageEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				storageKey: true,
				$contract: true,
			},
		})
	}
>
	{#snippet Item({ item: starknetStorageEntry })}
		{@const starknetStorageEntrySelector = starknetStorageEntry[EntityMetaKey.Selector]}
		{@const contract = starknetStorageEntrySelector.$contract}
		<EntityView
			entityType={EntityType.StarknetStorageEntry}
			entitySelector={starknetStorageEntrySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/storage/[storageKey=stringSegment]',
					{
						network: (
							contract.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(contract.$network.$network.caip2)
							:
								contract.$network.$network.slug
						),
						accountId: contract.address,
						storageKey: starknetStorageEntrySelector.storageKey,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetStorageEntrySelector.storageKey || 'starknet storage entry'}
			{/snippet}

			{#snippet Value()}
				{starknetStorageEntrySelector.$contract.address || 'starknet contract'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
