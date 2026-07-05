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
		title = 'EVM error observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmError_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmError_Timestamp>
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
	import EvmError_TimestampView from '$/views/EvmError_TimestampView.svelte'
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
					$error: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(evmErrorTimestamps)}
			{@const uniqueEvmErrorTimestamps = [...new Map(evmErrorTimestamps.values.map((evmErrorTimestamp) => [evmErrorTimestamp[EntityMetaKey.SelectorKey], evmErrorTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmError_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmErrorTimestamps.totalCount}
				getKey={(evmErrorTimestamp) => evmErrorTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEvmErrorTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM error observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmErrorTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmError_Timestamp> })}
					{@const evmErrorTimestampFields = { ...evmErrorTimestamp[EntityMetaKey.Selector], ...evmErrorTimestamp }}
					{@const evmErrorTimestampHrefFields = { ...evmErrorTimestamp, ...evmErrorTimestamp[EntityMetaKey.Selector] }}
					<EvmError_TimestampView
						selection={select(EntityType.EvmError_Timestamp, evmErrorTimestamp[EntityMetaKey.Selector])}
						prefetched={evmErrorTimestampFields}
						href={
							(evmErrorTimestampHrefFields.$error !== undefined && evmErrorTimestampHrefFields.$error.hex !== undefined && evmErrorTimestampHrefFields.timestampMs !== undefined && evmErrorTimestampHrefFields.source !== undefined ? resolve('/(explore)/(evm)/evm/(errors)/error/[hex]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								hex: String(evmErrorTimestampHrefFields.$error.hex ?? ''),
								timestampMs: String(evmErrorTimestampHrefFields.timestampMs ?? ''),
								source: String(evmErrorTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.EvmError_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
