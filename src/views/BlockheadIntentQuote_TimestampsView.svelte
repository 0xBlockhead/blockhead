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
		title = 'Blockhead intent quote observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadIntentQuote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadIntentQuote_Timestamp>
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
	entityType={EntityType.BlockheadIntentQuote_Timestamp}
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
				quoteId: true,
				timestampMs: true,
				source: true,
				solverId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadIntentQuoteTimestamps) => [...new Map(blockheadIntentQuoteTimestamps.values.map((blockheadIntentQuoteTimestamp) => [blockheadIntentQuoteTimestamp[EntityMetaKey.SelectorKey], blockheadIntentQuoteTimestamp])).values()]}
	getKey={(blockheadIntentQuoteTimestamp) => blockheadIntentQuoteTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead intent quote observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadIntentQuoteTimestamp })}
		{@const blockheadIntentQuoteTimestampFields = { ...blockheadIntentQuoteTimestamp[EntityMetaKey.Selector], ...blockheadIntentQuoteTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadIntentQuote_Timestamp}
			entitySelector={blockheadIntentQuoteTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadIntentQuoteTimestampFields.quoteId) ?? '')].filter(Boolean).join(' ') || [String((blockheadIntentQuoteTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'blockhead intent quote timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadIntentQuoteTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadIntentQuoteTimestampFields.solverId) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
