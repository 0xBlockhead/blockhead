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
			selection: RegisteredEntityProxyResource<EntityType.ActivityPubActor>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ActivityPubActor>
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
	const activityPubActor = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			displayName: true,
			username: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			displayName: true,
			username: true,
			profileUrl: true,
			createdAt: true,
			note: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayName) ?? ''), String((pendingEntity.acct) ?? ''), String((pendingEntity.username) ?? ''), String((pendingEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor')
	const viewDomId = $derived('activity-pub-actor-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import ActivityPubActor_TimestampsView from '$/views/ActivityPubActor_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'instanceOrigin' in selection.entitySelector
			&& selection.entitySelector.instanceOrigin != null
			&& selection.entitySelector != null && 'localAccountId' in selection.entitySelector
			&& selection.entitySelector.localAccountId != null ?
				resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', {
			instanceOrigin: encodeURIComponent(String(selection.entitySelector.instanceOrigin ?? '')),
			localAccountId: String(selection.entitySelector.localAccountId ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null && reference[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.acct) ?? ''), String((resolvedEntity.username) ?? ''), String((resolvedEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.acct) ?? ''), String((resolvedEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.displayName) ?? ''), String((resolvedEntity.acct) ?? ''), String((resolvedEntity.username) ?? ''), String((resolvedEntity.localAccountId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>acct</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									acct: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const acct = resolvedEntity.acct}
							{#if acct !== undefined && acct !== null}
								{String((acct) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							username: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const username = resolvedEntity.username}
					{#if username !== undefined && username !== null}
						<div>
							<dt>Username</dt>
							<dd>
								{String((username) ?? '')}
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
							profileUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const profileUrl = resolvedEntity.profileUrl}
					{#if profileUrl !== undefined && profileUrl !== null}
						<div>
							<dt>Profile URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(profileUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(profileUrl)} />
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

		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources,
					fields: {
						note: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const note = resolvedEntity.note}
				{#if note !== undefined && note !== null && note !== ''}
					<Markdown content={String(note)} mode="syndication" />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const activityPubActorActivityPubNotesViewNotesResource = selection
		.$$notes({
			sources: [
				Source.Mastodon_Rest,
			],
		})}
				<ResourceBoundary
					resource={activityPubActorActivityPubNotesViewNotesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<ResourceBoundary
							resource={
									selection({
										fields: {
											instanceOrigin: true,
											localAccountId: true,
										},
									})
								}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								<ActivityPubNotesView
									selection={activityPubActorActivityPubNotesViewNotesResource}
									countResource={activityPubActorActivityPubNotesViewNotesResource.count}
									title='Notes'
									href={
											(entity != null && 'instanceOrigin' in entity && entity.instanceOrigin != null && entity != null && 'localAccountId' in entity && entity.localAccountId != null ? resolve('/activitypub/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/notes', {
												instanceOrigin: encodeURIComponent(String(entity.instanceOrigin ?? '')),
												localAccountId: String(entity.localAccountId ?? ''),
											}) : undefined)
										}
									id='ActivityPubNotesView-notes'
								/>
							{/snippet}
						</ResourceBoundary>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const activityPubActorActivityPubActorTimestampsViewTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={activityPubActorActivityPubActorTimestampsViewTimestampsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<ActivityPubActor_TimestampsView
							selection={activityPubActorActivityPubActorTimestampsViewTimestampsResource}
							countResource={activityPubActorActivityPubActorTimestampsViewTimestampsResource.count}
							title='Observations'
							id='ActivityPubActor_TimestampsView-timestamps'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
