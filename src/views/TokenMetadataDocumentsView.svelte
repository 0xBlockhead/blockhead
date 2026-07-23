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
		title = 'Token metadata',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TokenMetadataDocuments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.TokenMetadataDocument>
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
	entityType={EntityType.TokenMetadataDocument}
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
				$media: true,
				name: true,
				symbol: true,
				metadataKey: true,
				metadataStandard: true,
				source: true,
				timestampMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(tokenMetadataDocuments) => [...new Map(tokenMetadataDocuments.values.map((tokenMetadataDocument) => [tokenMetadataDocument[EntityMetaKey.SelectorKey], tokenMetadataDocument])).values()]}
	getKey={(tokenMetadataDocument) => tokenMetadataDocument[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Token metadata documents yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: tokenMetadataDocument })}
		{@const tokenMetadataDocumentFields = { ...tokenMetadataDocument[EntityMetaKey.Selector], ...tokenMetadataDocument }}
		<EntityView
			entityType={EntityType.TokenMetadataDocument}
			entitySelector={tokenMetadataDocument[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((tokenMetadataDocumentFields.name) ?? ''), String((tokenMetadataDocumentFields.symbol) ?? ''), String((tokenMetadataDocumentFields.metadataKey) ?? '')].filter(Boolean).join(' ') || 'token metadata document'}
			{/snippet}

			{#snippet Value()}
				{[String((tokenMetadataDocumentFields.metadataStandard) ?? ''), String((tokenMetadataDocumentFields.source) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((tokenMetadataDocumentFields.timestampMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
