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
		title = 'Global EVM ABI catalog observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GlobalEvmAbiCatalog_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType._GlobalEvmAbiCatalog_Timestamp>
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
	import GlobalEvmAbiCatalog_TimestampView from '$/views/_GlobalEvmAbiCatalog_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
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
				$hub: true,
				timestampMs: true,
			},
		})
	}
	getResourceItems={(globalEvmAbiCatalogTimestamps) => [...new Map(globalEvmAbiCatalogTimestamps.values.map((globalEvmAbiCatalogTimestamp) => [globalEvmAbiCatalogTimestamp[EntityMetaKey.SelectorKey], globalEvmAbiCatalogTimestamp])).values()]}
	getKey={(globalEvmAbiCatalogTimestamp) => globalEvmAbiCatalogTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Global EVM ABI catalog observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: globalEvmAbiCatalogTimestamp })}
		{@const globalEvmAbiCatalogTimestampFields = { ...globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector], ...globalEvmAbiCatalogTimestamp }}
		{@const selection = select(EntityType._GlobalEvmAbiCatalog_Timestamp, globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<GlobalEvmAbiCatalog_TimestampView
			selection={selection}
			prefetched={globalEvmAbiCatalogTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
