<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Turns',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentConversationTurns-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentConversationTurn>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentConversationTurn}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Local_Internal,
			],
			fields: {
				userPrompt: true,
				createdAt: true,
				id: true,
				$conversation: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAgentConversationTurns) => [...new Map(blockheadAgentConversationTurns.values.map((blockheadAgentConversationTurn) => [blockheadAgentConversationTurn[EntityMetaKey.SelectorKey], blockheadAgentConversationTurn])).values()]}
	getKey={(blockheadAgentConversationTurn) => blockheadAgentConversationTurn[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Agent conversation turns yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentConversationTurn })}
		{@const blockheadAgentConversationTurnFields = { ...blockheadAgentConversationTurn[EntityMetaKey.Selector], ...blockheadAgentConversationTurn }}
		<EntityView
			entityType={EntityType.BlockheadAgentConversationTurn}
			entitySelector={blockheadAgentConversationTurn[EntityMetaKey.Selector]}
			href={
				(
					blockheadAgentConversationTurn[EntityMetaKey.Selector] != null && 'id' in blockheadAgentConversationTurn[EntityMetaKey.Selector]
					&& blockheadAgentConversationTurn[EntityMetaKey.Selector].id != null
					&& blockheadAgentConversationTurn[EntityMetaKey.Selector] != null && '$conversation' in blockheadAgentConversationTurn[EntityMetaKey.Selector]
					&& blockheadAgentConversationTurn[EntityMetaKey.Selector].$conversation != null && 'id' in blockheadAgentConversationTurn[EntityMetaKey.Selector].$conversation
					&& blockheadAgentConversationTurn[EntityMetaKey.Selector].$conversation.id != null ?
						resolve('/~/agents/conversation/[conversationId=stringSegment]/turn/[turnId=stringSegment]', {
					turnId: String(blockheadAgentConversationTurn[EntityMetaKey.Selector].id ?? ''),
					conversationId: String(blockheadAgentConversationTurn[EntityMetaKey.Selector].$conversation.id ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAgentConversationTurnFields.userPrompt) ?? '')].filter(Boolean).join(' ') || 'agent conversation turn'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentConversationTurnFields.createdAt) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
