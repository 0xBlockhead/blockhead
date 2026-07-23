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
		title = 'Asset format support observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetFormatSupport_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AssetFormatSupport_Timestamp>
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
	entityType={EntityType.AssetFormatSupport_Timestamp}
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
				formatId: true,
				confidence: true,
			},
		})
	}
	{countResource}
	getResourceItems={(assetFormatSupportTimestamps) => [...new Map(assetFormatSupportTimestamps.values.map((assetFormatSupportTimestamp) => [assetFormatSupportTimestamp[EntityMetaKey.SelectorKey], assetFormatSupportTimestamp])).values()]}
	getKey={(assetFormatSupportTimestamp) => assetFormatSupportTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Asset format support observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: assetFormatSupportTimestamp })}
		{@const assetFormatSupportTimestampFields = { ...assetFormatSupportTimestamp[EntityMetaKey.Selector], ...assetFormatSupportTimestamp }}
		<EntityView
			entityType={EntityType.AssetFormatSupport_Timestamp}
			entitySelector={assetFormatSupportTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((assetFormatSupportTimestampFields.formatId) ?? '')].filter(Boolean).join(' ') || 'asset format support timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((assetFormatSupportTimestampFields.formatId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((assetFormatSupportTimestampFields.confidence) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
