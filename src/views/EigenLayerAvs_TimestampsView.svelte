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
		title = 'Eigen layer avs observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerAvs_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EigenLayerAvs_Timestamp>
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
	import EigenLayerAvs_TimestampView from '$/views/EigenLayerAvs_TimestampView.svelte'
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
					$avs: true,
					timestampMs: true,
					operatorCount: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(eigenLayerAvsTimestamps)}
			{@const uniqueEigenLayerAvsTimestamps = [...new Map(eigenLayerAvsTimestamps.values.map((eigenLayerAvsTimestamp) => [eigenLayerAvsTimestamp[EntityMetaKey.SelectorKey], eigenLayerAvsTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EigenLayerAvs_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eigenLayerAvsTimestamps.totalCount}
				getKey={(eigenLayerAvsTimestamp) => eigenLayerAvsTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEigenLayerAvsTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Eigen layer avs observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eigenLayerAvsTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EigenLayerAvs_Timestamp> })}
					{@const eigenLayerAvsTimestampFields = { ...eigenLayerAvsTimestamp[EntityMetaKey.Selector], ...eigenLayerAvsTimestamp }}
					<EigenLayerAvs_TimestampView
						selection={select(EntityType.EigenLayerAvs_Timestamp, eigenLayerAvsTimestamp[EntityMetaKey.Selector])}
						prefetched={eigenLayerAvsTimestampFields}
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
		entityType={EntityType.EigenLayerAvs_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
