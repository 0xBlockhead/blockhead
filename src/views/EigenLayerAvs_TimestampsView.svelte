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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerAvs_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EigenLayerAvs_Timestamp}
			entitySelector={eigenLayerAvsTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((eigenLayerAvsTimestampFields.$avs.avsAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer avs'].filter(Boolean).join(' ') || 'eigen layer avs timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((eigenLayerAvsTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eigenLayerAvsTimestampFields.operatorCount) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
