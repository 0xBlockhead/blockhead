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
	}: EntityListViewProps<EntityType.BlockheadSessionAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSessionAction}
	bind:open
	resource={
		selection({
			fields: {
				actionType: true,
				selectedProtocol: true,
				indexInSequence: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSessionAction })}
		<EntityView
			entityType={EntityType.BlockheadSessionAction}
			entitySelector={blockheadSessionAction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadSessionAction.actionType || 'blockhead session action'}
			{/snippet}

			{#snippet Value()}
				{(blockheadSessionAction.selectedProtocol ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(blockheadSessionAction.indexInSequence)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
