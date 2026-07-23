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
		title = 'Blockhead Logos blockchain node state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadLogosBlockchainNodeState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadLogosBlockchainNodeState_Timestamp>
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
	entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
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
				peerCount: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadLogosBlockchainNodeStateTimestamps) => [...new Map(blockheadLogosBlockchainNodeStateTimestamps.values.map((blockheadLogosBlockchainNodeStateTimestamp) => [blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.SelectorKey], blockheadLogosBlockchainNodeStateTimestamp])).values()]}
	getKey={(blockheadLogosBlockchainNodeStateTimestamp) => blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Logos blockchain node state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadLogosBlockchainNodeStateTimestamp })}
		{@const blockheadLogosBlockchainNodeStateTimestampFields = { ...blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.Selector], ...blockheadLogosBlockchainNodeStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadLogosBlockchainNodeState_Timestamp}
			entitySelector={blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadLogosBlockchainNodeStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Logos blockchain node state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadLogosBlockchainNodeStateTimestampFields.peerCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadLogosBlockchainNodeStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
