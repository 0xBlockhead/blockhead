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
	}: EntityListViewProps<EntityType.BlockheadStateChannelDeposit_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				source: true,
				availableBalance: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannelDepositTimestamp })}
		{@const blockheadStateChannelDepositTimestampSelector = blockheadStateChannelDepositTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
			entitySelector={blockheadStateChannelDepositTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadStateChannelDepositTimestampSelector.timestampMs) || 'blockhead state channel deposit timestamp'}
			{/snippet}

			{#snippet Value()}
				{blockheadStateChannelDepositTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadStateChannelDepositTimestamp.availableBalance)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
