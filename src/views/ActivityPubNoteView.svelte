<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

	import { htmlToPlainText } from '$/lib/html.ts'
	import { isEntityReferenceWithId } from '$/lib/isEntityReferenceWithId.ts'


	// Props
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubNote>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityId'
			| 'entityType'
			| 'Heading'
			| 'HeadingAfter'
			| 'Icon'
			| 'href'
			| 'open'
			| 'title'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const noteQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.ActivityPubNote] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const summaryFields = $derived.by((): Record<string, JsonValue> | null => {
		const r = noteQuery.data
			?.find((e) => e.row[EntityMetaKey.Source] === Source.Mastodon_Rest)
			?.row
			?? noteQuery.data?.[0]?.row
		const bagUnknown = r?.[EntityMetaKey.Fields]
		return (typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown)) ? bagUnknown : null
	})

	const contentPlain = $derived(
		summaryFields != null
		&& typeof summaryFields['content'] === 'string'
		&& summaryFields['content'].length > 0 ?
			htmlToPlainText(summaryFields['content'])
		:
			'',
	)

	const summaryTitle = $derived(
		contentPlain.length > 0 ?
			contentPlain
		:
			entityId.localStatusId
	)

	const authorId = $derived((() => {
		const ref = summaryFields?.['$author']
		return isEntityReferenceWithId<EntityType.ActivityPubActor>(ref) ?
				ref[EntityMetaKey.Id]
			:	undefined
	})())

	const inReplyToId = $derived((() => {
		const ref = summaryFields?.['$inReplyTo']
		return isEntityReferenceWithId<EntityType.ActivityPubNote>(ref) ?
				ref[EntityMetaKey.Id]
			:	undefined
	})())


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	{entityId}
	{href}
	{layout}
	{open}
	{...entityViewRest}
	title={summaryTitle}
>
	{#if contentPlain}
		{#snippet Heading()}
			<HeadingComponent>
				{#if href}
					<a href={href}>
						<TruncatedValue
							endLength={16}
							format={TruncatedValueFormat.Visual}
							startLength={64}
							value={contentPlain}
						/>
					</a>
				{:else}
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={64}
						value={contentPlain}
					/>
				{/if}
			</HeadingComponent>
		{/snippet}
	{/if}
	{#snippet HeadingAfter()}
		{@const t = (summaryFields != null && typeof summaryFields['createdAt'] === 'number' && Number.isFinite(summaryFields['createdAt']) ? summaryFields['createdAt'] : null)}
		{#if t != null}
			<span data-text="muted">
				<Timestamp
					timestamp={t}
					format={TimestampFormat.Both}
				/>
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		<div data-column>
			{#if contentPlain}
				<p data-text="muted">
					{contentPlain}
				</p>
			{/if}
			{#if authorId}
				<p data-text="muted">
					<a
						href={resolve(
							'/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]',
							{
								instanceOrigin: encodeURIComponent(authorId.instanceOrigin),
								localAccountId: encodeURIComponent(authorId.localAccountId),
							},
						)}
					>Author</a>
				</p>
			{/if}
			{#if inReplyToId}
				<p data-text="muted">
					<a
						href={resolve(
							'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
							{
								instanceOrigin: encodeURIComponent(inReplyToId.instanceOrigin),
								localStatusId: encodeURIComponent(inReplyToId.localStatusId),
							},
						)}
					>In reply to</a>
				</p>
			{/if}
			<div data-text="mono muted">
				{entityId.instanceOrigin}
				 · 
				{entityId.localStatusId}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ActivityPubNote}
			{entityId}
		>
			<QueryBoundary
				query={noteQuery}
			>
				{#snippet children(mastoRestNoteResultRows)}
					{@const detailFields = (() => {
						const r = mastoRestNoteResultRows
							?.find((e) => e.row[EntityMetaKey.Source] === Source.Mastodon_Rest)
							?.row
							?? mastoRestNoteResultRows?.[0]?.row
						const b = r?.[EntityMetaKey.Fields]
						if (!(typeof b === 'object' && b !== null && !Array.isArray(b))) {
							return null
						}
						return b
					})()}
					{#if detailFields == null}
						<p data-text="muted">
							No status data in the app for this id yet. Try again shortly, or check that the Mastodon instance
							API can be reached.
						</p>
					{:else}
						<dl>
							{#if typeof detailFields['content'] === 'string' && detailFields['content']}
								<div>
									<dt>Content</dt>
									<dd>
										{htmlToPlainText(detailFields['content'])}
									</dd>
								</div>
							{/if}
							{#if typeof detailFields['createdAt'] === 'number' && Number.isFinite(detailFields['createdAt'])}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={detailFields['createdAt']}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<ActivityPubMastodonFieldNotes
			entityFieldReference={{
				entityType: EntityType.ActivityPubNote,
				entityId,
				fieldName: '$$thread',
			}}
			href={resolve('/(social)/activitypub/note/[instanceOrigin]/[localStatusId]/(note)/thread', {
				instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
				localStatusId: encodeURIComponent(entityId.localStatusId),
			})}
			id="activitypub-note-thread"
			orderByCreatedAt="asc"
			placeholderText="Loading thread…"
			title="Thread"
		/>
	{/snippet}
</EntityView>
