<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Zcash note state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZcashNoteState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashNoteState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				spent: true,
				confirmations: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZcashNoteStateTimestamp })}
		{@const blockheadZcashNoteStateTimestampSelector = blockheadZcashNoteStateTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZcashNoteState_Timestamp}
			entitySelector={blockheadZcashNoteStateTimestampSelector}
		>
			{#snippet Title()}
				{String(blockheadZcashNoteStateTimestampSelector.timestampMs) || 'blockhead zcash note state timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadZcashNoteStateTimestamp.spent ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadZcashNoteStateTimestamp.confirmations ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
