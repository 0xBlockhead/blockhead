<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { mastodonVisibilityLabels } from '$/constants/Social/MastodonVisibility.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
		'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
		{
			instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
			localStatusId: entityId.localStatusId,
		},
	),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubNote>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { htmlToPlainText } from '$/lib/html.ts'
	import { syndicationHtmlToSafeHtml } from '$/lib/markdown.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	let contentWarningRevealed = $state(false)

	$effect(() => {
		void idKey
		contentWarningRevealed = false
	})

	const note = useEntity(
		EntityType.ActivityPubNote,
		entityId,
		{
			$: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
			content: {},
			createdAt: {},
			sensitive: {},
			spoilerText: {},
			...(open ?
				{
					$author: {},
					$inReplyTo: {},
					$reblogOf: {},
					favouriteCount: {},
					reblogCount: {},
					replyCount: {},
					visibility: {},
					language: {},
					statusUrl: {},
					editedAt: {},
					activityStreamsUri: {},
					$$media: {},
				}
			:
				{}),
		},
	)


	// Components
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.localStatusId}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A federated ActivityPub Note (Mastodon Status) keyed by instance origin + local status id—not the Activity Streams object URI.
		</p>
		<p>
			Body HTML, counts, and thread context resolve from the configured instance REST API; boosts unwrap the reblogged status for display.
		</p>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={note}
			placeholderText="Loading note…"
		>
			{#snippet children(loadedNote)}
				{@const hasContentWarning = (
					(note.spoilerText?.trim().length ?? 0) > 0
					|| loadedNote.sensitive === true
				)}
				{@const mastodonPlainBody = (
					hasContentWarning && !contentWarningRevealed ?
						(note.spoilerText?.trim() || 'Sensitive content')
					: loadedNote.content == null ?
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
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={64}
						value={entityId.localStatusId}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={note}
		>
			{#snippet children(loadedNote)}
				{#if loadedNote.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={loadedNote.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<ResourceBoundary
						resource={note}
						placeholderText="Loading note…"
					>
						{#snippet children(loadedNote)}
							{#if loadedNote.$author}
								<div>
									<dt>{loadedNote.$reblogOf ? 'Boosted by' : 'Author'}</dt>
									<dd>
										<ActivityPubActorView
											entityId={loadedNote.$author[EntityMetaKey.Id]}
											layout={EntityLayout.Title}
											open={false}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(loadedNote)}
						{#if loadedNote.$inReplyTo}
							<div>
								<dt>In reply to</dt>
								<dd>
									<ActivityPubNoteView
										entityId={loadedNote.$inReplyTo[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(loadedNote)}
						{#if loadedNote.$reblogOf && (
							note.$reblogOf[EntityMetaKey.Id].instanceOrigin !== entityId.instanceOrigin
							|| loadedNote.$reblogOf[EntityMetaKey.Id].localStatusId !== entityId.localStatusId
						)}
							<div>
								<dt>Reblog of</dt>
								<dd>
									<ActivityPubNoteView
										entityId={loadedNote.$reblogOf[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(loadedNote)}
						{@const hasContentWarning = (
							(note.spoilerText?.trim().length ?? 0) > 0
							|| loadedNote.sensitive === true
						)}
						{#if hasContentWarning && !contentWarningRevealed}
							<div>
								<dt>Content warning</dt>
								<dd>
									<div
										class="activitypub-content-warning"
										data-column="gap-2"
									>
										<p>{loadedNote.spoilerText?.trim() || 'Sensitive content'}</p>
										<button
											type="button"
											onclick={() => {
												contentWarningRevealed = true
											}}
										>
											Show content
										</button>
									</div>
								</dd>
							</div>
						{:else if loadedNote.content != null || (note.$$media?.length ?? 0) > 0}
							{#if loadedNote.content != null}
								<div>
									<dt>Status body</dt>
									<dd>
										<div class="activitypub-html">
											{@html syndicationHtmlToSafeHtml(note.content)}
										</div>
									</dd>
								</div>
							{/if}

							{#if (note.$$media?.length ?? 0) > 0}
								<div>
									<dt>Media</dt>
									<dd>
										<div data-column="gap-3">
											{#each loadedNote.$$media ?? [] as media (media[EntityMetaKey.Id].url)}
												<Media
													alt=""
													media={{ url: media[EntityMetaKey.Id].url }}
												/>
											{/each}
										</div>
									</dd>
								</div>
							{/if}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(loadedNote)}
						{#if loadedNote.visibility}
							<div>
								<dt>Visibility</dt>
								<dd>
									{mastodonVisibilityLabels[loadedNote.visibility] ?? loadedNote.visibility}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(loadedNote)}
						{#if loadedNote.sensitive != null}
							<div>
								<dt>Sensitive</dt>
								<dd>
									{loadedNote.sensitive ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}

						{#if loadedNote.language}
							<div>
								<dt>Language</dt>
								<dd>{loadedNote.language}</dd>
							</div>
						{/if}

						{#if loadedNote.editedAt != null}
							<div>
								<dt>Edited</dt>
								<dd>
									<Timestamp
										timestamp={loadedNote.editedAt}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedNote.activityStreamsUri}
							<div>
								<dt>Activity Streams URI</dt>
								<dd>
									<a
										href={loadedNote.activityStreamsUri}
										rel="noreferrer"
										target="_blank"
									>{loadedNote.activityStreamsUri}</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Engagement</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(loadedNote)}
								{#if (
									note.favouriteCount != null || loadedNote.reblogCount != null || loadedNote.replyCount != null
									&& note.favouriteCount != null
								)}
									{String(note.favouriteCount)} favourites
								{/if}
								{#if (
									note.favouriteCount != null || loadedNote.reblogCount != null || loadedNote.replyCount != null
									&& note.reblogCount != null
								)}
									· {String(note.reblogCount)} reblogs
								{/if}
								{#if (
									note.favouriteCount != null || loadedNote.reblogCount != null || loadedNote.replyCount != null
									&& note.replyCount != null
								)}
									· {String(note.replyCount)} replies
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Web status</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(loadedNote)}
								{#if loadedNote.statusUrl}
									<a
										href={loadedNote.statusUrl}
										rel="noreferrer"
										target="_blank"
									>{loadedNote.statusUrl}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				contentOpen
				&& entityId.instanceOrigin
			)}
				<div>
					<dt>Origin instance</dt>
					<dd data-text="mono muted">{entityId.instanceOrigin}</dd>
				</div>
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
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'note-details', label: 'Metadata' },
					{ id: 'note-thread', label: 'Thread' },
				]}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
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

				{#snippet SectionNoteDetails({ id: _id, label: _label })}
					<EntityDetails
						entityType={EntityType.ActivityPubNote}
						{entityId}
					/>
					<ResourceBoundary
						resource={note}
						placeholderText="Loading note…"
					>
						{#snippet children(loadedNote)}
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
				{/snippet}

				{#snippet SectionNoteThread({ id: _id, label: _label })}
					<ActivityPubNotesView
						href={resolve('/activitypub/notes')}
						entityFieldReference={{
							entityType: EntityType.ActivityPubNote,
							entityId,
							fieldName: '$$thread',
						}}
						id={`${idKey}:note-thread-list`}
						fieldOpen={_open}
						orderByCreatedAt="asc"
						placeholderText="Loading conversation…"
						title="Thread"
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.activitypub-content-warning {
		padding: 0.75em 1em;
		border-radius: var(--card-radius, 0.5em);
		background: var(--surface-muted, rgba(127, 127, 127, 0.12));
	}

	.activitypub-html {
		:global(pre) {
			white-space: pre-wrap;
			word-break: break-word;
		}

		:global(img) {
			max-width: 100%;
			height: auto;
		}
	}
</style>

