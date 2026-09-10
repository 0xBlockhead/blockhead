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
		title = 'Blockhead Monero wallet state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroWalletState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balanceAtomicUnits: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroWalletStateTimestamp })}
		{@const blockheadMoneroWalletStateTimestampSelector = blockheadMoneroWalletStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
			entitySelector={blockheadMoneroWalletStateTimestampSelector}
			href={
				resolve(
					'/~/monero/wallet/[walletId=stringSegment]/state/(blockheadMoneroWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: blockheadMoneroWalletStateTimestampSelector.$walletState.walletId,
						timestampMs: String(blockheadMoneroWalletStateTimestampSelector.timestampMs),
						source: blockheadMoneroWalletStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadMoneroWalletStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadMoneroWalletStateTimestamp.balanceAtomicUnits ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroWalletStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
