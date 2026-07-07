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
		title = 'ENS record observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsRecord_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EnsRecord_Timestamp>
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
	import EnsRecord_TimestampView from '$/views/EnsRecord_TimestampView.svelte'
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
					$record: true,
					timestampMs: true,
					source: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EnsRecord_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(ensRecordTimestamps)}
			{@const uniqueEnsRecordTimestamps = [...new Map(ensRecordTimestamps.values.map((ensRecordTimestamp) => [ensRecordTimestamp[EntityMetaKey.SelectorKey], ensRecordTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EnsRecord_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={ensRecordTimestamps.totalCount}
				getKey={(ensRecordTimestamp) => ensRecordTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueEnsRecordTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ENS record observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: ensRecordTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EnsRecord_Timestamp> })}
					{@const ensRecordTimestampFields = { ...ensRecordTimestamp[EntityMetaKey.Selector], ...ensRecordTimestamp }}
					{@const ensRecordTimestampHrefFields = { ...ensRecordTimestamp, ...ensRecordTimestamp[EntityMetaKey.Selector] }}
					<EnsRecord_TimestampView
						selection={select(EntityType.EnsRecord_Timestamp, ensRecordTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={ensRecordTimestampFields}
						href={
							(ensRecordTimestampHrefFields.$record !== undefined && ensRecordTimestampHrefFields.$record.$name !== undefined && ensRecordTimestampHrefFields.$record.$name.name !== undefined && ensRecordTimestampHrefFields.$record !== undefined && ensRecordTimestampHrefFields.$record.recordKey !== undefined && ensRecordTimestampHrefFields.timestampMs !== undefined && ensRecordTimestampHrefFields.source !== undefined ? resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/record/[recordId]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								ensName: String(ensRecordTimestampHrefFields.$record.$name.name ?? ''),
								recordId: String(ensRecordTimestampHrefFields.$record.recordKey ?? ''),
								timestampMs: String(ensRecordTimestampHrefFields.timestampMs ?? ''),
								source: String(ensRecordTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.EnsRecord_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
