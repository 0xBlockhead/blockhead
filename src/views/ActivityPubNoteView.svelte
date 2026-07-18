<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ActivityPubNote>>
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
	const activityPubNote = $derived(selection({
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
	const viewDomId = $derived('activity-pub-note-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.instanceOrigin !== undefined && pendingEntity.localStatusId !== undefined ? resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', {
			instanceOrigin: encodeURIComponent(String(pendingEntity.instanceOrigin ?? '')),
			localStatusId: String(pendingEntity.localStatusId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{(pendingEntity.sensitive === true || String(pendingEntity.spoilerText ?? '').trim() !== '' ? [String(pendingEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((pendingEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [pendingEntity.content == null ? '' : String((htmlToPlainText((pendingEntity.content))) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
		{:else}
			<ResourceBoundary resource={activityPubNote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{(resolvedEntity.sensitive === true || String(resolvedEntity.spoilerText ?? '').trim() !== '' ? [String(resolvedEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((resolvedEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [resolvedEntity.content == null ? '' : String((htmlToPlainText((resolvedEntity.content))) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{(pendingEntity.sensitive === true || String(pendingEntity.spoilerText ?? '').trim() !== '' ? [String(pendingEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((pendingEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((pendingEntity.createdAt) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || [pendingEntity.content == null ? '' : String((htmlToPlainText((pendingEntity.content))) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || titleFallback)}
		{:else}
			<ResourceBoundary resource={activityPubNote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{(resolvedEntity.sensitive === true || String(resolvedEntity.spoilerText ?? '').trim() !== '' ? [String(resolvedEntity.spoilerText ?? '').trim() || 'Sensitive content', [String((resolvedEntity.activityStreamsUri) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.createdAt) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || [resolvedEntity.content == null ? '' : String((htmlToPlainText((resolvedEntity.content))) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || titleFallback)}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					emptyText='No ActivityPub note media.'
					open={open}
					title={label}
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
					{#if activityPubActor != null && activityPubActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Author</dt>
							<dd>
								<ActivityPubActorView
									selection={select(EntityType.ActivityPubActor, activityPubActor[EntityMetaKey.Selector])}
									prefetched={activityPubActor}
									href={
										(activityPubActor[EntityMetaKey.Selector].instanceOrigin !== undefined && activityPubActor[EntityMetaKey.Selector].localAccountId !== undefined ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
											instanceOrigin: encodeURIComponent(String(activityPubActor[EntityMetaKey.Selector].instanceOrigin ?? '')),
											localAccountId: String(activityPubActor[EntityMetaKey.Selector].localAccountId ?? ''),
										}) : undefined)
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
						{@render ContentWarningContent(content)}
					</Collapsible>
				{:else}
					{@render ContentWarningContent(content)}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
							(selection.entitySelector.instanceOrigin !== undefined && selection.entitySelector.localStatusId !== undefined ? resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/thread', {
								instanceOrigin: encodeURIComponent(String(selection.entitySelector.instanceOrigin ?? '')),
								localStatusId: selection.entitySelector.localStatusId,
							}) : undefined)
						}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No ActivityPub thread notes.'
						open={open}
						title={label}
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
						emptyText='No ActivityPub note observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
