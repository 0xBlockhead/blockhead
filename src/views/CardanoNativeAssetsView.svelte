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
		title = 'Cardano native assets',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoNativeAssets-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoNativeAsset>
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
	entityType={EntityType.CardanoNativeAsset}
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
				assetName: true,
				fingerprint: true,
				policyId: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoNativeAssets) => [...new Map(cardanoNativeAssets.values.map((cardanoNativeAsset) => [cardanoNativeAsset[EntityMetaKey.SelectorKey], cardanoNativeAsset])).values()]}
	getKey={(cardanoNativeAsset) => cardanoNativeAsset[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano native assets yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoNativeAsset })}
		{@const cardanoNativeAssetFields = { ...cardanoNativeAsset[EntityMetaKey.Selector], ...cardanoNativeAsset }}
		<EntityView
			entityType={EntityType.CardanoNativeAsset}
			entitySelector={cardanoNativeAsset[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cardanoNativeAssetFields.assetName) ?? '')].filter(Boolean).join(' ') || [String((cardanoNativeAssetFields.policyId) ?? '')].filter(Boolean).join(' ') || 'Cardano native asset'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoNativeAssetFields.fingerprint) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
