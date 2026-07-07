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
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM topic observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTopic_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmTopic_Timestamp>
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
	import EvmTopic_TimestampView from '$/views/EvmTopic_TimestampView.svelte'
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
				sources: [
					Source.Openchain_Rest,
				],
				fields: {
					timestampMs: true,
					source: true,
					$topic: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTopic_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmTopicTimestamps)}
			{@const uniqueEvmTopicTimestamps = [...new Map(evmTopicTimestamps.values.map((evmTopicTimestamp) => [evmTopicTimestamp[EntityMetaKey.SelectorKey], evmTopicTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTopic_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmTopicTimestamps.totalCount}
				getKey={(evmTopicTimestamp) => evmTopicTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmTopicTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM topic observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmTopicTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmTopic_Timestamp> })}
					{@const evmTopicTimestampFields = { ...evmTopicTimestamp[EntityMetaKey.Selector], ...evmTopicTimestamp }}
					{@const evmTopicTimestampHrefFields = { ...evmTopicTimestamp, ...evmTopicTimestamp[EntityMetaKey.Selector] }}
					<EvmTopic_TimestampView
						selection={select(EntityType.EvmTopic_Timestamp, evmTopicTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmTopicTimestampFields}
						href={
							(evmTopicTimestampHrefFields.$topic !== undefined && evmTopicTimestampHrefFields.$topic.hex !== undefined && evmTopicTimestampHrefFields.timestampMs !== undefined && evmTopicTimestampHrefFields.source !== undefined ? resolve('/(explore)/(evm)/evm/(topics)/topic/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								hex: String(evmTopicTimestampHrefFields.$topic.hex ?? ''),
								timestampMs: String(evmTopicTimestampHrefFields.timestampMs ?? ''),
								source: String(evmTopicTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.EvmTopic_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
