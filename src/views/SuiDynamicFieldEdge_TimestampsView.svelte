<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Sui dynamic field edge observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiDynamicFieldEdge_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SuiDynamicFieldEdge_Timestamp>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SuiDynamicFieldEdge_TimestampView from '$/views/SuiDynamicFieldEdge_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet children(suiDynamicFieldEdgeTimestamps)}
			{@const uniqueSuiDynamicFieldEdgeTimestamps = [...new Map(suiDynamicFieldEdgeTimestamps.values.map((suiDynamicFieldEdgeTimestamp) => [suiDynamicFieldEdgeTimestamp[EntityMetaKey.SelectorKey], suiDynamicFieldEdgeTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={suiDynamicFieldEdgeTimestamps.totalCount}
				getKey={(suiDynamicFieldEdgeTimestamp) => suiDynamicFieldEdgeTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueSuiDynamicFieldEdgeTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Sui dynamic field edge observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: suiDynamicFieldEdgeTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SuiDynamicFieldEdge_Timestamp> })}
					{@const suiDynamicFieldEdgeTimestampFields = { ...suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector], ...suiDynamicFieldEdgeTimestamp }}
					<SuiDynamicFieldEdge_TimestampView
						selection={select(EntityType.SuiDynamicFieldEdge_Timestamp, suiDynamicFieldEdgeTimestamp[EntityMetaKey.Selector])}
						prefetched={suiDynamicFieldEdgeTimestampFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.SuiDynamicFieldEdge_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
