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
		title = 'ENS name searches',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadEnsNameSearches-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadEnsNameSearch>
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
	entityType={EntityType.BlockheadEnsNameSearch}
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
				resultLimit: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadEnsNameSearches) => [...new Map(blockheadEnsNameSearches.values.map((blockheadEnsNameSearch) => [blockheadEnsNameSearch[EntityMetaKey.SelectorKey], blockheadEnsNameSearch])).values()]}
	getKey={(blockheadEnsNameSearch) => blockheadEnsNameSearch[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead ENS name searches yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadEnsNameSearch })}
		{@const blockheadEnsNameSearchFields = { ...blockheadEnsNameSearch[EntityMetaKey.Selector], ...blockheadEnsNameSearch }}
		<EntityView
			entityType={EntityType.BlockheadEnsNameSearch}
			entitySelector={blockheadEnsNameSearch[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadEnsNameSearchFields.query) ?? '')].filter(Boolean).join(' ') || 'blockhead ENS name search'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadEnsNameSearchFields.resultLimit) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
