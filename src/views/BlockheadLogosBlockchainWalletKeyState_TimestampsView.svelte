<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
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
	{#snippet Item({ item: blockheadLogosBlockchainWalletKeyStateTimestamp })}
		{@const blockheadLogosBlockchainWalletKeyStateTimestampSelector = blockheadLogosBlockchainWalletKeyStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp}
			entitySelector={blockheadLogosBlockchainWalletKeyStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadLogosBlockchainWalletKeyStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLogosBlockchainWalletKeyStateTimestamp.balance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLogosBlockchainWalletKeyStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
