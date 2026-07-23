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
		title = 'Blockhead Quilibrium node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadQuilibriumNodeState_Timestamp>
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
	entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
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
				engineState: true,
				latestFrameNumber: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadQuilibriumNodeStateTimestamps) => [...new Map(blockheadQuilibriumNodeStateTimestamps.values.map((blockheadQuilibriumNodeStateTimestamp) => [blockheadQuilibriumNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadQuilibriumNodeStateTimestamp])).values()]}
	getKey={(blockheadQuilibriumNodeStateTimestamp) => blockheadQuilibriumNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumNodeStateTimestamp })}
		{@const blockheadQuilibriumNodeStateTimestampFields = { ...blockheadQuilibriumNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadQuilibriumNodeStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumNodeState_Timestamp}
			entitySelector={blockheadQuilibriumNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadQuilibriumNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadQuilibriumNodeStateTimestampFields.engineState) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadQuilibriumNodeStateTimestampFields.latestFrameNumber) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
