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
		title = 'Asset format support observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Asset format support observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetFormatSupport_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AssetFormatSupport_Timestamp>
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
	import AssetFormatSupport_TimestampView from '$/views/AssetFormatSupport_TimestampView.svelte'
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
					formatId: true,
					confidence: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetFormatSupport_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(assetFormatSupportTimestamps)}
			{@const uniqueAssetFormatSupportTimestamps = [...new Map(assetFormatSupportTimestamps.values.map((assetFormatSupportTimestamp) => [assetFormatSupportTimestamp[EntityMetaKey.SelectorKey], assetFormatSupportTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AssetFormatSupport_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={assetFormatSupportTimestamps.values.length === uniqueAssetFormatSupportTimestamps.length && assetFormatSupportTimestamps.totalCount != null && assetFormatSupportTimestamps.totalCount >= uniqueAssetFormatSupportTimestamps.length ? assetFormatSupportTimestamps.totalCount : uniqueAssetFormatSupportTimestamps.length}
				getKey={(assetFormatSupportTimestamp) => assetFormatSupportTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAssetFormatSupportTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No asset format support observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetFormatSupportTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetFormatSupport_Timestamp> })}
					<AssetFormatSupport_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/formats/[formatId]/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).$assetInstance.$network.caip2.namespace)}:${String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).$assetInstance.$network.caip2.reference)}`,
								kind: String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).$assetInstance.kind),
								assetKey: String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).$assetInstance.assetKey),
								formatId: String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).formatId),
								timestampMs: String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).timestampMs),
								source: String(({ ...assetFormatSupportTimestamp.entitySelector, ...assetFormatSupportTimestamp }).source),
							})
						}
						selection={select(EntityType.AssetFormatSupport_Timestamp, assetFormatSupportTimestamp.entitySelector)}
						prefetched={assetFormatSupportTimestamp}
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
		entityType={EntityType.AssetFormatSupport_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
