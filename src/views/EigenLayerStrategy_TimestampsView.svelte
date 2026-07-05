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
		title = 'Eigen layer strategy observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerStrategy_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EigenLayerStrategy_Timestamp>
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
	import EigenLayerStrategy_TimestampView from '$/views/EigenLayerStrategy_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					$strategy: true,
					timestampMs: true,
					totalShares: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(eigenLayerStrategyTimestamps)}
			{@const uniqueEigenLayerStrategyTimestamps = [...new Map(eigenLayerStrategyTimestamps.values.map((eigenLayerStrategyTimestamp) => [eigenLayerStrategyTimestamp[EntityMetaKey.SelectorKey], eigenLayerStrategyTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EigenLayerStrategy_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eigenLayerStrategyTimestamps.totalCount}
				getKey={(eigenLayerStrategyTimestamp) => eigenLayerStrategyTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEigenLayerStrategyTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Eigen layer strategy observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eigenLayerStrategyTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EigenLayerStrategy_Timestamp> })}
					{@const eigenLayerStrategyTimestampFields = { ...eigenLayerStrategyTimestamp[EntityMetaKey.Selector], ...eigenLayerStrategyTimestamp }}
					<EigenLayerStrategy_TimestampView
						selection={select(EntityType.EigenLayerStrategy_Timestamp, eigenLayerStrategyTimestamp[EntityMetaKey.Selector])}
						prefetched={eigenLayerStrategyTimestampFields}
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
		entityType={EntityType.EigenLayerStrategy_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
