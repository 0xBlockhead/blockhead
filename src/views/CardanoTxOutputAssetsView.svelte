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
		title = 'Cardano transaction output assets',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoTxOutputAssets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoTxOutputAsset>
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
	entityType={EntityType.CardanoTxOutputAsset}
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
				$asset: {
					fields: {
						fingerprint: true,
					},
				},
				quantity: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoTxOutputAssets) => [...new Map(cardanoTxOutputAssets.values.map((cardanoTxOutputAsset) => [cardanoTxOutputAsset[EntityMetaKey.SelectorKey], cardanoTxOutputAsset])).values()]}
	getKey={(cardanoTxOutputAsset) => cardanoTxOutputAsset[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano transaction output assets yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoTxOutputAsset })}
		{@const cardanoTxOutputAssetFields = { ...cardanoTxOutputAsset[EntityMetaKey.Selector], ...cardanoTxOutputAsset }}
		<EntityView
			entityType={EntityType.CardanoTxOutputAsset}
			entitySelector={cardanoTxOutputAsset[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((cardanoTxOutputAssetFields.$asset.assetName) ?? '')].filter(Boolean).join(' ') || [String((cardanoTxOutputAssetFields.$asset.policyId) ?? '')].filter(Boolean).join(' ') || 'Cardano native asset'].filter(Boolean).join(' ') || 'Cardano transaction output asset'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoTxOutputAssetFields.quantity) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
