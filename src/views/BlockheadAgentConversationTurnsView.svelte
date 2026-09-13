<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'Turns',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAgentConversationTurn> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentConversationTurn}
	{title}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Local_Internal,
			],
			fields: {
				userPrompt: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentConversationTurn })}
		{@const blockheadAgentConversationTurnSelector = blockheadAgentConversationTurn[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentConversationTurn}
			entitySelector={blockheadAgentConversationTurnSelector}
			href={
				blockheadAgentConversationTurnSelector.$conversation !== undefined ?
					resolve(
						'/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]',
						{
							conversationId: blockheadAgentConversationTurnSelector.$conversation.id,
							turnId: blockheadAgentConversationTurnSelector.id,
						}
					)
				:
					resolve(
						'/~/agent/conversation-turn/[id=stringSegment]',
						{
							id: blockheadAgentConversationTurnSelector.id,
						}
					)
			}
		>
			{#snippet Title()}
				{blockheadAgentConversationTurn.userPrompt || 'agent conversation turn'}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentConversationTurn.createdAt}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
