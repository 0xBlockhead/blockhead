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
		title = 'Asset instances',
		typeAnnotationParagraphs = ['A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.'],
		placeholderText = 'Loading Asset instances...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetInstances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AssetInstance>
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
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					$icon: true,
					symbol: true,
					name: true,
					$network: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetInstance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(assetInstances)}
			{@const uniqueAssetInstances = [...new Map(assetInstances.values.map((assetInstance) => [assetInstance[EntityMetaKey.SelectorKey], assetInstance])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetInstance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={assetInstances.values.length === uniqueAssetInstances.length && assetInstances.totalCount != null && assetInstances.totalCount >= uniqueAssetInstances.length ? assetInstances.totalCount : uniqueAssetInstances.length}
				getKey={(assetInstance) => assetInstance[EntityMetaKey.SelectorKey]}
				items={uniqueAssetInstances}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No asset instances yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetInstance }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetInstance> })}
					<AssetInstanceView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]', {
								caip2: `${String(({ ...assetInstance.entitySelector, ...assetInstance }).$network.caip2.namespace)}:${String(({ ...assetInstance.entitySelector, ...assetInstance }).$network.caip2.reference)}`,
								kind: String(({ ...assetInstance.entitySelector, ...assetInstance }).kind),
								assetKey: String(({ ...assetInstance.entitySelector, ...assetInstance }).assetKey),
							})
						}
						selection={select(EntityType.AssetInstance, assetInstance.entitySelector)}
						prefetched={assetInstance}
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
		entityType={EntityType.AssetInstance}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
