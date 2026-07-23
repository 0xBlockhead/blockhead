<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { htmlToPlainText } from '$/lib/html.ts'


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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubNote>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ActivityPubNote>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	let revealedContentWarningSelectorKey = $state<string>()
	const contentWarningSelectorKey = $derived(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector]))
	const activityPubNote = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			content: true,
			createdAt: true,
			sensitive: true,
			spoilerText: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			content: true,
			createdAt: true,
			statusUrl: true,
			sensitive: true,
			spoilerText: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.sensitive === true || String(pendingEntity.spoilerText ?? '').trim() !== '' ? [String(pendingEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((pendingEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [pendingEntity.content == null ? '' : String((htmlToPlainText((pendingEntity.content))) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note'))
	const viewDomId = $derived('activity-pub-note-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'instanceOrigin' in selection.entitySelector
			&& selection.entitySelector.instanceOrigin != null
			&& selection.entitySelector != null && 'localStatusId' in selection.entitySelector
			&& selection.entitySelector.localStatusId != null ?
				resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', {
			instanceOrigin: encodeURIComponent(String(selection.entitySelector.instanceOrigin ?? '')),
			localStatusId: String(selection.entitySelector.localStatusId ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{(resolvedEntity.sensitive === true || String(resolvedEntity.spoilerText ?? '').trim() !== '' ? [String(resolvedEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((resolvedEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [resolvedEntity.content == null ? '' : String((htmlToPlainText((resolvedEntity.content))) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{(resolvedEntity.sensitive === true || String(resolvedEntity.spoilerText ?? '').trim() !== '' ? [String(resolvedEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((resolvedEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.createdAt) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || [resolvedEntity.content == null ? '' : String((htmlToPlainText((resolvedEntity.content))) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || titleFallback)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet ContentWarningContent(content)}
		{#if content !== undefined && content !== null && content !== ''}
			<Markdown content={String(content)} mode="syndication" />
		{/if}

		<CollapsibleTabs
			id={viewDomId + '-carousel-activitypub-note-thread-sensitive-media'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'activitypub-note-media-sensitive-media',
						label: 'Media',
						ownsSection: true,
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

			{#snippet MarkerActivitypubNoteMediaSensitiveMedia(_context, Content)}
				{@const activitypubNoteThreadSensitiveMediaActivitypubNoteMediaSensitiveMediaResource = selection.$$media}
				<ResourceBoundary
					resource={activitypubNoteThreadSensitiveMediaActivitypubNoteMediaSensitiveMediaResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionActivitypubNoteMediaSensitiveMedia({ id, label, open, active })}
				{@const activitypubNoteThreadSensitiveMediaActivitypubNoteMediaSensitiveMediaResource = selection.$$media}
				<ResourceBoundary
					resource={activitypubNoteThreadSensitiveMediaActivitypubNoteMediaSensitiveMediaResource}
				>
					{#snippet children(media)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<MediaListView
								selection={activitypubNoteThreadSensitiveMediaActivitypubNoteMediaSensitiveMediaResource}
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
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet children(activityPubActor)}
					{#if activityPubActor != null && activityPubActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<ActivityPubActorView
									selection={select(EntityType.ActivityPubActor, activityPubActor[EntityMetaKey.Selector])}
									prefetched={activityPubActor}
									href={
										(
											activityPubActor[EntityMetaKey.Selector] != null && 'instanceOrigin' in activityPubActor[EntityMetaKey.Selector]
											&& activityPubActor[EntityMetaKey.Selector].instanceOrigin != null
											&& activityPubActor[EntityMetaKey.Selector] != null && 'localAccountId' in activityPubActor[EntityMetaKey.Selector]
											&& activityPubActor[EntityMetaKey.Selector].localAccountId != null ?
												resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
											instanceOrigin: encodeURIComponent(String(activityPubActor[EntityMetaKey.Selector].instanceOrigin ?? '')),
											localAccountId: String(activityPubActor[EntityMetaKey.Selector].localAccountId ?? ''),
										})
										:
												undefined
										)
									}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							statusUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statusUrl = resolvedEntity.statusUrl}
					{#if statusUrl !== undefined && statusUrl !== null}
						<div>
							<dt>Status URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(statusUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(statusUrl)} />
								</svelte:element>
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
						resource={
							selection({
								sources: selection.sources,
								fields: {
									activityStreamsUri: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const activityStreamsUri = resolvedEntity.activityStreamsUri}
							{#if activityStreamsUri !== undefined && activityStreamsUri !== null}
								<svelte:element
									this={'a'}
									href={String(activityStreamsUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(activityStreamsUri)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						content: true,
						sensitive: true,
						spoilerText: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{@const contentWarningText = String(resolvedEntity.spoilerText ?? '').trim()}
				{@const hasContentWarning = resolvedEntity.sensitive === true || String(resolvedEntity.spoilerText ?? '').trim() !== ''}
				{#if hasContentWarning}
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
						ownsSection: true,
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

			{#snippet MarkerActivitypubNoteThreadNotes(_context, Content)}
				{@const activitypubNoteThreadNotesResource = selection.$$thread}
				<ResourceBoundary
					resource={activitypubNoteThreadNotesResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionActivitypubNoteThreadNotes({ id, label, open, active })}
				{@const activitypubNoteThreadNotesResource = selection.$$thread}
				<ResourceBoundary
					resource={activitypubNoteThreadNotesResource}
				>
					{#snippet children(activityPubNote)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<ActivityPubNotesView
								selection={activitypubNoteThreadNotesResource}
								href={
									(selection.entitySelector != null && 'instanceOrigin' in selection.entitySelector && selection.entitySelector.instanceOrigin != null && selection.entitySelector != null && 'localStatusId' in selection.entitySelector && selection.entitySelector.localStatusId != null ? resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/thread', {
										instanceOrigin: encodeURIComponent(String(selection.entitySelector.instanceOrigin ?? '')),
										localStatusId: String(selection.entitySelector.localStatusId ?? ''),
									}) : undefined)
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
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
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

			{#snippet MarkerActivitypubNoteTimestamps(_context, Content)}
				{@const activitypubNoteObservationsActivitypubNoteTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={activitypubNoteObservationsActivitypubNoteTimestampsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionActivitypubNoteTimestamps({ id, label, open, active })}
				{@const activitypubNoteObservationsActivitypubNoteTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={activitypubNoteObservationsActivitypubNoteTimestampsResource}
				>
					{#snippet children(activityPubNoteTimestamp)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<ActivityPubNote_TimestampsView
								selection={activitypubNoteObservationsActivitypubNoteTimestampsResource}
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
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
