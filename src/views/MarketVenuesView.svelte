<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		title = 'Market venues',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MarketVenues-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.MarketVenue>
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

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Exchanges, DEX protocols, and index publishers that scope how market ids are formed and which feeds apply.
	</p>

	<p>
		Catalog markets reference a venue in their id (for example <code>Binance:ETH-USD</code>).
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MarketVenue}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				label: true,
				marketVenueId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(marketVenues) => [...new Map(marketVenues.values.map((marketVenue) => [marketVenue[EntityMetaKey.SelectorKey], marketVenue])).values()]}
	getKey={(marketVenue) => marketVenue[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Market venues yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: marketVenue })}
		{@const marketVenueFields = { ...marketVenue[EntityMetaKey.Selector], ...marketVenue }}
		<EntityView
			entityType={EntityType.MarketVenue}
			entitySelector={marketVenue[EntityMetaKey.Selector]}
			href={
				(
					marketVenue[EntityMetaKey.Selector] != null && 'marketVenueId' in marketVenue[EntityMetaKey.Selector]
					&& marketVenue[EntityMetaKey.Selector].marketVenueId != null ?
						resolve('/market-venue/[marketVenueId=marketVenueId]', {
					marketVenueId: String(marketVenue[EntityMetaKey.Selector].marketVenueId ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((marketVenueFields.label) ?? '')].filter(Boolean).join(' ') || [String((marketVenueFields.marketVenueId) ?? '')].filter(Boolean).join(' ') || 'Market venue'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
