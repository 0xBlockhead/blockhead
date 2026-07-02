<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
		title = 'EVM rollup observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM rollup observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmRollup_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmRollup_Timestamp>
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
	import EvmRollup_TimestampView from '$/views/EvmRollup_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					listingStage: true,
					timestampMs: true,
					$rollup: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmRollup_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(evmRollupTimestamps)}
			{@const uniqueEvmRollupTimestamps = [...new Map(evmRollupTimestamps.values.map((evmRollupTimestamp) => [evmRollupTimestamp[EntityMetaKey.SelectorKey], evmRollupTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmRollup_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmRollupTimestamps.values.length === uniqueEvmRollupTimestamps.length && evmRollupTimestamps.totalCount != null && evmRollupTimestamps.totalCount >= uniqueEvmRollupTimestamps.length ? evmRollupTimestamps.totalCount : uniqueEvmRollupTimestamps.length}
				getKey={(evmRollupTimestamp) => evmRollupTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmRollupTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM rollup observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmRollupTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmRollup_Timestamp> })}
					<EvmRollup_TimestampView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(({ ...evmRollupTimestamp.entitySelector, ...evmRollupTimestamp }).$rollup.$network.caip2.namespace)}:${String(({ ...evmRollupTimestamp.entitySelector, ...evmRollupTimestamp }).$rollup.$network.caip2.reference)}`,
								projectId: String(({ ...evmRollupTimestamp.entitySelector, ...evmRollupTimestamp }).$rollup.projectId),
								timestampMs: String(({ ...evmRollupTimestamp.entitySelector, ...evmRollupTimestamp }).timestampMs),
								source: String(({ ...evmRollupTimestamp.entitySelector, ...evmRollupTimestamp }).source),
							})
						}
						selection={select(EntityType.EvmRollup_Timestamp, evmRollupTimestamp.entitySelector)}
						prefetched={evmRollupTimestamp}
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
		entityType={EntityType.EvmRollup_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
