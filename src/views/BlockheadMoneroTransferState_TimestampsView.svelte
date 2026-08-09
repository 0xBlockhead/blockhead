<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Monero transfer state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroTransferState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					spent: true,
					confirmations: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroTransferStateTimestamp })}
		{@const blockheadMoneroTransferStateTimestampSelector = blockheadMoneroTransferStateTimestamp[EntityMetaKey.Selector]}
		{@const transferState = blockheadMoneroTransferStateTimestampSelector.$transferState}
		<EntityView
			entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
			entitySelector={blockheadMoneroTransferStateTimestampSelector}
			href={
				resolve(
					'/~/monero/wallet/[walletId=stringSegment]/transfer-state/[txHash=stringSegment]/[transferIndex=nonNegativeInteger]/(blockheadMoneroTransferState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: transferState.walletId,
						txHash: transferState.txHash,
						transferIndex: String(transferState.transferIndex),
						timestampMs: String(blockheadMoneroTransferStateTimestampSelector.timestampMs),
						source: blockheadMoneroTransferStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadMoneroTransferStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadMoneroTransferStateTimestamp.spent ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroTransferStateTimestamp.confirmations ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
