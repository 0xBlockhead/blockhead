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
	}: EntityListViewProps<EntityType.BlockheadAgentProviderCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentProviderCall}
	bind:open
	resource={
		selection({
			fields: {
				indexInTurn: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentProviderCall })}
		{@const blockheadAgentProviderCallSelector = blockheadAgentProviderCall[EntityMetaKey.Selector]}
		{@const turn = blockheadAgentProviderCallSelector.$turn}
		<EntityView
			entityType={EntityType.BlockheadAgentProviderCall}
			entitySelector={blockheadAgentProviderCallSelector}
			href={
				turn.$conversation !== undefined ?
					resolve(
						'/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]/(blockheadAgentConversationTurn)/provider-call/[indexInTurn=nonNegativeInteger]',
						{
							conversationId: turn.$conversation.id,
							turnId: turn.id,
							indexInTurn: String(blockheadAgentProviderCallSelector.indexInTurn),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{`Call #${blockheadAgentProviderCallSelector.indexInTurn}`}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentProviderCall.status ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
