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
		title = 'Cardano transaction output assets',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoTxOutputAssets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CardanoTxOutputAsset>
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
	import CardanoTxOutputAssetView from '$/views/CardanoTxOutputAssetView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet children(cardanoTxOutputAssets)}
			{@const uniqueCardanoTxOutputAssets = [...new Map(cardanoTxOutputAssets.values.map((cardanoTxOutputAsset) => [cardanoTxOutputAsset[EntityMetaKey.SelectorKey], cardanoTxOutputAsset])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CardanoTxOutputAsset}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cardanoTxOutputAssets.totalCount}
				getKey={(cardanoTxOutputAsset) => cardanoTxOutputAsset[EntityMetaKey.SelectorKey]}
				items={uniqueCardanoTxOutputAssets}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cardano transaction output assets yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cardanoTxOutputAsset }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CardanoTxOutputAsset> })}
					{@const cardanoTxOutputAssetFields = { ...cardanoTxOutputAsset[EntityMetaKey.Selector], ...cardanoTxOutputAsset }}
					<CardanoTxOutputAssetView
						selection={select(EntityType.CardanoTxOutputAsset, cardanoTxOutputAsset[EntityMetaKey.Selector])}
						prefetched={cardanoTxOutputAssetFields}
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
		entityType={EntityType.CardanoTxOutputAsset}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
