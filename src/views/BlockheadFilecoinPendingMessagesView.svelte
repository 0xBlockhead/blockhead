<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Filecoin pending messages',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFilecoinPendingMessages-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadFilecoinPendingMessage>
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
	import BlockheadFilecoinPendingMessageView from '$/views/BlockheadFilecoinPendingMessageView.svelte'
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
				fields: {
					messageCid: true,
					observedAtMs: true,
					local: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadFilecoinPendingMessage}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadFilecoinPendingMessages)}
			{@const uniqueBlockheadFilecoinPendingMessages = [...new Map(blockheadFilecoinPendingMessages.values.map((blockheadFilecoinPendingMessage) => [blockheadFilecoinPendingMessage[EntityMetaKey.SelectorKey], blockheadFilecoinPendingMessage])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadFilecoinPendingMessage}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadFilecoinPendingMessages.totalCount}
				getKey={(blockheadFilecoinPendingMessage) => blockheadFilecoinPendingMessage[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadFilecoinPendingMessages}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead filecoin pending messages yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadFilecoinPendingMessage }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadFilecoinPendingMessage> })}
					{@const blockheadFilecoinPendingMessageFields = { ...blockheadFilecoinPendingMessage[EntityMetaKey.Selector], ...blockheadFilecoinPendingMessage }}
					<BlockheadFilecoinPendingMessageView
						selection={select(EntityType.BlockheadFilecoinPendingMessage, blockheadFilecoinPendingMessage[EntityMetaKey.Selector])}
						prefetched={blockheadFilecoinPendingMessageFields}
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
		entityType={EntityType.BlockheadFilecoinPendingMessage}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
