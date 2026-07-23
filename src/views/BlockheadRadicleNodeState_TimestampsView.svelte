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
		title = 'Blockhead Radicle node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadRadicleNodeState_Timestamp>
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
	entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
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
				alias: true,
				nodeVersion: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadRadicleNodeStateTimestamps) => [...new Map(blockheadRadicleNodeStateTimestamps.values.map((blockheadRadicleNodeStateTimestamp) => [blockheadRadicleNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleNodeStateTimestamp])).values()]}
	getKey={(blockheadRadicleNodeStateTimestamp) => blockheadRadicleNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead radicle node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRadicleNodeStateTimestamp })}
		{@const blockheadRadicleNodeStateTimestampFields = { ...blockheadRadicleNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadRadicleNodeStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadRadicleNodeState_Timestamp}
			entitySelector={blockheadRadicleNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadRadicleNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadRadicleNodeStateTimestampFields.alias) ?? ''), String((blockheadRadicleNodeStateTimestampFields.nodeVersion) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadRadicleNodeStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
