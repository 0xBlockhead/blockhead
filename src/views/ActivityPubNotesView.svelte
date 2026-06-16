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
			{#if fieldOpen}
				{@const parent = subscribe(entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						fields: {
							[entityFieldReference.fieldName]: {
								sources: [
									Source.Mastodon_Rest,
									Source.Fedi_Rest,
								],
								orderBy: [
									[
										({ fieldRow }) => fieldRow.localStatusId,
										orderByCreatedAt,
									],
									[
										({ fieldRow }) => fieldRow[EntityMetaKey.SelectorKey],
										'asc',
									],
								] as const satisfies DeclarativeOrderBy<ActivityPubNoteOrderFieldRow>,
								limit,
							},
						},
					},
				)}
				{#key `${stringify(entityFieldReference.selector)}-${limit}-${orderByCreatedAt}`}
					<ResourceBoundary
						resource={parent}
						placeholderText={placeholderText}
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
								{placeholderText}
								items={parent.fields[entityFieldReference.fieldName]?.values ?? []}
							>
								{#snippet Empty()}
									<p data-text="muted">
										No notes yet.
									</p>
								{/snippet}

								{#snippet Item({ item })}
									<ActivityPubNoteView
										selector={{
											instanceOrigin: item[EntityMetaKey.Selector].instanceOrigin,
											localStatusId: item[EntityMetaKey.Selector].localStatusId,
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
			{:else}
				<p data-text="muted">
					Facet idle—no timeline request.
				</p>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
