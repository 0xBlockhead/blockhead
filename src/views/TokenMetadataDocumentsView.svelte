<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Token metadata',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'TokenMetadataDocuments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.TokenMetadataDocument>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import TokenMetadataDocumentView from '$/views/TokenMetadataDocumentView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
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
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TokenMetadataDocument}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(tokenMetadataDocuments)}
			{@const uniqueTokenMetadataDocuments = [...new Map(tokenMetadataDocuments.values.map((tokenMetadataDocument) => [tokenMetadataDocument[EntityMetaKey.SelectorKey], tokenMetadataDocument])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.TokenMetadataDocument}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={tokenMetadataDocuments.totalCount}
				getKey={(tokenMetadataDocument) => tokenMetadataDocument[EntityMetaKey.SelectorKey]}
				items={uniqueTokenMetadataDocuments}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Token metadata documents yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: tokenMetadataDocument }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.TokenMetadataDocument> })}
					{@const tokenMetadataDocumentFields = { ...tokenMetadataDocument[EntityMetaKey.Selector], ...tokenMetadataDocument }}
					<TokenMetadataDocumentView
						selection={select(EntityType.TokenMetadataDocument, tokenMetadataDocument[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={tokenMetadataDocumentFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.TokenMetadataDocument}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
