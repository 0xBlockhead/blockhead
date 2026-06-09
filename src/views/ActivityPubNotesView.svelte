<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		id,
		limit = 50,
		open = $bindable(true),
		orderByCreatedAt,
		placeholderText,
		title,
		entityFieldReference,
		fieldOpen = true,
		CollapsibleProps = {},
		href,
	}: {
		id: string
		limit?: number
		open?: boolean
		orderByCreatedAt: 'asc' | 'desc'
		placeholderText: string
		title: string
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.ActivityPubNote>
		fieldOpen?: boolean
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
		href?: ComponentProps<typeof EntitiesList>['href']
	} = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	collapsible={true}
	entityType={EntityType.ActivityPubNote}
	{id}
	bind:open
	{title}
	{href}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Mastodon public timeline statuses for this facet—each row resolves note text, visibility, and engagement from the instance REST API.
		</p>
		<p>
			Ordering follows Mastodon status id (snowflake) when the collection returns id-only refs; activate the facet to load the timeline.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					fieldOpen ?
						{
							fields: {
								[entityFieldReference.fieldName]: {
									sources: [
										Source.Mastodon_Rest,
										Source.Fedi_Rest,
									],
								},
							},
						}
					:
						{ fields: {} }
				),
			)}
			{@const notes = derive(
				parent,
				(parent) => {
					const activityPubNotes: readonly Entity<typeof schema, EntityType.ActivityPubNote>[] = (
						parent.fields[entityFieldReference.fieldName]?.values ?? []
					)
					return activityPubNotes
				},
			)}
			{#key `${stringify(entityFieldReference.entityId)}-${limit}-${fieldOpen}-${orderByCreatedAt}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.ActivityPubNote}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(activityPubNote) => stringify(activityPubNote[EntityMetaKey.Id])}
					getSortValue={(activityPubNote) => (
						orderByCreatedAt === 'asc' ?
							Number(activityPubNote[EntityMetaKey.Id].localStatusId) || 0
						:
							-(Number(activityPubNote[EntityMetaKey.Id].localStatusId) || 0)
					)}
					placeholderText={(
						fieldOpen ?
							placeholderText
						:
							'Facet idle—no timeline request.'
					)}
					resource={notes}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No notes yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						{@const noteId = item[EntityMetaKey.Id]}
						<ActivityPubNoteView
							entityId={{
								instanceOrigin: noteId.instanceOrigin,
								localStatusId: noteId.localStatusId,
							}}
							layout={EntityLayout.Summary}
							open={false}
							showTypeAnnotation={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
