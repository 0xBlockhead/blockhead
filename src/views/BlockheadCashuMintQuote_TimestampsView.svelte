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
		title = 'Blockhead Cashu mint quote observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuMintQuote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadCashuMintQuote_Timestamp>
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
	import BlockheadCashuMintQuote_TimestampView from '$/views/BlockheadCashuMintQuote_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadCashuMintQuote_Timestamp}
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
				timestampMs: true,
				state: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadCashuMintQuoteTimestamps) => [...new Map(blockheadCashuMintQuoteTimestamps.values.map((blockheadCashuMintQuoteTimestamp) => [blockheadCashuMintQuoteTimestamp[EntityMetaKey.SelectorKey], blockheadCashuMintQuoteTimestamp])).values()]}
	getKey={(blockheadCashuMintQuoteTimestamp) => blockheadCashuMintQuoteTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu mint quote observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuMintQuoteTimestamp })}
		{@const blockheadCashuMintQuoteTimestampFields = { ...blockheadCashuMintQuoteTimestamp[EntityMetaKey.Selector], ...blockheadCashuMintQuoteTimestamp }}
		{@const selection = select(EntityType.BlockheadCashuMintQuote_Timestamp, blockheadCashuMintQuoteTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadCashuMintQuote_TimestampView
			selection={selection}
			prefetched={blockheadCashuMintQuoteTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
