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
		title = 'Blockhead Monero transfer states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroTransferState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroTransferState}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					txHash: true,
					direction: true,
					amountAtomicUnits: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroTransferState })}
		{@const blockheadMoneroTransferStateSelector = blockheadMoneroTransferState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroTransferState}
			entitySelector={blockheadMoneroTransferStateSelector}
			href={
				resolve(
					'/~/monero/wallet/[walletId=stringSegment]/transfer-state/[txHash=stringSegment]/[transferIndex=nonNegativeInteger]',
					{
						walletId: blockheadMoneroTransferStateSelector.walletId,
						txHash: blockheadMoneroTransferStateSelector.txHash,
						transferIndex: String(blockheadMoneroTransferStateSelector.transferIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadMoneroTransferStateSelector.txHash || 'blockhead monero transfer state'}
			{/snippet}

			{#snippet Value()}
				{blockheadMoneroTransferState.direction}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroTransferState.amountAtomicUnits ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
