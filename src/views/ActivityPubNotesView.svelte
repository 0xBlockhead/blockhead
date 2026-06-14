<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'

	type ActivityPubNoteOrderFieldRow = {
		localStatusId?: string
		[EntityMetaKey.SelectorKey]: string
	}


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	import type { DeclarativeOrderBy } from '$/client/$client.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{@const activityPubNoteOrderBy = [
				[
					({ fieldRow }) => fieldRow.localStatusId,
					orderByCreatedAt,
				],
				[
					({ fieldRow }) => fieldRow[EntityMetaKey.SelectorKey],
					'asc',
				],
			] as const satisfies DeclarativeOrderBy<ActivityPubNoteOrderFieldRow>}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,
				(
					fieldOpen ?
						{
							fields: {
								[entityFieldReference.fieldName]: {
									sources: [
										Source.Mastodon_Rest,
										Source.Fedi_Rest,
									],
									orderBy: [...activityPubNoteOrderBy],
									limit: limit,
								},
							},
						}
					:
						{ fields: {} }
				),
			)}
			{#key `${stringify(entityFieldReference.selector)}-${limit}-${fieldOpen}-${orderByCreatedAt}`}
				<ResourceBoundary
					resource={parent}
					placeholderText={(
						fieldOpen ?
							placeholderText
						:
							'Facet idle—no timeline request.'
					)}
				>
					{#snippet children(parent)}
						<EntitiesList
							collapsible={false}
							showSummary={false}
							entityType={EntityType.ActivityPubNote}
							id={`${id}-items`}
							{title}
							open={true}
							getKey={(activityPubNote) => stringify(activityPubNote[EntityMetaKey.Selector])}
							placeholderText={(
								fieldOpen ?
									placeholderText
								:
									'Facet idle—no timeline request.'
							)}
							items={parent.fields[entityFieldReference.fieldName]?.values ?? []}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No notes yet.
								</p>
							{/snippet}

							{#snippet Item({ item })}
								{@const noteId = item[EntityMetaKey.Selector]}
								<ActivityPubNoteView
									selector={{
										instanceOrigin: noteId.instanceOrigin,
										localStatusId: noteId.localStatusId,
									}}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							{/snippet}
						</EntitiesList>
					{/snippet}
				</ResourceBoundary>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
