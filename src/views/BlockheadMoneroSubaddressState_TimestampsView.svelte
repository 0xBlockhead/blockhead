<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Monero subaddress state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroSubaddressState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				balanceAtomicUnits: true,
				used: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroSubaddressStateTimestamp })}
		{@const blockheadMoneroSubaddressStateTimestampSelector = blockheadMoneroSubaddressStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
			entitySelector={blockheadMoneroSubaddressStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadMoneroSubaddressStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadMoneroSubaddressStateTimestamp.balanceAtomicUnits ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroSubaddressStateTimestamp.used ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
