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
		title = 'EVM selector observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmSelector_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmSelector_Timestamp>
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
	import EvmSelector_TimestampView from '$/views/EvmSelector_TimestampView.svelte'
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
					$selector: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmSelector_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmSelectorTimestamps)}
			{@const uniqueEvmSelectorTimestamps = [...new Map(evmSelectorTimestamps.values.map((evmSelectorTimestamp) => [evmSelectorTimestamp[EntityMetaKey.SelectorKey], evmSelectorTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmSelector_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmSelectorTimestamps.totalCount}
				getKey={(evmSelectorTimestamp) => evmSelectorTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmSelectorTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM selector observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmSelectorTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmSelector_Timestamp> })}
					{@const evmSelectorTimestampFields = { ...evmSelectorTimestamp[EntityMetaKey.Selector], ...evmSelectorTimestamp }}
					{@const evmSelectorTimestampHrefFields = { ...evmSelectorTimestamp, ...evmSelectorTimestamp[EntityMetaKey.Selector] }}
					<EvmSelector_TimestampView
						selection={select(EntityType.EvmSelector_Timestamp, evmSelectorTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmSelectorTimestampFields}
						href={
							(evmSelectorTimestampHrefFields.$selector !== undefined && evmSelectorTimestampHrefFields.$selector.hex !== undefined && evmSelectorTimestampHrefFields.timestampMs !== undefined && evmSelectorTimestampHrefFields.source !== undefined ? resolve('/(explore)/(evm)/evm/(selectors)/selector/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								hex: String(evmSelectorTimestampHrefFields.$selector.hex ?? ''),
								timestampMs: String(evmSelectorTimestampHrefFields.timestampMs ?? ''),
								source: String(evmSelectorTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.EvmSelector_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
