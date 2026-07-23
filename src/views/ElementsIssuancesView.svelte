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
		title = 'Elements issuances',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ElementsIssuances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ElementsIssuance>
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
	entityType={EntityType.ElementsIssuance}
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
				inputIndex: true,
				$asset: true,
				$reissuanceTokenAsset: true,
				isReissuance: true,
			},
		})
	}
	{countResource}
	getResourceItems={(elementsIssuances) => [...new Map(elementsIssuances.values.map((elementsIssuance) => [elementsIssuance[EntityMetaKey.SelectorKey], elementsIssuance])).values()]}
	getKey={(elementsIssuance) => elementsIssuance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Elements issuances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: elementsIssuance })}
		{@const elementsIssuanceFields = { ...elementsIssuance[EntityMetaKey.Selector], ...elementsIssuance }}
		<EntityView
			entityType={EntityType.ElementsIssuance}
			entitySelector={elementsIssuance[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((elementsIssuanceFields.inputIndex) ?? '')].filter(Boolean).join(' ') || 'Elements issuance'}
			{/snippet}

			{#snippet Value()}
				{[[String((elementsIssuanceFields.$asset.name) ?? ''), String((elementsIssuanceFields.$asset.ticker) ?? ''), String((elementsIssuanceFields.$asset.assetId) ?? '')].filter(Boolean).join(' ') || 'Elements asset', [String((elementsIssuanceFields.$reissuanceTokenAsset.name) ?? ''), String((elementsIssuanceFields.$reissuanceTokenAsset.ticker) ?? ''), String((elementsIssuanceFields.$reissuanceTokenAsset.assetId) ?? '')].filter(Boolean).join(' ') || 'Elements asset'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((elementsIssuanceFields.isReissuance) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
