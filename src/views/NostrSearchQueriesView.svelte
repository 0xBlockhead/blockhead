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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrSearchQuery>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.NostrSearchQuery}
			entitySelector={nostrSearchQuery[EntityMetaKey.Selector]}
			href={
				(
					nostrSearchQuery[EntityMetaKey.Selector] != null && 'query' in nostrSearchQuery[EntityMetaKey.Selector]
					&& nostrSearchQuery[EntityMetaKey.Selector].query != null ?
						resolve('/nostr/search/[query=stringSegment]', {
					query: String(nostrSearchQuery[EntityMetaKey.Selector].query ?? ''),
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
				{[String((nostrSearchQueryFields.query) ?? '')].filter(Boolean).join(' ') || 'Nostr profile search'}
			{/snippet}

			{#snippet Value()}
				{[String((nostrSearchQueryFields.resultCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
