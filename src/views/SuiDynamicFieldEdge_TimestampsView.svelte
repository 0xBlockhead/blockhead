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
		title = 'Sui dynamic field edge observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiDynamicFieldEdge_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SuiDynamicFieldEdge_Timestamp>
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
	import SuiDynamicFieldEdge_TimestampView from '$/views/SuiDynamicFieldEdge_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(suiDynamicFieldEdgeTimestamps) => [...new Map(suiDynamicFieldEdgeTimestamps.values.map((suiDynamicFieldEdgeTimestamp) => [suiDynamicFieldEdgeTimestamp[EntityMetaKey.SelectorKey], suiDynamicFieldEdgeTimestamp])).values()]}
	getKey={(suiDynamicFieldEdgeTimestamp) => suiDynamicFieldEdgeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Sui dynamic field edge observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: suiDynamicFieldEdgeTimestamp })}
		{@const suiDynamicFieldEdgeTimestampFields = { ...suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector], ...suiDynamicFieldEdgeTimestamp }}
		{@const selection = select(EntityType.SuiDynamicFieldEdge_Timestamp, suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SuiDynamicFieldEdge_TimestampView
			selection={selection}
			prefetched={suiDynamicFieldEdgeTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
