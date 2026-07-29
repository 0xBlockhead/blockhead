<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Waku node state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadWakuNodeState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWakuNodeState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				health: true,
				peerCount: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadWakuNodeStateTimestamp })}
		{@const blockheadWakuNodeStateTimestampSelector = blockheadWakuNodeStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadWakuNodeState_Timestamp}
			entitySelector={blockheadWakuNodeStateTimestampSelector}
		>
			{#snippet Title()}
				{blockheadWakuNodeStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadWakuNodeStateTimestamp.health ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadWakuNodeStateTimestamp.peerCount ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
