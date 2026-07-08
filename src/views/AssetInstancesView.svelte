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
		placeholderText,
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
			selection({
				fields: {
					symbol: true,
					name: true,
					$network: true,
					kind: true,
					assetKey: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={assetInstances.totalCount}
				getKey={(assetInstance) => assetInstance[EntityMetaKey.SelectorKey]}
				items={uniqueAssetInstances}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Asset instances yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetInstance }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetInstance> })}
					{@const assetInstanceFields = { ...assetInstance[EntityMetaKey.Selector], ...assetInstance }}
					{@const assetInstanceHrefFields = { ...assetInstance, ...assetInstance[EntityMetaKey.Selector] }}
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={assetInstanceFields}
						href={
							(assetInstanceHrefFields.$network !== undefined && assetInstanceHrefFields.$network.caip2 !== undefined && assetInstanceHrefFields.$network.caip2.namespace !== undefined && assetInstanceHrefFields.$network !== undefined && assetInstanceHrefFields.$network.caip2 !== undefined && assetInstanceHrefFields.$network.caip2.reference !== undefined && assetInstanceHrefFields.kind !== undefined && assetInstanceHrefFields.assetKey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/asset/[kind]/[assetKey]', {
								caip2: `${String(assetInstanceHrefFields.$network.caip2.namespace ?? '')}:${String(assetInstanceHrefFields.$network.caip2.reference ?? '')}`,
								kind: String(assetInstanceHrefFields.kind ?? ''),
								assetKey: String(assetInstanceHrefFields.assetKey ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
