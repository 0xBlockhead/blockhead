<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'State channel states',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadStateChannelState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannelState}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				version: true,
				isFinal: true,
				timestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadStateChannelState })}
		{@const blockheadStateChannelStateSelector = blockheadStateChannelState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadStateChannelState}
			entitySelector={blockheadStateChannelStateSelector}
		>
			{#snippet Title()}
				{blockheadStateChannelStateSelector.version}
			{/snippet}

			{#snippet Value()}
				{blockheadStateChannelState.isFinal}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadStateChannelState.timestamp}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
