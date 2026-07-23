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
		title = 'Blockhead Cashu melt quote observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuMeltQuote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuMeltQuote_Timestamp>
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
	entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
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
	getResourceItems={(blockheadCashuMeltQuoteTimestamps) => [...new Map(blockheadCashuMeltQuoteTimestamps.values.map((blockheadCashuMeltQuoteTimestamp) => [blockheadCashuMeltQuoteTimestamp[EntityMetaKey.SelectorKey], blockheadCashuMeltQuoteTimestamp])).values()]}
	getKey={(blockheadCashuMeltQuoteTimestamp) => blockheadCashuMeltQuoteTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu melt quote observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuMeltQuoteTimestamp })}
		{@const blockheadCashuMeltQuoteTimestampFields = { ...blockheadCashuMeltQuoteTimestamp[EntityMetaKey.Selector], ...blockheadCashuMeltQuoteTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
			entitySelector={blockheadCashuMeltQuoteTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuMeltQuoteTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu melt quote timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCashuMeltQuoteTimestampFields.state) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadCashuMeltQuoteTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
