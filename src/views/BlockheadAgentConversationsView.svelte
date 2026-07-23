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




	// State
	let {
		selection,
		countResource,
		title = 'Agent conversations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentConversations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentConversation>
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
	entityType={EntityType.BlockheadAgentConversation}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				name: true,
				updatedAt: true,
				id: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAgentConversations) => [...new Map(blockheadAgentConversations.values.map((blockheadAgentConversation) => [blockheadAgentConversation[EntityMetaKey.SelectorKey], blockheadAgentConversation])).values()]}
	getKey={(blockheadAgentConversation) => blockheadAgentConversation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Agent conversations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentConversation })}
		{@const blockheadAgentConversationFields = { ...blockheadAgentConversation[EntityMetaKey.Selector], ...blockheadAgentConversation }}
		<EntityView
			entityType={EntityType.BlockheadAgentConversation}
			entitySelector={blockheadAgentConversation[EntityMetaKey.Selector]}
			href={
				(
					blockheadAgentConversation[EntityMetaKey.Selector] != null && 'id' in blockheadAgentConversation[EntityMetaKey.Selector]
					&& blockheadAgentConversation[EntityMetaKey.Selector].id != null ?
						resolve('/~/agents/conversation/[conversationId=stringSegment]', {
					conversationId: String(blockheadAgentConversation[EntityMetaKey.Selector].id ?? ''),
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
				{[String((blockheadAgentConversationFields.name) ?? '')].filter(Boolean).join(' ') || [String((blockheadAgentConversationFields.id) ?? '')].filter(Boolean).join(' ') || 'agent conversation'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentConversationFields.updatedAt) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
