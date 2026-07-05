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
		title = 'Asset supply observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetSupply_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AssetSupply_Timestamp>
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
	import AssetSupply_TimestampView from '$/views/AssetSupply_TimestampView.svelte'
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
					supplyScopeKey: true,
					totalSupply: true,
					circulatingSupply: true,
					source: true,
					$assetInstance: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(assetSupplyTimestamps)}
			{@const uniqueAssetSupplyTimestamps = [...new Map(assetSupplyTimestamps.values.map((assetSupplyTimestamp) => [assetSupplyTimestamp[EntityMetaKey.SelectorKey], assetSupplyTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetSupply_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={assetSupplyTimestamps.totalCount}
				getKey={(assetSupplyTimestamp) => assetSupplyTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAssetSupplyTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Asset supply observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetSupplyTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetSupply_Timestamp> })}
					{@const assetSupplyTimestampFields = { ...assetSupplyTimestamp[EntityMetaKey.Selector], ...assetSupplyTimestamp }}
					{@const assetSupplyTimestampHrefFields = { ...assetSupplyTimestamp, ...assetSupplyTimestamp[EntityMetaKey.Selector] }}
					<AssetSupply_TimestampView
						selection={select(EntityType.AssetSupply_Timestamp, assetSupplyTimestamp[EntityMetaKey.Selector])}
						prefetched={assetSupplyTimestampFields}
						href={
							(assetSupplyTimestampHrefFields.$assetInstance !== undefined && assetSupplyTimestampHrefFields.$assetInstance.$network !== undefined && assetSupplyTimestampHrefFields.$assetInstance.$network.caip2 !== undefined && assetSupplyTimestampHrefFields.$assetInstance.$network.caip2.namespace !== undefined && assetSupplyTimestampHrefFields.$assetInstance !== undefined && assetSupplyTimestampHrefFields.$assetInstance.$network !== undefined && assetSupplyTimestampHrefFields.$assetInstance.$network.caip2 !== undefined && assetSupplyTimestampHrefFields.$assetInstance.$network.caip2.reference !== undefined && assetSupplyTimestampHrefFields.$assetInstance !== undefined && assetSupplyTimestampHrefFields.$assetInstance.kind !== undefined && assetSupplyTimestampHrefFields.$assetInstance !== undefined && assetSupplyTimestampHrefFields.$assetInstance.assetKey !== undefined && assetSupplyTimestampHrefFields.supplyScopeKey !== undefined && assetSupplyTimestampHrefFields.timestampMs !== undefined && assetSupplyTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/supply/[supplyScopeKey]/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(assetSupplyTimestampHrefFields.$assetInstance.$network.caip2.namespace ?? '')}:${String(assetSupplyTimestampHrefFields.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(assetSupplyTimestampHrefFields.$assetInstance.kind ?? ''),
								assetKey: String(assetSupplyTimestampHrefFields.$assetInstance.assetKey ?? ''),
								supplyScopeKey: String(assetSupplyTimestampHrefFields.supplyScopeKey ?? ''),
								timestampMs: String(assetSupplyTimestampHrefFields.timestampMs ?? ''),
								source: String(assetSupplyTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.AssetSupply_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
