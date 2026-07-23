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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SuiDynamicFieldEdge_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
			entitySelector={suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'Sui dynamic field edge timestamp'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
