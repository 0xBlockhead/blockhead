<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM topic observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTopic_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmTopic_Timestamp>
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

				{#snippet Item({ item: evmTopicTimestamp })}
					{@const evmTopicTimestampFields = { ...evmTopicTimestamp[EntityMetaKey.Selector], ...evmTopicTimestamp }}
					{@const selection = select(EntityType.EvmTopic_Timestamp, evmTopicTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const evmTopicTimestampHrefFields = { ...evmTopicTimestamp, ...evmTopicTimestamp[EntityMetaKey.Selector] }}
					<EvmTopic_TimestampView
						selection={selection}
						prefetched={evmTopicTimestampFields}
						href={
							(evmTopicTimestampHrefFields.timestampMs !== undefined && evmTopicTimestampHrefFields.source !== undefined && evmTopicTimestampHrefFields.$topic !== undefined && evmTopicTimestampHrefFields.$topic.hex !== undefined ? resolve('/evm/topic/[hex=zeroExHex]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
								timestampMs: String(evmTopicTimestampHrefFields.timestampMs ?? ''),
								source: String(evmTopicTimestampHrefFields.source ?? ''),
								hex: String(evmTopicTimestampHrefFields.$topic.hex ?? ''),
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
