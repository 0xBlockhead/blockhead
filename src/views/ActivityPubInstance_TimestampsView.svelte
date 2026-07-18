<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'ActivityPub instance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubInstance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubInstance_Timestamp>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubInstance_Timestamp}
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
				title: true,
				timestampMs: true,
				$instance: true,
				source: true,
				version: true,
			},
		})
	}
	getResourceItems={(activityPubInstanceTimestamps) => [...new Map(activityPubInstanceTimestamps.values.map((activityPubInstanceTimestamp) => [activityPubInstanceTimestamp[EntityMetaKey.SelectorKey], activityPubInstanceTimestamp])).values()]}
	getKey={(activityPubInstanceTimestamp) => activityPubInstanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub instance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubInstanceTimestamp })}
		{@const activityPubInstanceTimestampFields = { ...activityPubInstanceTimestamp[EntityMetaKey.Selector], ...activityPubInstanceTimestamp }}
		{@const selection = select(EntityType.ActivityPubInstance_Timestamp, activityPubInstanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const activityPubInstanceTimestampHrefFields = { ...activityPubInstanceTimestamp, ...activityPubInstanceTimestamp[EntityMetaKey.Selector] }}
		<ActivityPubInstance_TimestampView
			selection={selection}
			prefetched={activityPubInstanceTimestampFields}
			href={
				(activityPubInstanceTimestampHrefFields.timestampMs !== undefined && activityPubInstanceTimestampHrefFields.source !== undefined && activityPubInstanceTimestampHrefFields.$instance !== undefined && activityPubInstanceTimestampHrefFields.$instance.instanceOrigin !== undefined ? resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(activityPubInstanceTimestampHrefFields.timestampMs ?? ''),
					source: String(activityPubInstanceTimestampHrefFields.source ?? ''),
					instanceOrigin: encodeURIComponent(String(activityPubInstanceTimestampHrefFields.$instance.instanceOrigin ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
