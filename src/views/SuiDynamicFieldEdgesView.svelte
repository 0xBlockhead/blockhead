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
		title = 'Sui dynamic field edges',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiDynamicFieldEdges-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SuiDynamicFieldEdge>
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
	import SuiDynamicFieldEdgeView from '$/views/SuiDynamicFieldEdgeView.svelte'
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
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SuiDynamicFieldEdge}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(suiDynamicFieldEdges)}
			{@const uniqueSuiDynamicFieldEdges = [...new Map(suiDynamicFieldEdges.values.map((suiDynamicFieldEdge) => [suiDynamicFieldEdge[EntityMetaKey.SelectorKey], suiDynamicFieldEdge])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SuiDynamicFieldEdge}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={suiDynamicFieldEdges.totalCount}
				getKey={(suiDynamicFieldEdge) => suiDynamicFieldEdge[EntityMetaKey.SelectorKey]}
				items={uniqueSuiDynamicFieldEdges}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Sui dynamic field edges yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: suiDynamicFieldEdge }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SuiDynamicFieldEdge> })}
					{@const suiDynamicFieldEdgeFields = { ...suiDynamicFieldEdge[EntityMetaKey.Selector], ...suiDynamicFieldEdge }}
					<SuiDynamicFieldEdgeView
						selection={select(EntityType.SuiDynamicFieldEdge, suiDynamicFieldEdge[EntityMetaKey.Selector])}
						prefetched={suiDynamicFieldEdgeFields}
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
		entityType={EntityType.SuiDynamicFieldEdge}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
