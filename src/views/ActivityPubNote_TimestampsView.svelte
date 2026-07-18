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
		title = 'ActivityPub note observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubNote_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubNote_Timestamp>
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
	import ActivityPubNote_TimestampView from '$/views/ActivityPubNote_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubNote_Timestamp}
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
				$note: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	getResourceItems={(activityPubNoteTimestamps) => [...new Map(activityPubNoteTimestamps.values.map((activityPubNoteTimestamp) => [activityPubNoteTimestamp[EntityMetaKey.SelectorKey], activityPubNoteTimestamp])).values()]}
	getKey={(activityPubNoteTimestamp) => activityPubNoteTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub note observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubNoteTimestamp })}
		{@const activityPubNoteTimestampFields = { ...activityPubNoteTimestamp[EntityMetaKey.Selector], ...activityPubNoteTimestamp }}
		{@const selection = select(EntityType.ActivityPubNote_Timestamp, activityPubNoteTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const activityPubNoteTimestampHrefFields = { ...activityPubNoteTimestamp, ...activityPubNoteTimestamp[EntityMetaKey.Selector] }}
		<ActivityPubNote_TimestampView
			selection={selection}
			prefetched={activityPubNoteTimestampFields}
			href={
				(activityPubNoteTimestampHrefFields.timestampMs !== undefined && activityPubNoteTimestampHrefFields.source !== undefined && activityPubNoteTimestampHrefFields.$note !== undefined && activityPubNoteTimestampHrefFields.$note.instanceOrigin !== undefined && activityPubNoteTimestampHrefFields.$note.localStatusId !== undefined ? resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(activityPubNoteTimestampHrefFields.timestampMs ?? ''),
					source: String(activityPubNoteTimestampHrefFields.source ?? ''),
					instanceOrigin: encodeURIComponent(String(activityPubNoteTimestampHrefFields.$note.instanceOrigin ?? '')),
					localStatusId: String(activityPubNoteTimestampHrefFields.$note.localStatusId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
