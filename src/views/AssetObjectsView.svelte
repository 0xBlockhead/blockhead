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
		title = 'Asset objects',
		typeAnnotationParagraphs = ['A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetObjects-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AssetObject>
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
	entityType={EntityType.AssetObject}
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
				objectKey: true,
				objectKind: true,
				tokenId: true,
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
	getResourceItems={(assetObjects) => [...new Map(assetObjects.values.map((assetObject) => [assetObject[EntityMetaKey.SelectorKey], assetObject])).values()]}
	getKey={(assetObject) => assetObject[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Asset objects yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: assetObject })}
		{@const assetObjectFields = { ...assetObject[EntityMetaKey.Selector], ...assetObject }}
		<EntityView
			entityType={EntityType.AssetObject}
			entitySelector={assetObject[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((assetObjectFields.objectKey) ?? '')].filter(Boolean).join(' ') || 'asset object'}
			{/snippet}

			{#snippet Value()}
				{[String((assetObjectFields.objectKind) ?? ''), String((assetObjectFields.tokenId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((assetObjectFields.$assetInstance.symbol) ?? ''), String((assetObjectFields.$assetInstance.name) ?? '')].filter(Boolean).join(' ') || 'Asset instance'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
