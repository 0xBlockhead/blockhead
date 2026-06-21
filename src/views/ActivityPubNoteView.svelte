<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { fediInstanceBySlug } from '$/constants/Fedi.ts'
	import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'
	import { mastodonVisibilityByVisibility } from '$/constants/Social/MastodonVisibility.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = 'localStatusId' in selection.entitySelector ?
			resolve(
				'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
				{
					instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
					localStatusId: selection.entitySelector.localStatusId,
				},
			)
		:
			undefined,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	import { htmlToPlainText } from '$/lib/html.ts'
	import { select } from '$/routes/+layout.svelte'

	const idKey = $derived(stringify(selection.entitySelector))

	const sources = $derived(
		'instanceOrigin' in selection.entitySelector && selection.entitySelector.instanceOrigin === mastodonInstanceByKey.mastodon_social.origin ?
			[Source.Mastodon_Rest]
		: 'instanceOrigin' in selection.entitySelector && selection.entitySelector.instanceOrigin === fediInstanceBySlug.fosstodon.origin ?
			[Source.Fedi_Rest]
		:
			[]
	)

	let contentWarningRevealed = $state(false)

	$effect(() => {
		void idKey
		contentWarningRevealed = false
	})

	const note = $derived(
		selection(({
				sources,
				fields: {
					content: true,
					createdAt: true,
					sensitive: true,
					spoilerText: true,
					...(open && {
						$author: true,
						$inReplyTo: true,
						$reblogOf: true,
						$$timestamps: {
							sources,
							limit: 1,
						},
						visibility: true,
						language: true,
						statusUrl: true,
						editedAt: true,
						activityStreamsUri: true,
						$$media: true,
					}),
				},
			}),
		)
	)


	// Components
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
	import ActivityPubNote_TimestampsView from '$/views/ActivityPubNote_TimestampsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={'localStatusId' in selection.entitySelector ? selection.entitySelector.localStatusId : selection.entitySelector.activityStreamsUri}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={note}
			placeholderText="Loading note…"
		>
			{#snippet children(note)}
				{@const hasContentWarning = (
					(note.spoilerText?.trim().length ?? 0) > 0
					|| note.sensitive === true
				)}
				{@const mastodonPlainBody = (
					hasContentWarning && !contentWarningRevealed ?
						(note.spoilerText?.trim() || 'Sensitive content')
					: note.content == null ?
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
						value={'localStatusId' in selection.entitySelector ? selection.entitySelector.localStatusId : selection.entitySelector.activityStreamsUri}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={note}
		>
			{#snippet children(note)}
				{#if note.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={note.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A federated ActivityPub Note (Mastodon Status) keyed by instance origin + local status id—not the Activity Streams object URI.
		</p>
		<p>
			Body HTML, counts, and thread context resolve from the configured instance REST API; boosts unwrap the reblogged status for display.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		{#if contentOpen}
			<ResourceBoundary
				resource={note}
				placeholderText="Loading note…"
			>
				{#snippet children(note)}
					{@const hasContentWarning = (
						(note.spoilerText?.trim().length ?? 0) > 0
						|| note.sensitive === true
					)}
					{#if !hasContentWarning || contentWarningRevealed}
						{#if note.content != null}
							<p>
								<TruncatedValue
									value={htmlToPlainText(note.content)}
									format={TruncatedValueFormat.Visual}
								/>
							</p>
						{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}

		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<ResourceBoundary
						resource={note}
						placeholderText="Loading note…"
					>
						{#snippet children(note)}
							{#if note.$author}
								<div>
									<dt>{note.$reblogOf ? 'Boosted by' : 'Author'}</dt>
									<dd>
											<ActivityPubActorView
												selection={select(EntityType.ActivityPubActor, note.$author[EntityMetaKey.Selector])}
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
					{#snippet children(note)}
						{#if note.$inReplyTo}
							<div>
								<dt>In reply to</dt>
								<dd>
										<ActivityPubNoteView
											selection={select(EntityType.ActivityPubNote, note.$inReplyTo[EntityMetaKey.Selector])}
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
					{#snippet children(note)}
						{#if note.$reblogOf && (
							!('localStatusId' in selection.entitySelector)
							|| (
								'localStatusId' in selection.entitySelector
								&& 'localStatusId' in note.$reblogOf[EntityMetaKey.Selector]
								&& (
									note.$reblogOf[EntityMetaKey.Selector].instanceOrigin !== selection.entitySelector.instanceOrigin
									|| note.$reblogOf[EntityMetaKey.Selector].localStatusId !== selection.entitySelector.localStatusId
								)
							)
						)}
							<div>
								<dt>Reblog of</dt>
								<dd>
										<ActivityPubNoteView
											selection={select(EntityType.ActivityPubNote, note.$reblogOf[EntityMetaKey.Selector])}
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
					{#snippet children(note)}
						{@const hasContentWarning = (
							(note.spoilerText?.trim().length ?? 0) > 0
							|| note.sensitive === true
						)}
						{#if hasContentWarning && !contentWarningRevealed}
							<div>
								<dt>Content warning</dt>
								<dd>
									<div
										class="activitypub-content-warning"
										data-column="gap-2"
									>
										<p>{note.spoilerText?.trim() || 'Sensitive content'}</p>
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
									{#if note.$$media !== undefined && note.$$media.values.length > 0}
										<div>
										<dt>Media</dt>
										<dd>
											<div data-column="gap-3">
											{#each note.$$media.values as media (media[EntityMetaKey.Selector].url)}
												<Media
													alt=""
													media={{ url: media[EntityMetaKey.Selector].url }}
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
					{#snippet children(note)}
						{#if note.visibility}
							<div>
								<dt>Visibility</dt>
								<dd>
									{mastodonVisibilityByVisibility[note.visibility]?.label ?? note.visibility}
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
					{#snippet children(note)}
						{#if note.sensitive != null}
							<div>
								<dt>Sensitive</dt>
								<dd>
									{note.sensitive ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}

						{#if note.language}
							<div>
								<dt>Language</dt>
								<dd>{note.language}</dd>
							</div>
						{/if}

						{#if note.editedAt != null}
							<div>
								<dt>Edited</dt>
								<dd>
									<Timestamp
										timestamp={note.editedAt}
									/>
								</dd>
							</div>
						{/if}

						{#if note.activityStreamsUri}
							<div>
								<dt>Activity Streams URI</dt>
								<dd>
									<a
										href={note.activityStreamsUri}
										rel="noreferrer"
										target="_blank"
									>{note.activityStreamsUri}</a>
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
					{#snippet children(note)}
						<SocialMetricSnapshotRows
							metrics={[
									{
										label: 'Favourites',
										value: note.$$timestamps?.values.at(0)?.favouriteCount,
									},
									{
										label: 'Reblogs',
										value: note.$$timestamps?.values.at(0)?.reblogCount,
									},
									{
										label: 'Replies',
										value: note.$$timestamps?.values.at(0)?.replyCount,
									},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(note)}
						{#if note.statusUrl}
							<div>
								<dt>Status URL</dt>
								<dd>
									<a
										href={note.statusUrl}
										rel="noreferrer"
										target="_blank"
									>{note.statusUrl}</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${idKey}:carousel-note`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'note-details', label: 'Metadata' },
				{ id: 'note-thread', label: 'Thread' },
				{ id: 'metric-snapshots', label: 'Metrics' },
			])}
			data-card
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

			{#snippet SectionNoteDetails()}
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
			{/snippet}

			{#snippet SectionNoteThread()}
				<ActivityPubNotesView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$thread}
					id={`${idKey}:note-thread-activityPubNotes`}
					fieldOpen={_open}
					orderByCreatedAt="asc"
					placeholderText="Loading conversation…"
					{sources}
					title="Thread"
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<ActivityPubNote_TimestampsView
					selection={selection.$$timestamps}
					href={href ?? ''}
					id={`${idKey}:metric-snapshots`}
					{sources}
					title="Metric snapshots"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>


<style>
	.activitypub-content-warning {
		padding: 0.75em 1em;
		border-radius: var(--card-radius, 0.5em);
		background: var(--surface-muted, rgba(127, 127, 127, 0.12));
	}
</style>
