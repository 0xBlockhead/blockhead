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
		title = 'State channel observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannel_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadStateChannel_Timestamp>
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
	import BlockheadStateChannel_TimestampView from '$/views/BlockheadStateChannel_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadStateChannel_Timestamp}
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
				status: true,
				source: true,
			},
		})
	}
	getResourceItems={(blockheadStateChannelTimestamps) => [...new Map(blockheadStateChannelTimestamps.values.map((blockheadStateChannelTimestamp) => [blockheadStateChannelTimestamp[EntityMetaKey.SelectorKey], blockheadStateChannelTimestamp])).values()]}
	getKey={(blockheadStateChannelTimestamp) => blockheadStateChannelTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead state channel observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadStateChannelTimestamp })}
		{@const blockheadStateChannelTimestampFields = { ...blockheadStateChannelTimestamp[EntityMetaKey.Selector], ...blockheadStateChannelTimestamp }}
		{@const selection = select(EntityType.BlockheadStateChannel_Timestamp, blockheadStateChannelTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadStateChannel_TimestampView
			selection={selection}
			prefetched={blockheadStateChannelTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
