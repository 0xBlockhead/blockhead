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
		title = 'Blockhead Monero transfer state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroTransferState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadMoneroTransferState_Timestamp>
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
	import BlockheadMoneroTransferState_TimestampView from '$/views/BlockheadMoneroTransferState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
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
				spent: true,
				confirmations: true,
			},
		})
	}
	getResourceItems={(blockheadMoneroTransferStateTimestamps) => [...new Map(blockheadMoneroTransferStateTimestamps.values.map((blockheadMoneroTransferStateTimestamp) => [blockheadMoneroTransferStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroTransferStateTimestamp])).values()]}
	getKey={(blockheadMoneroTransferStateTimestamp) => blockheadMoneroTransferStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero transfer state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroTransferStateTimestamp })}
		{@const blockheadMoneroTransferStateTimestampFields = { ...blockheadMoneroTransferStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroTransferStateTimestamp }}
		{@const selection = select(EntityType.BlockheadMoneroTransferState_Timestamp, blockheadMoneroTransferStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadMoneroTransferState_TimestampView
			selection={selection}
			prefetched={blockheadMoneroTransferStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
