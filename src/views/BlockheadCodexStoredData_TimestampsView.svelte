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
		title = 'Blockhead Codex stored data observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCodexStoredData_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCodexStoredData_Timestamp>
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
	entityType={EntityType.BlockheadCodexStoredData_Timestamp}
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
				timestampMs: true,
				downloadStatus: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCodexStoredDataTimestamps) => [...new Map(blockheadCodexStoredDataTimestamps.values.map((blockheadCodexStoredDataTimestamp) => [blockheadCodexStoredDataTimestamp[EntityMetaKey.SelectorKey], blockheadCodexStoredDataTimestamp])).values()]}
	getKey={(blockheadCodexStoredDataTimestamp) => blockheadCodexStoredDataTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead codex stored data observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCodexStoredDataTimestamp })}
		{@const blockheadCodexStoredDataTimestampFields = { ...blockheadCodexStoredDataTimestamp[EntityMetaKey.Selector], ...blockheadCodexStoredDataTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadCodexStoredData_Timestamp}
			entitySelector={blockheadCodexStoredDataTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCodexStoredDataTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead codex stored data timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCodexStoredDataTimestampFields.downloadStatus) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadCodexStoredDataTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
