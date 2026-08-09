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
		id = 'NearContractStorageEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.NearContractStorageEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContractStorageEntry}
	{id}
	bind:open
	resource={
		selection({
			...{
				fields: {
					keyBase64: true,
					valueHash: true,
					blockHeight: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: nearContractStorageEntry })}
		{@const nearContractStorageEntrySelector = nearContractStorageEntry[EntityMetaKey.Selector]}
		{@const contract = nearContractStorageEntrySelector.$contract}
		<EntityView
			entityType={EntityType.NearContractStorageEntry}
			entitySelector={nearContractStorageEntrySelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/storage/[keyBase64=stringSegment]/block/[blockHeight=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in contract.$network ?
								caip2StringFromValue(contract.$network.caip2)
							:
								contract.$network.slug
						),
						address: contract.accountId,
						keyBase64: nearContractStorageEntrySelector.keyBase64,
						blockHeight: String(nearContractStorageEntrySelector.blockHeight),
						source: nearContractStorageEntrySelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{nearContractStorageEntrySelector.keyBase64 || 'near contract storage entry'}
			{/snippet}

			{#snippet Value()}
				{nearContractStorageEntry.valueHash ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearContractStorageEntrySelector.blockHeight}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
