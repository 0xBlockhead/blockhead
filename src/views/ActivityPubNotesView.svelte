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
	import { resolve } from '$app/paths'
	import { proxy } from '$/routes/+layout.svelte'
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
		sources = [
			Source.Mastodon_Rest,
			Source.Fedi_Rest,
		],
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
		sources?: readonly Source[]
	} = $props()


	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<ResourceBoundary
				resource={proxy(
						entityFieldReference.entityType,
						entityFieldReference.selector
					).field(entityFieldReference.fieldName, {
						sources,
						orderBy: [
							[
								({ fieldRow }) => fieldRow.localStatusId,
								orderByCreatedAt,
							],
						] as const,
						limit,
					})}
				placeholderText={placeholderText}
			>
				{#snippet children(notes)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.ActivityPubNote}
						id={`${id}-items`}
						{title}
						open={true}
						getKey={(activityPubNote) => stringify(activityPubNote.entitySelector)}
						placeholderText={placeholderText}
						items={notes.entities}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No notes yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={'localStatusId' in item.entitySelector ?
									resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
										instanceOrigin: encodeURIComponent(item.entitySelector.instanceOrigin),
										localStatusId: item.entitySelector.localStatusId,
									})
								:
									item.entitySelector.activityStreamsUri}
							>
								<TruncatedValue
									value={'localStatusId' in item.entitySelector ?
										`${item.entitySelector.instanceOrigin}/${item.entitySelector.localStatusId}`
									:
										item.entitySelector.activityStreamsUri}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
			{:else}
				<p data-text="muted">
					Facet idle—no timeline request.
				</p>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
