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
	}: EntityListViewProps<EntityType.HederaTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTokenTransfer })}
		{@const hederaTokenTransferSelector = hederaTokenTransfer[EntityMetaKey.Selector]}
		{@const transaction = hederaTokenTransferSelector.$transaction}
		<EntityView
			entityType={EntityType.HederaTokenTransfer}
			entitySelector={hederaTokenTransferSelector}
			href={
				transaction.consensusTimestamp !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/token-transfer/[tokenId=stringSegment]/[accountId=stringSegment]/[transferIndex=nonNegativeInteger]',
						{
							network: (
								transaction.$network.caip2 !== undefined ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							consensusTimestamp: transaction.consensusTimestamp,
							tokenId: hederaTokenTransferSelector.tokenId,
							accountId: hederaTokenTransferSelector.accountId,
							transferIndex: String(hederaTokenTransferSelector.transferIndex),
						}
					)
				:
					undefined
			}
		/>
	{/snippet}
</EntitiesList>
