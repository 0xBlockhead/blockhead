<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
				selectedProtocol: true,
				indexInSequence: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSessionAction })}
		{@const blockheadSessionActionSelector = blockheadSessionAction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSessionAction}
			entitySelector={blockheadSessionActionSelector}
			href={
				resolve(
					'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]',
					{
						sessionId: blockheadSessionActionSelector.sessionId,
						actionId: blockheadSessionActionSelector.actionId,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadSessionAction.selectedProtocol ?? '') || 'blockhead session action'}
			{/snippet}

			{#snippet Value()}
				{blockheadSessionAction.indexInSequence}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSessionAction.indexInSequence}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
