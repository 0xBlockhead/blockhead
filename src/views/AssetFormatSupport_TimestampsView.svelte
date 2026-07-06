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
		placeholderText,
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
			selection({
				fields: {
					formatId: true,
					confidence: true,
					$assetInstance: true,
					timestampMs: true,
					source: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={assetFormatSupportTimestamps.totalCount}
				getKey={(assetFormatSupportTimestamp) => assetFormatSupportTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueAssetFormatSupportTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Asset format support observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: assetFormatSupportTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AssetFormatSupport_Timestamp> })}
					{@const assetFormatSupportTimestampFields = { ...assetFormatSupportTimestamp[EntityMetaKey.Selector], ...assetFormatSupportTimestamp }}
					{@const assetFormatSupportTimestampHrefFields = { ...assetFormatSupportTimestamp, ...assetFormatSupportTimestamp[EntityMetaKey.Selector] }}
					<AssetFormatSupport_TimestampView
						selection={select(EntityType.AssetFormatSupport_Timestamp, assetFormatSupportTimestamp[EntityMetaKey.Selector])}
						prefetched={assetFormatSupportTimestampFields}
						href={
							(assetFormatSupportTimestampHrefFields.$assetInstance !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.$network !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.$network.caip2 !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.$network.caip2.namespace !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.$network !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.$network.caip2 !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.$network.caip2.reference !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.kind !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance !== undefined && assetFormatSupportTimestampHrefFields.$assetInstance.assetKey !== undefined && assetFormatSupportTimestampHrefFields.formatId !== undefined && assetFormatSupportTimestampHrefFields.timestampMs !== undefined && assetFormatSupportTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/asset/[kind]/[assetKey]/formats/[formatId]/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(assetFormatSupportTimestampHrefFields.$assetInstance.$network.caip2.namespace ?? '')}:${String(assetFormatSupportTimestampHrefFields.$assetInstance.$network.caip2.reference ?? '')}`,
								kind: String(assetFormatSupportTimestampHrefFields.$assetInstance.kind ?? ''),
								assetKey: String(assetFormatSupportTimestampHrefFields.$assetInstance.assetKey ?? ''),
								formatId: String(assetFormatSupportTimestampHrefFields.formatId ?? ''),
								timestampMs: String(assetFormatSupportTimestampHrefFields.timestampMs ?? ''),
								source: String(assetFormatSupportTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.AssetFormatSupport_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
