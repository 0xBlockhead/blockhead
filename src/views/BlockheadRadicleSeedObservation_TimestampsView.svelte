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
		title = 'Blockhead Radicle seed observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleSeedObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadRadicleSeedObservation_Timestamp>
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
	import BlockheadRadicleSeedObservation_TimestampView from '$/views/BlockheadRadicleSeedObservation_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
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
				nodeId: true,
				timestampMs: true,
				$repository: true,
			},
		})
	}
	getResourceItems={(blockheadRadicleSeedObservationTimestamps) => [...new Map(blockheadRadicleSeedObservationTimestamps.values.map((blockheadRadicleSeedObservationTimestamp) => [blockheadRadicleSeedObservationTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleSeedObservationTimestamp])).values()]}
	getKey={(blockheadRadicleSeedObservationTimestamp) => blockheadRadicleSeedObservationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead radicle seed observation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRadicleSeedObservationTimestamp })}
		{@const blockheadRadicleSeedObservationTimestampFields = { ...blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector], ...blockheadRadicleSeedObservationTimestamp }}
		{@const selection = select(EntityType.BlockheadRadicleSeedObservation_Timestamp, blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadRadicleSeedObservation_TimestampView
			selection={selection}
			prefetched={blockheadRadicleSeedObservationTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
