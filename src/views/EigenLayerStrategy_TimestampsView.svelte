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
		title = 'Eigen layer strategy observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerStrategy_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EigenLayerStrategy_Timestamp>
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
	import EigenLayerStrategy_TimestampView from '$/views/EigenLayerStrategy_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerStrategy_Timestamp}
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
				$strategy: true,
				timestampMs: true,
				totalShares: true,
			},
		})
	}
	getResourceItems={(eigenLayerStrategyTimestamps) => [...new Map(eigenLayerStrategyTimestamps.values.map((eigenLayerStrategyTimestamp) => [eigenLayerStrategyTimestamp[EntityMetaKey.SelectorKey], eigenLayerStrategyTimestamp])).values()]}
	getKey={(eigenLayerStrategyTimestamp) => eigenLayerStrategyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer strategy observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerStrategyTimestamp })}
		{@const eigenLayerStrategyTimestampFields = { ...eigenLayerStrategyTimestamp[EntityMetaKey.Selector], ...eigenLayerStrategyTimestamp }}
		{@const selection = select(EntityType.EigenLayerStrategy_Timestamp, eigenLayerStrategyTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EigenLayerStrategy_TimestampView
			selection={selection}
			prefetched={eigenLayerStrategyTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
