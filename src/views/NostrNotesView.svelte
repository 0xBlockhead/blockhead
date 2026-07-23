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
		title = 'Nostr notes',
		typeAnnotationParagraphs = ['A Nostr text note is a kind-1 event addressed by event id; author, reply, root, reaction, and relay facets remain separate fields.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrNotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.NostrNote>
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
	entityType={EntityType.NostrNote}
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
				eventId: true,
				createdAt: true,
				sensitive: true,
				contentWarning: true,
			},
		})
	}
	{countResource}
	getResourceItems={(nostrNotes) => [...new Map(nostrNotes.values.map((nostrNote) => [nostrNote[EntityMetaKey.SelectorKey], nostrNote])).values()]}
	getKey={(nostrNote) => nostrNote[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr notes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrNote })}
		{@const nostrNoteFields = { ...nostrNote[EntityMetaKey.Selector], ...nostrNote }}
		<EntityView
			entityType={EntityType.NostrNote}
			entitySelector={nostrNote[EntityMetaKey.Selector]}
			href={
				(
					nostrNote[EntityMetaKey.Selector] != null && 'eventId' in nostrNote[EntityMetaKey.Selector]
					&& nostrNote[EntityMetaKey.Selector].eventId != null ?
						resolve('/nostr/note/[eventId=stringSegment]', {
					eventId: String(nostrNote[EntityMetaKey.Selector].eventId ?? ''),
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
				{[String((nostrNoteFields.content) ?? '')].filter(Boolean).join(' ') || [String((nostrNoteFields.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr note'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((nostrNoteFields.createdAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
