<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium account state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadQuilibriumAccountState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
	{title}
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
	{#snippet Item({ item: blockheadQuilibriumAccountStateTimestamp })}
		{@const blockheadQuilibriumAccountStateTimestampSelector = blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
			entitySelector={blockheadQuilibriumAccountStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadQuilibriumAccountStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadQuilibriumAccountStateTimestamp.balance ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadQuilibriumAccountStateTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
