<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { mastodonVisibilityByVisibility } from '$/constants/Social/MastodonVisibility.ts'
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
					$$timestamps: {
						$: [
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						],
						$limit: 1,
					},
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
	import ActivityPubNote_TimestampsView from '$/views/ActivityPubNote_TimestampsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
											entityId={note.$author[EntityMetaKey.Id]}
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
									<svelte:self
										entityId={note.$inReplyTo[EntityMetaKey.Id]}
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
							note.$reblogOf[EntityMetaKey.Id].instanceOrigin !== entityId.instanceOrigin
							|| note.$reblogOf[EntityMetaKey.Id].localStatusId !== entityId.localStatusId
						)}
							<div>
								<dt>Reblog of</dt>
								<dd>
									<svelte:self
										entityId={note.$reblogOf[EntityMetaKey.Id]}
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
						{:else if note.content != null || (note.$$media?.length ?? 0) > 0}
							{#if (note.$$media?.length ?? 0) > 0}
								<div>
									<dt>Media</dt>
									<dd>
										<div data-column="gap-3">
											{#each note.$$media ?? [] as media (media[EntityMetaKey.Id].url)}
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
									value: note.$$timestamps[0]?.favouriteCount ?? note.favouriteCount,
								},
								{
									label: 'Reblogs',
									value: note.$$timestamps[0]?.reblogCount ?? note.reblogCount,
								},
								{
									label: 'Replies',
									value: note.$$timestamps[0]?.replyCount ?? note.replyCount,
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
						entityFieldReference={{
							entityType: EntityType.ActivityPubNote,
							entityId,
							fieldName: '$$thread',
						}}
						id={`${idKey}:note-thread-activityPubNotes`}
						fieldOpen={_open}
						orderByCreatedAt="asc"
						placeholderText="Loading conversation…"
						title="Thread"
						/>
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<ActivityPubNote_TimestampsView
							entityFieldReference={{
								entityType: EntityType.ActivityPubNote,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`${idKey}:metric-snapshots`}
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
