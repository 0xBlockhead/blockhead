<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuMintQuote_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadCashuMintQuote_Timestamp}
			entitySelector={blockheadCashuMintQuoteTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuMintQuoteTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu mint quote timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCashuMintQuoteTimestampFields.state) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadCashuMintQuoteTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
