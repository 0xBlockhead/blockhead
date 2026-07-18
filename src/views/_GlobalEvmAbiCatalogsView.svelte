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
		title = 'Global EVM ABI catalogs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalEvmAbiCatalogs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalEvmAbiCatalog>
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
	import GlobalEvmAbiCatalogView from '$/views/_GlobalEvmAbiCatalogView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEvmAbiCatalog}
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
				scope: true,
			},
		})
	}
	getResourceItems={(globalEvmAbiCatalogs) => [...new Map(globalEvmAbiCatalogs.values.map((globalEvmAbiCatalog) => [globalEvmAbiCatalog[EntityMetaKey.SelectorKey], globalEvmAbiCatalog])).values()]}
	getKey={(globalEvmAbiCatalog) => globalEvmAbiCatalog[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global EVM ABI catalogs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalEvmAbiCatalog })}
		{@const globalEvmAbiCatalogFields = { ...globalEvmAbiCatalog[EntityMetaKey.Selector], ...globalEvmAbiCatalog }}
		{@const selection = select(EntityType._GlobalEvmAbiCatalog, globalEvmAbiCatalog[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalEvmAbiCatalogView
			selection={selection}
			prefetched={globalEvmAbiCatalogFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
