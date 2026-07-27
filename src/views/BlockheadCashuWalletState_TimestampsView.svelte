<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			fields: {
				timestampMs: true,
				balance: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadCashuWalletStateTimestamp })}
		{@const blockheadCashuWalletStateTimestampSelector = blockheadCashuWalletStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadCashuWalletState_Timestamp}
			entitySelector={blockheadCashuWalletStateTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadCashuWalletStateTimestampSelector.timestampMs) || 'blockhead Cashu wallet state timestamp'}
			{/snippet}

			{#snippet Value()}
				{(String(blockheadCashuWalletStateTimestamp.balance ?? '') ? String(blockheadCashuWalletStateTimestamp.balance ?? '') + blockheadCashuWalletStateTimestampSelector.$walletState.unit : '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadCashuWalletStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
