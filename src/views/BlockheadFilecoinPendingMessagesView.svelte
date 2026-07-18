<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Filecoin pending messages',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadFilecoinPendingMessages-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadFilecoinPendingMessage>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadFilecoinPendingMessageView from '$/views/BlockheadFilecoinPendingMessageView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadFilecoinPendingMessage}
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
				messageCid: true,
				observedAtMs: true,
				local: true,
			},
		})
	}
	getResourceItems={(blockheadFilecoinPendingMessages) => [...new Map(blockheadFilecoinPendingMessages.values.map((blockheadFilecoinPendingMessage) => [blockheadFilecoinPendingMessage[EntityMetaKey.SelectorKey], blockheadFilecoinPendingMessage])).values()]}
	getKey={(blockheadFilecoinPendingMessage) => blockheadFilecoinPendingMessage[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead filecoin pending messages yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadFilecoinPendingMessage })}
		{@const blockheadFilecoinPendingMessageFields = { ...blockheadFilecoinPendingMessage[EntityMetaKey.Selector], ...blockheadFilecoinPendingMessage }}
		{@const selection = select(EntityType.BlockheadFilecoinPendingMessage, blockheadFilecoinPendingMessage[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadFilecoinPendingMessageView
			selection={selection}
			prefetched={blockheadFilecoinPendingMessageFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
