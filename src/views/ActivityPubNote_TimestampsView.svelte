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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubNote_Timestamp>
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
				$note: {
					fields: {
						content: true,
						localStatusId: true,
						createdAt: true,
					},
				},
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.ActivityPubNote_Timestamp}
			entitySelector={activityPubNoteTimestamp[EntityMetaKey.Selector]}
			href={
				(
					activityPubNoteTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in activityPubNoteTimestamp[EntityMetaKey.Selector]
					&& activityPubNoteTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& activityPubNoteTimestamp[EntityMetaKey.Selector] != null && 'source' in activityPubNoteTimestamp[EntityMetaKey.Selector]
					&& activityPubNoteTimestamp[EntityMetaKey.Selector].source != null
					&& activityPubNoteTimestamp[EntityMetaKey.Selector] != null && '$note' in activityPubNoteTimestamp[EntityMetaKey.Selector]
					&& activityPubNoteTimestamp[EntityMetaKey.Selector].$note != null && 'instanceOrigin' in activityPubNoteTimestamp[EntityMetaKey.Selector].$note
					&& activityPubNoteTimestamp[EntityMetaKey.Selector].$note.instanceOrigin != null
					&& activityPubNoteTimestamp[EntityMetaKey.Selector].$note != null && 'localStatusId' in activityPubNoteTimestamp[EntityMetaKey.Selector].$note
					&& activityPubNoteTimestamp[EntityMetaKey.Selector].$note.localStatusId != null ?
						resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(activityPubNoteTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(activityPubNoteTimestamp[EntityMetaKey.Selector].source ?? ''),
					instanceOrigin: encodeURIComponent(String(activityPubNoteTimestamp[EntityMetaKey.Selector].$note.instanceOrigin ?? '')),
					localStatusId: String(activityPubNoteTimestamp[EntityMetaKey.Selector].$note.localStatusId ?? ''),
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
				{[[activityPubNoteTimestampFields.$note.content == null ? '' : String((htmlToPlainText((activityPubNoteTimestampFields.$note.content))) ?? ''), String((activityPubNoteTimestampFields.$note.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note'].filter(Boolean).join(' ') || 'ActivityPub note observation'}
			{/snippet}

			{#snippet Value()}
				{[String((activityPubNoteTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
