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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BridgeRouteQuote_Timestamp>
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
	import BridgeRouteQuote_TimestampView from '$/views/BridgeRouteQuote_TimestampView.svelte'
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
		{@const selection = select(EntityType.BridgeRouteQuote_Timestamp, bridgeRouteQuoteTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BridgeRouteQuote_TimestampView
			selection={selection}
			prefetched={bridgeRouteQuoteTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
