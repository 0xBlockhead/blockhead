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
		title = 'Blockhead Monero output state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadMoneroOutputState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadMoneroOutputState_Timestamp>
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
	import BlockheadMoneroOutputState_TimestampView from '$/views/BlockheadMoneroOutputState_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
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
				unlocked: true,
				confirmations: true,
			},
		})
	}
	getResourceItems={(blockheadMoneroOutputStateTimestamps) => [...new Map(blockheadMoneroOutputStateTimestamps.values.map((blockheadMoneroOutputStateTimestamp) => [blockheadMoneroOutputStateTimestamp[EntityMetaKey.SelectorKey], blockheadMoneroOutputStateTimestamp])).values()]}
	getKey={(blockheadMoneroOutputStateTimestamp) => blockheadMoneroOutputStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead monero output state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadMoneroOutputStateTimestamp })}
		{@const blockheadMoneroOutputStateTimestampFields = { ...blockheadMoneroOutputStateTimestamp[EntityMetaKey.Selector], ...blockheadMoneroOutputStateTimestamp }}
		{@const selection = select(EntityType.BlockheadMoneroOutputState_Timestamp, blockheadMoneroOutputStateTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadMoneroOutputState_TimestampView
			selection={selection}
			prefetched={blockheadMoneroOutputStateTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
