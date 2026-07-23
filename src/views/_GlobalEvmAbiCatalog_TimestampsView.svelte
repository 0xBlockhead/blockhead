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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType._GlobalEvmAbiCatalog_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType._GlobalEvmAbiCatalog_Timestamp}
			entitySelector={globalEvmAbiCatalogTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{['global EVM ABI catalog'].filter(Boolean).join(' ') || 'global EVM ABI catalog timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((globalEvmAbiCatalogTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
