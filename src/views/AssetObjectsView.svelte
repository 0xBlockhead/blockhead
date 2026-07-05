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
		title = 'Asset objects',
		typeAnnotationParagraphs = ['A distinct asset object or item within an asset instance, such as an NFT or uniquely addressable collectible.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetObjects-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AssetObject>
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
	import AssetObjectView from '$/views/AssetObjectView.svelte'
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
					objectKey: true,
					objectKind: true,
					tokenId: true,
					$assetInstance: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(assetObjects)}
			{@const uniqueAssetObjects = [...new Map(assetObjects.values.map((assetObject) => [assetObject[EntityMetaKey.SelectorKey], assetObject])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetObject}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={assetObjects.totalCount}
				getKey={(assetObject) => assetObject[EntityMetaKey.SelectorKey]}
				items={uniqueAssetObjects}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Asset objects yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetObject }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetObject> })}
					{@const assetObjectFields = { ...assetObject[EntityMetaKey.Selector], ...assetObject }}
					<AssetObjectView
						selection={select(EntityType.AssetObject, assetObject[EntityMetaKey.Selector])}
						prefetched={assetObjectFields}
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
		entityType={EntityType.AssetObject}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
