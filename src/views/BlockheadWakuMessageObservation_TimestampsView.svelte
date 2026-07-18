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
		title = 'Blockhead Waku message observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadWakuMessageObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadWakuMessageObservation_Timestamp>
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
	import BlockheadWakuMessageObservation_TimestampView from '$/views/BlockheadWakuMessageObservation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
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
				messageHash: true,
				timestampMs: true,
				contentTopic: true,
			},
		})
	}
	getResourceItems={(blockheadWakuMessageObservationTimestamps) => [...new Map(blockheadWakuMessageObservationTimestamps.values.map((blockheadWakuMessageObservationTimestamp) => [blockheadWakuMessageObservationTimestamp[EntityMetaKey.SelectorKey], blockheadWakuMessageObservationTimestamp])).values()]}
	getKey={(blockheadWakuMessageObservationTimestamp) => blockheadWakuMessageObservationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead waku message observation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadWakuMessageObservationTimestamp })}
		{@const blockheadWakuMessageObservationTimestampFields = { ...blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector], ...blockheadWakuMessageObservationTimestamp }}
		{@const selection = select(EntityType.BlockheadWakuMessageObservation_Timestamp, blockheadWakuMessageObservationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadWakuMessageObservation_TimestampView
			selection={selection}
			prefetched={blockheadWakuMessageObservationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
