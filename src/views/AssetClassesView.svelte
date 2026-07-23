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
		title = 'Asset classes',
		typeAnnotationParagraphs = ['A reusable asset classification used to group related asset instances and objects.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetClasses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AssetClass>
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
	entityType={EntityType.AssetClass}
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
				label: true,
				classKey: true,
				classKind: true,
				$assetInstance: {
					fields: {
						symbol: true,
						name: true,
					},
				},
			},
		})
	}
	{countResource}
	getResourceItems={(assetClasses) => [...new Map(assetClasses.values.map((assetClass) => [assetClass[EntityMetaKey.SelectorKey], assetClass])).values()]}
	getKey={(assetClass) => assetClass[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Asset classes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: assetClass })}
		{@const assetClassFields = { ...assetClass[EntityMetaKey.Selector], ...assetClass }}
		<EntityView
			entityType={EntityType.AssetClass}
			entitySelector={assetClass[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((assetClassFields.label) ?? ''), String((assetClassFields.classKey) ?? '')].filter(Boolean).join(' ') || 'asset class'}
			{/snippet}

			{#snippet Value()}
				{[String((assetClassFields.classKind) ?? ''), String((assetClassFields.classKey) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((assetClassFields.$assetInstance.symbol) ?? ''), String((assetClassFields.$assetInstance.name) ?? '')].filter(Boolean).join(' ') || 'Asset instance'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
