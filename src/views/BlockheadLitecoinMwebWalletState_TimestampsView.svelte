<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Litecoin MWEB wallet state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLitecoinMwebWalletState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balanceLitoshis: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadLitecoinMwebWalletStateTimestamp })}
		{@const blockheadLitecoinMwebWalletStateTimestampSelector = blockheadLitecoinMwebWalletStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
			entitySelector={blockheadLitecoinMwebWalletStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadLitecoinMwebWalletStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLitecoinMwebWalletStateTimestamp.balanceLitoshis ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLitecoinMwebWalletStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
