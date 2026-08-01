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
		id = 'GitTreeEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitTreeEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitTreeEntry}
	{id}
	bind:open
	resource={
		selection({
			fields: {
				path: true,
				objectKind: true,
				mode: true,
			},
		})
	}
>
	{#snippet Item({ item: gitTreeEntry })}
		{@const gitTreeEntrySelector = gitTreeEntry[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitTreeEntry}
			entitySelector={gitTreeEntrySelector}
		>
			{#snippet Title()}
				{gitTreeEntrySelector.path || 'Git tree entry'}
			{/snippet}

			{#snippet Value()}
				{gitTreeEntry.objectKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{gitTreeEntry.mode}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
