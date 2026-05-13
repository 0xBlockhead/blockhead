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
	import HeadingComponent from '$/components/Heading.svelte'
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
	{#snippet Heading()}
		<ResourceBoundary
			resource={note}
			placeholderText="Loading status…"
		>
			{#snippet children(u)}
				{#if u.content != null && u.content !== ''}
					{@const headingPlain = htmlToPlainText(u.content)}
					<HeadingComponent>
						{#if href}
							<a href={href}>
								<TruncatedValue
									endLength={16}
									format={TruncatedValueFormat.Visual}
									startLength={64}
									value={headingPlain}
								/>
							</a>
						{:else}
							<TruncatedValue
								endLength={16}
								format={TruncatedValueFormat.Visual}
								startLength={64}
								value={headingPlain}
							/>
						{/if}
					</HeadingComponent>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={note}>
			{#snippet Pending()}{/snippet}
			{#snippet children(u)}
				{#if u.createdAt != null && Number.isFinite(u.createdAt)}
					<span data-text="muted">
						<Timestamp
							timestamp={u.createdAt}
							format={TimestampFormat.Both}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column>
			<ResourceBoundary
				resource={note}
				placeholderText="Loading status…"
			>
				{#snippet children(u)}
					{#if u.content != null && u.content !== ''}
						<p data-text="muted">
							{htmlToPlainText(u.content)}
						</p>
					{/if}
					{#if u.$author}
						<p data-text="muted">
							<a
								href={resolve(
									'/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]',
									{
										instanceOrigin: encodeURIComponent(u.$author[EntityMetaKey.Id].instanceOrigin),
										localAccountId: encodeURIComponent(u.$author[EntityMetaKey.Id].localAccountId),
									},
								)}
							>Author</a>
						</p>
					{/if}
					{#if u.$inReplyTo}
						<p data-text="muted">
							<a
								href={resolve(
									'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
									{
										instanceOrigin: encodeURIComponent(u.$inReplyTo[EntityMetaKey.Id].instanceOrigin),
										localStatusId: encodeURIComponent(u.$inReplyTo[EntityMetaKey.Id].localStatusId),
									},
								)}
							>In reply to</a>
						</p>
					{/if}
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
				{#snippet children(u)}
					{#if (u.content == null || u.content === '') && (u.createdAt == null)}
						<p data-text="muted">
							Status details are not available yet for this note.
						</p>
					{:else}
						<dl>
							{#if u.content != null && u.content !== ''}
								<div>
									<dt>Content</dt>
									<dd>
										{htmlToPlainText(u.content)}
									</dd>
								</div>
							{/if}
							{#if u.createdAt != null && Number.isFinite(u.createdAt)}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={u.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						</dl>
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
