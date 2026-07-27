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
	}: EntityListViewProps<EntityType.BlockheadPanel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadPanel}
	bind:open
	resource={
		selection({
			fields: {
				kind: true,
				entityType: true,
				indexInParent: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadPanel })}
		<EntityView
			entityType={EntityType.BlockheadPanel}
			entitySelector={blockheadPanel[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadPanel.kind || 'panel'}
			{/snippet}

			{#snippet Value()}
				{(blockheadPanel.entityType ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadPanel.indexInParent)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
