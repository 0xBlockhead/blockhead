<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { fediInstanceBySlug } from '$/constants/Fedi.ts'
	import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: encodeURIComponent(selector.instanceOrigin),
			localAccountId: 'localAccountId' in selector ? selector.localAccountId : selector.acct,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ActivityPubActor>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	import { htmlToPlainText } from '$/lib/html.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const idKey = $derived(stringify(selector))

	const sources = $derived(
		selector.instanceOrigin === mastodonInstanceByKey.mastodon_social.origin ?
			[Source.Mastodon_Rest]
		: selector.instanceOrigin === fediInstanceBySlug.fosstodon.origin ?
			[Source.Fedi_Rest]
		:
			[]
	)

	const actor = $derived(
		subscribe(EntityType.ActivityPubActor,
			selector,
			({ sources, fields: { localAccountId: true, username: true, acct: true, displayName: true, $icon: true, ...(open ? ({ note: true, profileUrl: true, activityStreamsUri: true, website: true, $$timestamps: ({ sources, limit: 1 }), createdAt: true, bot: true, locked: true, $headerImage: true }) : ({  })) } }),
		),
	)


	// Components
	import ActivityPubActor_TimestampsView from '$/views/ActivityPubActor_TimestampsView.svelte'
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{#if actor.fields.$icon}
					<IconComponent
						alt={actor.fields.displayName ?? actor.fields.acct ?? actor.fields.username ?? ('localAccountId' in selector ? selector.localAccountId : selector.acct)}
						shape={IconShape.Circle}
						src={actor.fields.$icon[EntityMetaKey.Selector].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={'localAccountId' in selector ? `@${selector.localAccountId}@${selector.instanceOrigin}` : `@${selector.acct}`}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading actor…"
		>
			{#snippet children(actor)}
				{actor.fields.displayName
					?? actor.fields.acct
					?? actor.fields.username
					?? ('localAccountId' in selector ? selector.localAccountId : selector.acct)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{@const activityPubSummaryHeadingLine =
					actor.fields.displayName
					?? actor.fields.acct
					?? actor.fields.username
					?? ('localAccountId' in selector ? selector.localAccountId : selector.acct)}
				{#if actor.fields.username && actor.fields.username !== activityPubSummaryHeadingLine}
					<span data-text="muted">
						@{actor.fields.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A federated ActivityPub Actor (Mastodon account) keyed by instance origin + local account id (acct or REST id).
		</p>
		<p>
			Profile fields and outbox statuses resolve from the configured instance REST API—not a live crawl of every federated server.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading actor…"
		>
			{#snippet children(actor)}
				{#if actor.fields.note}
					<p>
						<TruncatedValue
							value={htmlToPlainText(actor.fields.note)}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading actor…"
					>
						{#snippet children(actor)}
							{@const activityPubSummaryHeadingLine =
								actor.fields.displayName
								?? actor.fields.acct
								?? actor.fields.username
								?? ('localAccountId' in selector ? selector.localAccountId : selector.acct)}

						{#if actor.fields.acct && actor.fields.acct !== activityPubSummaryHeadingLine}
							<div>
								<dt>acct</dt>
								<dd>{actor.fields.acct}</dd>
							</div>
						{/if}

						{#if actor.fields.displayName && actor.fields.displayName !== activityPubSummaryHeadingLine}
							<div>
								<dt>Display name</dt>
								<dd>{actor.fields.displayName}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading actor…"
				>
					{#snippet children(actor)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Followers',
									value: actor.fields.$$timestamps?.values.at(0)?.followersCount,
								},
								{
									label: 'Following',
									value: actor.fields.$$timestamps?.values.at(0)?.followingCount,
								},
								{
									label: 'Statuses',
									value: actor.fields.$$timestamps?.values.at(0)?.statusesCount,
								},
							]}
						/>

						{#if actor.fields.createdAt != null}
							<div>
								<dt>Joined</dt>
								<dd>
									<Timestamp
										timestamp={actor.fields.createdAt}
									/>
								</dd>
							</div>
						{/if}

						{#if actor.fields.profileUrl}
							<div>
								<dt>Profile</dt>
								<dd>
									<a
										href={actor.fields.profileUrl}
										rel="noreferrer"
										target="_blank"
									>{actor.fields.profileUrl}</a>
								</dd>
							</div>
						{/if}

						{#if actor.fields.activityStreamsUri}
							<div>
								<dt>Activity Streams URI</dt>
								<dd>
									<a
										href={actor.fields.activityStreamsUri}
										rel="noreferrer"
										target="_blank"
									>{actor.fields.activityStreamsUri}</a>
								</dd>
							</div>
						{/if}

						{#if actor.fields.website}
							<div>
								<dt>Website</dt>
								<dd>
									<a
										href={actor.fields.website}
										rel="noreferrer"
										target="_blank"
									>{actor.fields.website}</a>
								</dd>
							</div>
						{/if}

						{#if actor.fields.bot != null}
							<div>
								<dt>Bot</dt>
								<dd>{actor.fields.bot ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if actor.fields.locked != null}
							<div>
								<dt>Locked</dt>
								<dd>{actor.fields.locked ? 'Yes' : 'No'}</dd>
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
				id={`${idKey}:carousel-activity`}
				sectionIdPrefix={idKey}
				sections={collapsibleTabsSections([
					{ id: 'mastodon-profile', label: 'Profile' },
					{ id: 'activity-statuses', label: 'Outbox' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
				data-card
			>
				{#snippet Summary({ open: _activitySummaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Mastodon actor & outbox
						</HeadingComponent>
					</header>
				{/snippet}

			{#snippet SectionMastodonProfile()}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading Mastodon profile…"
				>
					{#snippet children(actor)}
						{@const mastodonProfileUnset = (
							actor.fields.acct == null
							&& actor.fields.displayName == null
							&& actor.fields.username == null
							&& actor.fields.note == null
						)}
						{#if mastodonProfileUnset}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No profile fields yet.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Handle, display name, and bio load from the configured Mastodon instance when the account is reachable.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Profile fields"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

				{#snippet SectionActivityStatuses()}
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading actor…"
					>
						{#snippet children(actor)}
							<ActivityPubNotesView
								CollapsibleProps={{ canToggle: false }}
								entityFieldReference={{
									entityType: EntityType.ActivityPubActor,
									selector: {
										instanceOrigin: selector.instanceOrigin,
										localAccountId: 'localAccountId' in selector ? selector.localAccountId : actor.fields.localAccountId,
									},
									fieldName: '$$notes',
								}}
								fieldOpen={_open}
								id={`${idKey}:activity-notes-activityPubActors`}
								orderByCreatedAt="desc"
								placeholderText="Loading Mastodon outbox statuses…"
								{sources}
								title="Outbox"
							/>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionMetricSnapshots()}
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading actor…"
					>
						{#snippet children(actor)}
							<ActivityPubActor_TimestampsView
								entityFieldReference={{
									entityType: EntityType.ActivityPubActor,
									selector: {
										instanceOrigin: selector.instanceOrigin,
										localAccountId: 'localAccountId' in selector ? selector.localAccountId : actor.fields.localAccountId,
									},
									fieldName: '$$timestamps',
								}}
								href={resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
									instanceOrigin: encodeURIComponent(selector.instanceOrigin),
									localAccountId: 'localAccountId' in selector ? selector.localAccountId : actor.fields.localAccountId,
								})}
								id={`${idKey}:metric-snapshots`}
								{sources}
								title="Metric snapshots"
							/>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
