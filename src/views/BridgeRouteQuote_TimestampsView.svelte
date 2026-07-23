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
		title = 'Bridge route quote observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BridgeRouteQuote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BridgeRouteQuote_Timestamp>
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
	entityType={EntityType.BridgeRouteQuote_Timestamp}
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
				fromChainId: true,
				toChainId: true,
				timestampMs: true,
				source: true,
				estimatedCostUsd: true,
				estimatedDurationSeconds: true,
			},
		})
	}
	{countResource}
	getResourceItems={(bridgeRouteQuoteTimestamps) => [...new Map(bridgeRouteQuoteTimestamps.values.map((bridgeRouteQuoteTimestamp) => [bridgeRouteQuoteTimestamp[EntityMetaKey.SelectorKey], bridgeRouteQuoteTimestamp])).values()]}
	getKey={(bridgeRouteQuoteTimestamp) => bridgeRouteQuoteTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Bridge route quote observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: bridgeRouteQuoteTimestamp })}
		{@const bridgeRouteQuoteTimestampFields = { ...bridgeRouteQuoteTimestamp[EntityMetaKey.Selector], ...bridgeRouteQuoteTimestamp }}
		<EntityView
			entityType={EntityType.BridgeRouteQuote_Timestamp}
			entitySelector={bridgeRouteQuoteTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((bridgeRouteQuoteTimestampFields.fromChainId) ?? ''), 'to', String((bridgeRouteQuoteTimestampFields.toChainId) ?? '')].filter(Boolean).join(' ') || 'bridge route quote timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((bridgeRouteQuoteTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((bridgeRouteQuoteTimestampFields.source) ?? ''), String((bridgeRouteQuoteTimestampFields.estimatedCostUsd) ?? ''), String((bridgeRouteQuoteTimestampFields.estimatedDurationSeconds) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
