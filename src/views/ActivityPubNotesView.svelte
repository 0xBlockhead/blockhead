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
		title = 'ActivityPub notes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ActivityPubNotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ActivityPubNote>
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
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubNote}
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
				content: true,
				localStatusId: true,
				createdAt: true,
				sensitive: true,
				spoilerText: true,
				instanceOrigin: true,
			},
		})
	}
	getResourceItems={(activityPubNotes) => [...new Map(activityPubNotes.values.map((activityPubNote) => [activityPubNote[EntityMetaKey.SelectorKey], activityPubNote])).values()]}
	getKey={(activityPubNote) => activityPubNote[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ActivityPub notes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: activityPubNote })}
		{@const activityPubNoteFields = { ...activityPubNote[EntityMetaKey.Selector], ...activityPubNote }}
		{@const selection = select(EntityType.ActivityPubNote, activityPubNote[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const activityPubNoteHrefFields = { ...activityPubNote, ...activityPubNote[EntityMetaKey.Selector] }}
		<ActivityPubNoteView
			selection={selection}
			prefetched={activityPubNoteFields}
			href={
				(activityPubNoteHrefFields.instanceOrigin !== undefined && activityPubNoteHrefFields.localStatusId !== undefined ? resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', {
					instanceOrigin: encodeURIComponent(String(activityPubNoteHrefFields.instanceOrigin ?? '')),
					localStatusId: String(activityPubNoteHrefFields.localStatusId ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
