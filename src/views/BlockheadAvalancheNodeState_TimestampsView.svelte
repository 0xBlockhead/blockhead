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
		title = 'Blockhead Avalanche node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAvalancheNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAvalancheNodeState_Timestamp>
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
	entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
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
				nodeVersion: true,
				networkName: true,
				connectedPeerCount: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAvalancheNodeStateTimestamps) => [...new Map(blockheadAvalancheNodeStateTimestamps.values.map((blockheadAvalancheNodeStateTimestamp) => [blockheadAvalancheNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadAvalancheNodeStateTimestamp])).values()]}
	getKey={(blockheadAvalancheNodeStateTimestamp) => blockheadAvalancheNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead avalanche node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAvalancheNodeStateTimestamp })}
		{@const blockheadAvalancheNodeStateTimestampFields = { ...blockheadAvalancheNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadAvalancheNodeStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
			entitySelector={blockheadAvalancheNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAvalancheNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead avalanche node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAvalancheNodeStateTimestampFields.nodeVersion) ?? ''), String((blockheadAvalancheNodeStateTimestampFields.networkName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAvalancheNodeStateTimestampFields.connectedPeerCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
