<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadLogosBlockchainNodeState_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadLogosBlockchainNodeState_TimestampView from '$/views/BlockheadLogosBlockchainNodeState_TimestampView.svelte'
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
		{@const selection = select(EntityType.BlockheadLogosBlockchainNodeState_Timestamp, blockheadLogosBlockchainNodeStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadLogosBlockchainNodeState_TimestampView
			selection={selection}
			prefetched={blockheadLogosBlockchainNodeStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
