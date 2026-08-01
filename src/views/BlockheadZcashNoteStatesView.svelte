<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Blockhead Zcash note states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadZcashNoteState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadZcashNoteState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				noteCommitment: true,
				pool: true,
				valueZatoshis: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadZcashNoteState })}
		{@const blockheadZcashNoteStateSelector = blockheadZcashNoteState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadZcashNoteState}
			entitySelector={blockheadZcashNoteStateSelector}
		>
			{#snippet Title()}
				{blockheadZcashNoteStateSelector.noteCommitment || 'blockhead zcash note state'}
			{/snippet}

			{#snippet Value()}
				{blockheadZcashNoteStateSelector.pool}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadZcashNoteState.valueZatoshis ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
