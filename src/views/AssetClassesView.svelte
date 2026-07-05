<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'Asset classes',
		typeAnnotationParagraphs = ['A reusable asset classification used to group related asset instances and objects.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetClasses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AssetClass>
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
	import AssetClassView from '$/views/AssetClassView.svelte'
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
					label: true,
					classKey: true,
					classKind: true,
					$assetInstance: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(assetClasses)}
			{@const uniqueAssetClasses = [...new Map(assetClasses.values.map((assetClass) => [assetClass[EntityMetaKey.SelectorKey], assetClass])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetClass}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={assetClasses.totalCount}
				getKey={(assetClass) => assetClass[EntityMetaKey.SelectorKey]}
				items={uniqueAssetClasses}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Asset classes yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetClass }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetClass> })}
					{@const assetClassFields = { ...assetClass[EntityMetaKey.Selector], ...assetClass }}
					{@const assetClassHrefFields = { ...assetClass, ...assetClass[EntityMetaKey.Selector] }}
					<AssetClassView
						selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
						prefetched={assetClassFields}
						href={
							(assetClassHrefFields.$assetInstance !== undefined && assetClassHrefFields.$assetInstance.$network !== undefined && assetClassHrefFields.$assetInstance.$network.caip2 !== undefined && assetClassHrefFields.$assetInstance.$network.caip2.namespace !== undefined && assetClassHrefFields.$assetInstance !== undefined && assetClassHrefFields.$assetInstance.$network !== undefined && assetClassHrefFields.$assetInstance.$network.caip2 !== undefined && assetClassHrefFields.$assetInstance.$network.caip2.reference !== undefined && assetClassHrefFields.$assetInstance !== undefined && assetClassHrefFields.$assetInstance.kind !== undefined && assetClassHrefFields.$assetInstance !== undefined && assetClassHrefFields.$assetInstance.assetKey !== undefined && assetClassHrefFields.classKind !== undefined && assetClassHrefFields.classKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/class/[classKind]/[classKey]', {
								caip2: `${String(assetClassHrefFields.$assetInstance.$network.caip2.namespace ?? '')}:${String(assetClassHrefFields.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(assetClassHrefFields.$assetInstance.kind ?? ''),
								assetKey: String(assetClassHrefFields.$assetInstance.assetKey ?? ''),
								classKind: String(assetClassHrefFields.classKind ?? ''),
								classKey: String(assetClassHrefFields.classKey ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.AssetClass}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
