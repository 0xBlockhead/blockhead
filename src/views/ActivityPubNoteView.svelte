<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	import { htmlToPlainText } from '$/lib/html.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const note = useEntity(
		EntityType.ActivityPubNote,
		entityId,
		{
			$: [Source.Mastodon_Rest],
			content: {},
			createdAt: {},
			$author: {},
			$inReplyTo: {},
		},
	)


	// Components
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	{entityId}
	{href}
	{layout}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.uri}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={note}
			placeholderText="Loading status…"
		>
			{#snippet children(mastodonNoteRow)}
				{@const mastodonPlainBody = (
					mastodonNoteRow.content == null ?
						''
					:
						htmlToPlainText(mastodonNoteRow.content)
				)}
				{#if mastodonPlainBody !== ''}
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={64}
						value={mastodonPlainBody}
					/>
				{:else}
					{entityId.uri}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={note}>
			{#snippet children(mastodonNoteRow)}
				{#if mastodonNoteRow.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={mastodonNoteRow.createdAt}
							format={TimestampFormat.Both}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<div data-column>
			<ResourceBoundary
				resource={note}
				placeholderText="Loading status…"
			>
				{#snippet children(mastodonNoteRow)}
					{@const mastodonPlainBody = (
						mastodonNoteRow.content == null ?
							''
						:
							htmlToPlainText(mastodonNoteRow.content)
					)}
					{#if mastodonPlainBody !== ''}
						{#if !open}
							<p data-text="muted">
								{htmlToPlainText(mastodonNoteRow.content)}
							</p>
						{/if}
					{/if}
					{#if mastodonNoteRow.$author}
						<p data-text="muted">
							<a
								href={resolve(
									'/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]',
									{
										instanceOrigin: encodeURIComponent(mastodonNoteRow.$author[EntityMetaKey.Id].instanceOrigin),
										localAccountId: encodeURIComponent(mastodonNoteRow.$author[EntityMetaKey.Id].localAccountId),
									},
								)}
							>Author</a>
						</p>
					{/if}
					{#if mastodonNoteRow.$inReplyTo}
						<p data-text="muted">
							<a
								href={resolve(
									'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
									{
										instanceOrigin: encodeURIComponent(mastodonNoteRow.$inReplyTo[EntityMetaKey.Id].instanceOrigin),
										localStatusId: encodeURIComponent(mastodonNoteRow.$inReplyTo[EntityMetaKey.Id].localStatusId),
									},
								)}
							>In reply to</a>
						</p>
					{/if}
					<dl data-column-item="center">
						{#if mastodonPlainBody !== ''}
							<div>
								<dt>Object URI</dt>
								<dd data-text="mono">
									{@render Id()}
								</dd>
							</div>
						{/if}
						{#if open}
							{#if mastodonPlainBody !== ''}
								<div>
									<dt>Content</dt>
									<dd>
										{htmlToPlainText(mastodonNoteRow.content)}
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>

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
			<ResourceBoundary resource={note}>
				{#snippet children(mastodonNoteRow)}
					{#if htmlToPlainText(mastodonNoteRow.content ?? '').trim() === '' && mastodonNoteRow.createdAt == null}
						<p data-text="muted">
							Status details are not available yet for this note.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
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
