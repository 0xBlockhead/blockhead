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
		collapsible = true,
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
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const note = useEntity(
		EntityType.ActivityPubNote,
		entityId,
		{
			$: [Source.Mastodon_Rest],
			content: {},
			createdAt: {},
			...(open ?
				{
					$author: {},
					$inReplyTo: {},
				}
			:
				{}),
		},
	)


	// Components
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.uri}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={note}
			placeholderText="Loading note…"
		>
			{#snippet children(note)}
				{@const mastodonPlainBody = (
					note.content == null ?
						''
					:
						htmlToPlainText(note.content)
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
		<ResourceBoundary
			resource={note}
			placeholderText=""
		>
			{#snippet children(note)}
				{#if note.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={note.createdAt}
							format={TimestampFormat.Both}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<dl data-column-item="center">
			{#if open}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
								{#if note.$author}
									<a
										href={resolve(
											'/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]',
											{
												instanceOrigin: encodeURIComponent(note.$author[EntityMetaKey.Id].instanceOrigin),
												localAccountId: encodeURIComponent(note.$author[EntityMetaKey.Id].localAccountId),
											},
										)}
									>Open actor</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>In reply to</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
								{#if note.$inReplyTo}
									<a
										href={resolve(
											'/(social)/activitypub/note/[instanceOrigin]/[localStatusId]',
											{
												instanceOrigin: encodeURIComponent(note.$inReplyTo[EntityMetaKey.Id].instanceOrigin),
												localStatusId: encodeURIComponent(note.$inReplyTo[EntityMetaKey.Id].localStatusId),
											},
										)}
									>Open parent status</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Plain text body</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
								{#if note.content != null}
									{@const mastodonPlainBodyText = htmlToPlainText(note.content)}
									{#if mastodonPlainBodyText !== ''}
										{mastodonPlainBodyText}
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				{#if entityId.instanceOrigin}
					<div>
						<dt>Origin instance</dt>
						<dd data-text="mono muted">{entityId.instanceOrigin}</dd>
					</div>
				{/if}
			{/if}

		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="activitypub-note-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-note`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
				}}
			>
				{#snippet Summary({ open: _conversationSummaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Status & conversation
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Metadata"
						href={`#${idKey}:note-details`}
					>Metadata</a>
					<a
						data-scroll-marker-label="Thread"
						href={`#${idKey}:note-thread`}
					>Thread</a>
				{/snippet}

				{#snippet body(_threadChildrenContext)}
					<section
						data-scroll-marker-label="Metadata"
						id={`${idKey}:note-details`}
					>
						<EntityDetails
							entityType={EntityType.ActivityPubNote}
							{entityId}
						/>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
								{@const mastodonThreadMetadataUnset = (
									htmlToPlainText(note.content ?? '').trim() === ''
									&& note.createdAt == null
								)}
								{#if mastodonThreadMetadataUnset}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No body or timestamp yet.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Plain text and created time fill in when the status is fetched from the origin instance.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="Status metadata"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
					<section
						data-scroll-marker-label="Thread"
						id={`${idKey}:note-thread`}
					>
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
							id={`${idKey}:note-thread-list`}
							fieldOpen={_open}
							orderByCreatedAt="asc"
							placeholderText="Loading conversation…"
							title="Thread"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

<style>
	.activitypub-note-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
