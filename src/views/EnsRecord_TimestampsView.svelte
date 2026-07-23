<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'ENS record observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EnsRecord_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EnsRecord_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsRecord_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$record: {
					fields: {
						$name: true,
					},
				},
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(ensRecordTimestamps) => [...new Map(ensRecordTimestamps.values.map((ensRecordTimestamp) => [ensRecordTimestamp[EntityMetaKey.SelectorKey], ensRecordTimestamp])).values()]}
	getKey={(ensRecordTimestamp) => ensRecordTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ENS record observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ensRecordTimestamp })}
		{@const ensRecordTimestampFields = { ...ensRecordTimestamp[EntityMetaKey.Selector], ...ensRecordTimestamp }}
		<EntityView
			entityType={EntityType.EnsRecord_Timestamp}
			entitySelector={ensRecordTimestamp[EntityMetaKey.Selector]}
			href={
				(
					ensRecordTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in ensRecordTimestamp[EntityMetaKey.Selector]
					&& ensRecordTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& ensRecordTimestamp[EntityMetaKey.Selector] != null && 'source' in ensRecordTimestamp[EntityMetaKey.Selector]
					&& ensRecordTimestamp[EntityMetaKey.Selector].source != null
					&& ensRecordTimestamp[EntityMetaKey.Selector] != null && '$record' in ensRecordTimestamp[EntityMetaKey.Selector]
					&& ensRecordTimestamp[EntityMetaKey.Selector].$record != null && '$name' in ensRecordTimestamp[EntityMetaKey.Selector].$record
					&& ensRecordTimestamp[EntityMetaKey.Selector].$record.$name != null && 'name' in ensRecordTimestamp[EntityMetaKey.Selector].$record.$name
					&& ensRecordTimestamp[EntityMetaKey.Selector].$record.$name.name != null
					&& ensRecordTimestamp[EntityMetaKey.Selector].$record != null && 'recordKey' in ensRecordTimestamp[EntityMetaKey.Selector].$record
					&& ensRecordTimestamp[EntityMetaKey.Selector].$record.recordKey != null ?
						resolve('/ens/name/[ensName=stringSegment]/record/[recordId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(ensRecordTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(ensRecordTimestamp[EntityMetaKey.Selector].source ?? ''),
					ensName: encodeURIComponent(String(ensRecordTimestamp[EntityMetaKey.Selector].$record.$name.name ?? '')),
					recordId: encodeURIComponent(String(ensRecordTimestamp[EntityMetaKey.Selector].$record.recordKey ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((ensRecordTimestampFields.$record.recordKey) ?? '')].filter(Boolean).join(' ') || 'ENS record'].filter(Boolean).join(' ') || 'ENS record observation'}
			{/snippet}

			{#snippet Value()}
				{[String((ensRecordTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
