<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Zcash wallet state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZcashWalletState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashWalletState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balanceZatoshis: true,
				recoveryState: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZcashWalletStateTimestamp })}
		{@const blockheadZcashWalletStateTimestampSelector = blockheadZcashWalletStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZcashWalletState_Timestamp}
			entitySelector={blockheadZcashWalletStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadZcashWalletStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadZcashWalletStateTimestamp.balanceZatoshis ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZcashWalletStateTimestamp.recoveryState ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
