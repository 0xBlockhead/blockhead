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
		title = 'Eigen layer avs observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerAvs_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EigenLayerAvs_Timestamp>
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
	import EigenLayerAvs_TimestampView from '$/views/EigenLayerAvs_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerAvs_Timestamp}
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
				$avs: true,
				timestampMs: true,
				operatorCount: true,
			},
		})
	}
	getResourceItems={(eigenLayerAvsTimestamps) => [...new Map(eigenLayerAvsTimestamps.values.map((eigenLayerAvsTimestamp) => [eigenLayerAvsTimestamp[EntityMetaKey.SelectorKey], eigenLayerAvsTimestamp])).values()]}
	getKey={(eigenLayerAvsTimestamp) => eigenLayerAvsTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer avs observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerAvsTimestamp })}
		{@const eigenLayerAvsTimestampFields = { ...eigenLayerAvsTimestamp[EntityMetaKey.Selector], ...eigenLayerAvsTimestamp }}
		{@const selection = select(EntityType.EigenLayerAvs_Timestamp, eigenLayerAvsTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EigenLayerAvs_TimestampView
			selection={selection}
			prefetched={eigenLayerAvsTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
