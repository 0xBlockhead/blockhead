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
		placeholderText,
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
			selection({
				fields: {
					listingStage: true,
					timestampMs: true,
					$rollup: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={evmRollupTimestamps.totalCount}
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
					{@const evmRollupTimestampFields = { ...evmRollupTimestamp[EntityMetaKey.Selector], ...evmRollupTimestamp }}
					{@const evmRollupTimestampHrefFields = { ...evmRollupTimestamp, ...evmRollupTimestamp[EntityMetaKey.Selector] }}
					<EvmRollup_TimestampView
						selection={select(EntityType.EvmRollup_Timestamp, evmRollupTimestamp[EntityMetaKey.Selector])}
						prefetched={evmRollupTimestampFields}
						href={
							(evmRollupTimestampHrefFields.$rollup !== undefined && evmRollupTimestampHrefFields.$rollup.$network !== undefined && evmRollupTimestampHrefFields.$rollup.$network.caip2 !== undefined && evmRollupTimestampHrefFields.$rollup.$network.caip2.namespace !== undefined && evmRollupTimestampHrefFields.$rollup !== undefined && evmRollupTimestampHrefFields.$rollup.$network !== undefined && evmRollupTimestampHrefFields.$rollup.$network.caip2 !== undefined && evmRollupTimestampHrefFields.$rollup.$network.caip2.reference !== undefined && evmRollupTimestampHrefFields.$rollup !== undefined && evmRollupTimestampHrefFields.$rollup.projectId !== undefined && evmRollupTimestampHrefFields.timestampMs !== undefined && evmRollupTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]/timestamp/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(evmRollupTimestampHrefFields.$rollup.$network.caip2.namespace ?? '')}:${String(evmRollupTimestampHrefFields.$rollup.$network.caip2.reference ?? '')}`,
								projectId: String(evmRollupTimestampHrefFields.$rollup.projectId ?? ''),
								timestampMs: String(evmRollupTimestampHrefFields.timestampMs ?? ''),
								source: String(evmRollupTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
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
