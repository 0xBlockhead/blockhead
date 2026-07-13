<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubNote>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ActivityPubNote>>
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
	const activityPubNote = $derived(selection({
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			content: true,
			createdAt: true,
			$author: true,
			statusUrl: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.content) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub note')
	const viewDomId = $derived('activity-pub-note-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import MediaListView from '$/views/MediaListView.svelte'
	import ActivityPubNote_TimestampsView from '$/views/ActivityPubNote_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubNote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.instanceOrigin !== undefined && pendingEntity.localStatusId !== undefined ? resolve('/activitypub/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', {
			instanceOrigin: String(pendingEntity.instanceOrigin ?? ''),
			localStatusId: String(pendingEntity.localStatusId ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet Pending()}
				{[String((pendingEntity.content) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.content) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubNote}>
			{#snippet Pending()}
				{[String((pendingEntity.createdAt) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.content) ?? ''), String((pendingEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || title || 'ActivityPub note'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.createdAt) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.content) ?? ''), String((resolvedEntity.localStatusId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$author}
			>
				{#snippet Pending()}{/snippet}

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
											instanceOrigin: String(activityPubActor[EntityMetaKey.Selector].instanceOrigin ?? ''),
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
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = pendingEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							statusUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const statusUrl = pendingEntity.statusUrl}
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
								fields: {
									activityStreamsUri: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const activityStreamsUri = pendingEntity.activityStreamsUri}
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
					fields: {
						content: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{#if content !== undefined && content !== null && content !== ''}
					<p data-text="long-text">{String((content) ?? '')}</p>
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
						{
							id: 'activitypub-note-media',
							label: 'Media',
						},
					]
				}
				data-card
				class='network-view-collapsible-thread'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Thread and media</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionActivitypubNoteThreadNotes({ id, label, open })}
					<ActivityPubNotesView
						selection={selection.$$thread}
						href={resolve('/activitypub/notes')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub thread notes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionActivitypubNoteMedia({ id, label, open })}
					<MediaListView
						selection={selection.$$media}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No ActivityPub note media.'
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionActivitypubNoteTimestamps({ id, label, open })}
					<ActivityPubNote_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
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
