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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadEnsNameSearch>
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
	import BlockheadEnsNameSearchView from '$/views/BlockheadEnsNameSearchView.svelte'
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
		{@const selection = select(EntityType.BlockheadEnsNameSearch, blockheadEnsNameSearch[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadEnsNameSearchView
			selection={selection}
			prefetched={blockheadEnsNameSearchFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
