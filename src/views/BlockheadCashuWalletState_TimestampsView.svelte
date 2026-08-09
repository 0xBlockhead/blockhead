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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadCashuWalletState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuWalletState_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					balance: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuWalletStateTimestamp })}
		{@const blockheadCashuWalletStateTimestampSelector = blockheadCashuWalletStateTimestamp[EntityMetaKey.Selector]}
		{@const walletState = blockheadCashuWalletStateTimestampSelector.$walletState}
		<EntityView
			entityType={EntityType.BlockheadCashuWalletState_Timestamp}
			entitySelector={blockheadCashuWalletStateTimestampSelector}
			href={
				resolve(
					'/~/cashu/wallet/[walletId=stringSegment]/mint/[mintUrl=stringSegment]/[unit=stringSegment]/(blockheadCashuWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: walletState.walletId,
						mintUrl: walletState.mintUrl,
						unit: walletState.unit,
						timestampMs: String(blockheadCashuWalletStateTimestampSelector.timestampMs),
						source: blockheadCashuWalletStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadCashuWalletStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadCashuWalletStateTimestamp.balance != null ? blockheadCashuWalletStateTimestamp.balance + blockheadCashuWalletStateTimestampSelector.$walletState.unit : ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCashuWalletStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
