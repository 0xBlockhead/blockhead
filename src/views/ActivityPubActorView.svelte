<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.ActivityPubActor> = $props()

	const activityPubActor = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
		fields: {
			displayName: true,
			username: true,
			acct: true,
			localAccountId: true,
			activityStreamsUri: true,
			profileUrl: true,
			createdAt: true,
			note: true,
		},
	}))
	const titleFallback = $derived([(prefetched.displayName ?? ''), (prefetched.acct ?? ''), (prefetched.username ?? ''), (prefetched.localAccountId ?? '')].filter(Boolean).join(' ') || 'ActivityPub actor')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'instanceOrigin' in selection.entitySelector
				&& 'localAccountId' in selection.entitySelector ?
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
						{
							instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
							localAccountId: selection.entitySelector.localAccountId,
						}
					)
				:
					'instanceOrigin' in selection.entitySelector
					&& 'acct' in selection.entitySelector ?
						resolve(
							'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/@[acct=stringSegment]',
							{
								instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
								acct: selection.entitySelector.acct,
							}
						)
					:
						'activityStreamsUri' in selection.entitySelector ?
							resolve(
								'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[activityStreamsUri=stringSegment]',
								{
									activityStreamsUri: selection.entitySelector.activityStreamsUri,
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
	{#snippet Icon()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), entity.acct, (entity.username ?? ''), entity.localAccountId].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={activityPubActor}>
			{#snippet children(entity)}
				{[entity.acct, entity.localAccountId].filter(Boolean).join(' ') || [(entity.displayName ?? ''), entity.acct, (entity.username ?? ''), entity.localAccountId].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>acct</dt>
				<dd>
					<ResourceBoundary
						resource={activityPubActor}
					>
						{#snippet children(entity)}
							{entity.acct}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubActor}
			>
				{#snippet children(entity)}
					{@const username = entity.username}
					{#if username != null}
						<div>
							<dt>Username</dt>
							<dd>
								{username}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubActor}
			>
				{#snippet children(entity)}
					{@const profileUrl = entity.profileUrl}
					{#if profileUrl != null}
						<div>
							<dt>Profile URL</dt>
							<dd>
								<a
									href={profileUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={profileUrl} />
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
						resource={activityPubActor}
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={activityPubActor}
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

		<ResourceBoundary
			resource={activityPubActor}
		>
			{#snippet children(entity)}
				{@const note = entity.note}
				{#if note != null && note !== ''}
					<Markdown content={htmlToPlainText(note)} mode="syndication" />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		{@const notesResource = selection.$$notes}
		<ResourceBoundary
			resource={notesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubNotesView
						selection={notesResource}
						countResource={notesResource.count}
						title='Notes'
						href={
							'instanceOrigin' in selection.entitySelector
							&& 'localAccountId' in selection.entitySelector ?
								resolve(
									'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes',
									{
										instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
										localAccountId: selection.entitySelector.localAccountId,
									}
								)
							:
								undefined
						}
						id='notes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ActivityPubActor_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
