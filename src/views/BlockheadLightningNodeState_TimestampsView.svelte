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
		title = 'Blockhead Lightning node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLightningNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLightningNodeState_Timestamp>
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
	entityType={EntityType.BlockheadLightningNodeState_Timestamp}
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
				syncedToChain: true,
				syncedToGraph: true,
				blockHeight: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLightningNodeStateTimestamps) => [...new Map(blockheadLightningNodeStateTimestamps.values.map((blockheadLightningNodeStateTimestamp) => [blockheadLightningNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadLightningNodeStateTimestamp])).values()]}
	getKey={(blockheadLightningNodeStateTimestamp) => blockheadLightningNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Lightning node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLightningNodeStateTimestamp })}
		{@const blockheadLightningNodeStateTimestampFields = { ...blockheadLightningNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadLightningNodeStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLightningNodeState_Timestamp}
			entitySelector={blockheadLightningNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLightningNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLightningNodeStateTimestampFields.syncedToChain) ?? ''), String((blockheadLightningNodeStateTimestampFields.syncedToGraph) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLightningNodeStateTimestampFields.blockHeight) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
