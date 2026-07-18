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
		title = 'dYdX chain market observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainMarket_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.DydxChainMarket_Timestamp>
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
	import DydxChainMarket_TimestampView from '$/views/DydxChainMarket_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainMarket_Timestamp}
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
				status: true,
			},
		})
	}
	getResourceItems={(dydxChainMarketTimestamps) => [...new Map(dydxChainMarketTimestamps.values.map((dydxChainMarketTimestamp) => [dydxChainMarketTimestamp[EntityMetaKey.SelectorKey], dydxChainMarketTimestamp])).values()]}
	getKey={(dydxChainMarketTimestamp) => dydxChainMarketTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dydx chain market observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dydxChainMarketTimestamp })}
		{@const dydxChainMarketTimestampFields = { ...dydxChainMarketTimestamp[EntityMetaKey.Selector], ...dydxChainMarketTimestamp }}
		{@const selection = select(EntityType.DydxChainMarket_Timestamp, dydxChainMarketTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<DydxChainMarket_TimestampView
			selection={selection}
			prefetched={dydxChainMarketTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
