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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.ActivityPubNote>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.ActivityPubNote}
			entitySelector={activityPubNote[EntityMetaKey.Selector]}
			href={
				(
					activityPubNote[EntityMetaKey.Selector] != null && 'instanceOrigin' in activityPubNote[EntityMetaKey.Selector]
					&& activityPubNote[EntityMetaKey.Selector].instanceOrigin != null
					&& activityPubNote[EntityMetaKey.Selector] != null && 'localStatusId' in activityPubNote[EntityMetaKey.Selector]
					&& activityPubNote[EntityMetaKey.Selector].localStatusId != null ?
						resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', {
					instanceOrigin: encodeURIComponent(String(activityPubNote[EntityMetaKey.Selector].instanceOrigin ?? '')),
					localStatusId: String(activityPubNote[EntityMetaKey.Selector].localStatusId ?? ''),
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
				{[activityPubNoteFields.content == null ? '' : String((htmlToPlainText((activityPubNoteFields.content))) ?? ''), String((activityPubNoteFields.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note'}
			{/snippet}

			{#snippet Value()}
				{[String((activityPubNoteFields.createdAt) ?? ''), String((activityPubNoteFields.localStatusId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
