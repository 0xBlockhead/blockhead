<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ActivityPubNote> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	let revealedContentWarningSelectorKey = $state<string>()
	const contentWarningSelectorKey = $derived(stringify(selection.entitySelector))
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
	}))
	const activityPubNote = $derived(viewSelection({
		fields: {
			content: true,
			createdAt: true,
			statusUrl: true,
			activityStreamsUri: true,
			sensitive: true,
			spoilerText: true,
			localStatusId: true,
		},
	}))
	const titleFallback = $derived((
		pendingEntity.sensitive === true || (pendingEntity.spoilerText ?? '').trim() !== '' ?
			[(pendingEntity.spoilerText ?? '').trim() || 'Sensitive content', (pendingEntity.activityStreamsUri ?? '')].filter(Boolean).join(' ')
		:
			[prefetched.content == null ? '' : htmlToPlainText(prefetched.content), (prefetched.localStatusId ?? '')].filter(Boolean).join(' ') || 'ActivityPub note'
	))
	const viewDomId = $derived('activity-pub-note-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import ActivityPubNote_TimestampsView from '$/views/ActivityPubNote_TimestampsView.svelte'
	import MediaListView from '$/views/MediaListView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'instanceOrigin' in selection.entitySelector
				&& 'localStatusId' in selection.entitySelector ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
							localStatusId: selection.entitySelector.localStatusId,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet children(entity)}
				{
					entity.sensitive === true || (entity.spoilerText ?? '').trim() !== '' ?
							[(entity.spoilerText ?? '').trim() || 'Sensitive content', (pendingEntity.activityStreamsUri ?? '')].filter(Boolean).join(' ')
						:
							[entity.content == null ? '' : htmlToPlainText(entity.content), entity.localStatusId].filter(Boolean).join(' ') || title || titleFallback
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet children(entity)}
				{
					entity.sensitive === true || (entity.spoilerText ?? '').trim() !== '' ?
							[(entity.spoilerText ?? '').trim() || 'Sensitive content', (pendingEntity.activityStreamsUri ?? '')].filter(Boolean).join(' ')
						:
							[String(entity.createdAt ?? ''), entity.localStatusId].filter(Boolean).join(' ') || [entity.content == null ? '' : htmlToPlainText(entity.content), entity.localStatusId].filter(Boolean).join(' ') || titleFallback
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet ContentWarningContent(content)}
		{#if content != null && content !== ''}
			<Markdown content={htmlToPlainText(content)} mode="syndication" />
		{/if}

		<CollapsibleTabs
			id={viewDomId + '-carousel-activitypub-note-thread-sensitive-media'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'activitypub-note-media-sensitive-media',
						label: 'Media',
					},
				]
			}
			data-card
			class='network-view-collapsible-thread'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Thread and media</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivitypubNoteMediaSensitiveMedia({ id, label, open })}
				<MediaListView
					selection={selection.$$media}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No ActivityPub note media.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(activityPubActor)}
					{#if activityPubActor != null}
						<div>
							<dt>Author</dt>
							<dd>
								<ActivityPubActorView
									selection={select(EntityType.ActivityPubActor, activityPubActor[EntityMetaKey.Selector])}
									prefetched={activityPubActor}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubNote}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubNote}
			>
				{#snippet children(entity)}
					{@const statusUrl = entity.statusUrl}
					{#if statusUrl != null}
						<div>
							<dt>Status URL</dt>
							<dd>
								<a
									href={statusUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={statusUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ActivityStreams URI</dt>
				<dd>
					<ResourceBoundary
						resource={activityPubNote}
					>
						{#snippet children(entity)}
							<a
								href={entity.activityStreamsUri}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.activityStreamsUri} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						content: true,
						sensitive: true,
						spoilerText: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const content = entity.content}
				{@const contentWarningText = (entity.spoilerText ?? '').trim()}
				{#if entity.sensitive === true || contentWarningText !== ''}
					<Collapsible
						open={revealedContentWarningSelectorKey === contentWarningSelectorKey}
						ontoggle={(event) => {
							revealedContentWarningSelectorKey = event.currentTarget.open ? contentWarningSelectorKey : undefined
						}}
					>
						{#snippet Summary()}
							<header data-row="align-center gap-3 wrap">
								<strong>{contentWarningText || 'Sensitive content'}</strong>
								<span data-text="annotation">Show content</span>
							</header>
						{/snippet}

						{#if revealedContentWarningSelectorKey === contentWarningSelectorKey}
							{@render ContentWarningContent(content)}
						{/if}
					</Collapsible>
				{:else}
					{@render ContentWarningContent(content)}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-activitypub-note-thread'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'activitypub-note-thread-notes',
						label: 'Thread',
					},
				]
			}
			data-card
			class='network-view-collapsible-thread'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Thread and media</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivitypubNoteThreadNotes({ id, label, open })}
				<ActivityPubNotesView
					selection={selection.$$thread}
					href={
						selection.entitySelector.instanceOrigin != null && selection.entitySelector.localStatusId != null ? resolve(
							'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread',
							{
								instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
								localStatusId: selection.entitySelector.localStatusId,
							}
						) : undefined
					}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No ActivityPub thread notes.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-activitypub-note-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'activitypub-note-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivitypubNoteTimestamps({ id, label, open })}
				<ActivityPubNote_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No ActivityPub note observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
