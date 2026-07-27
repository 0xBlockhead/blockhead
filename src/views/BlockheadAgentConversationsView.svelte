<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.BlockheadAgentConversation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentConversation}
	bind:open
	resource={
		selection({
			fields: {
				name: true,
				updatedAt: true,
				id: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentConversation })}
		{@const blockheadAgentConversationSelector = blockheadAgentConversation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentConversation}
			entitySelector={blockheadAgentConversationSelector}
			href={
				resolve(
					'/~/agents/conversation/[conversationId=stringSegment]',
					{
						conversationId: String(blockheadAgentConversationSelector.id),
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadAgentConversation.name ?? '') || blockheadAgentConversationSelector.id || 'agent conversation'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadAgentConversation.updatedAt)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
