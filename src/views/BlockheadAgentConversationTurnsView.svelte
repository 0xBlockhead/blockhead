<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Turns',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentConversationTurns-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAgentConversationTurn>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadAgentConversationTurnView from '$/views/BlockheadAgentConversationTurnView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				sources: [
					Source.Local_Internal,
				],
				fields: {
					$conversation: true,
					userPrompt: true,
					createdAt: true,
					id: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAgentConversationTurn}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadAgentConversationTurns)}
			{@const uniqueBlockheadAgentConversationTurns = [...new Map(blockheadAgentConversationTurns.values.map((blockheadAgentConversationTurn) => [blockheadAgentConversationTurn[EntityMetaKey.SelectorKey], blockheadAgentConversationTurn])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAgentConversationTurn}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAgentConversationTurns.totalCount}
				getKey={(blockheadAgentConversationTurn) => blockheadAgentConversationTurn[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAgentConversationTurns}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Agent conversation turns yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAgentConversationTurn }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAgentConversationTurn> })}
					{@const blockheadAgentConversationTurnFields = { ...blockheadAgentConversationTurn[EntityMetaKey.Selector], ...blockheadAgentConversationTurn }}
					{@const blockheadAgentConversationTurnHrefFields = { ...blockheadAgentConversationTurn, ...blockheadAgentConversationTurn[EntityMetaKey.Selector] }}
					<BlockheadAgentConversationTurnView
						selection={select(EntityType.BlockheadAgentConversationTurn, blockheadAgentConversationTurn[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={blockheadAgentConversationTurnFields}
						href={
							(blockheadAgentConversationTurnHrefFields.id !== undefined && blockheadAgentConversationTurnHrefFields.$conversation !== undefined && blockheadAgentConversationTurnHrefFields.$conversation.id !== undefined ? resolve('/~/agents/conversation/[conversationId=stringSegment]/turn/[turnId=stringSegment]', {
								turnId: String(blockheadAgentConversationTurnHrefFields.id ?? ''),
								conversationId: String(blockheadAgentConversationTurnHrefFields.$conversation.id ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BlockheadAgentConversationTurn}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
