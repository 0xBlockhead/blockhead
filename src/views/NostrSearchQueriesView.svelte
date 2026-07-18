<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Nostr profile searches',
		typeAnnotationParagraphs = ['A bounded NostrBand profile search addressed by its normalized query.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrSearchQueries-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NostrSearchQuery>
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
	import NostrSearchQueryView from '$/views/NostrSearchQueryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrSearchQuery}
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
				query: true,
				resultCount: true,
			},
		})
	}
	getResourceItems={(nostrSearchQueries) => [...new Map(nostrSearchQueries.values.map((nostrSearchQuery) => [nostrSearchQuery[EntityMetaKey.SelectorKey], nostrSearchQuery])).values()]}
	getKey={(nostrSearchQuery) => nostrSearchQuery[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr profile searches yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrSearchQuery })}
		{@const nostrSearchQueryFields = { ...nostrSearchQuery[EntityMetaKey.Selector], ...nostrSearchQuery }}
		{@const selection = select(EntityType.NostrSearchQuery, nostrSearchQuery[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const nostrSearchQueryHrefFields = { ...nostrSearchQuery, ...nostrSearchQuery[EntityMetaKey.Selector] }}
		<NostrSearchQueryView
			selection={selection}
			prefetched={nostrSearchQueryFields}
			href={
				(nostrSearchQueryHrefFields.query !== undefined ? resolve('/nostr/search/[query=stringSegment]', {
					query: String(nostrSearchQueryHrefFields.query ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
