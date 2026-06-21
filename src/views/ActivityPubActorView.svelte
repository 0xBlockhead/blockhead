<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
		selection,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ActivityPubActor>
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

	const actor = $derived(
		selection(
			({
				sources,
				fields: {
					localAccountId: true,
					username: true,
					acct: true,
					displayName: true,
					$icon: true,
					...(open && {
						note: true,
						profileUrl: true,
						activityStreamsUri: true,
						website: true,
						$$timestamps: {
							sources,
							limit: 1,
						},
						createdAt: true,
						bot: true,
						locked: true,
						$headerImage: true,
					}),
				},
			}),
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
	entitySelector={selection.entitySelector}
	href={href ?? ('localAccountId' in selection.entitySelector ?
		resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
			localAccountId: selection.entitySelector.localAccountId,
		})
	:
		undefined)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{#if actor.$icon}
					<IconComponent
						alt={actor.displayName ?? actor.acct ?? actor.username ?? ('localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : 'acct' in selection.entitySelector ? selection.entitySelector.acct : selection.entitySelector.activityStreamsUri)}
						shape={IconShape.Circle}
						src={actor.$icon[EntityMetaKey.Selector].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={'localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : 'acct' in selection.entitySelector ? `@${selection.entitySelector.acct}` : selection.entitySelector.activityStreamsUri}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading actor…"
		>
			{#snippet children(actor)}
				{actor.displayName
					?? actor.acct
					?? actor.username
					?? ('localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : 'acct' in selection.entitySelector ? selection.entitySelector.acct : selection.entitySelector.activityStreamsUri)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{@const activityPubSummaryHeadingLine =
					actor.displayName
					?? actor.acct
					?? actor.username
					?? ('localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : 'acct' in selection.entitySelector ? selection.entitySelector.acct : selection.entitySelector.activityStreamsUri)}
				{#if actor.username && actor.username !== activityPubSummaryHeadingLine}
					<span data-text="muted">
						@{actor.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A federated ActivityPub Actor (Mastodon account) keyed by instance origin + local REST account id or acct.
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
				{#if actor.note}
					<p>
						<TruncatedValue
							value={htmlToPlainText(actor.note)}
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
								actor.displayName
								?? actor.acct
								?? actor.username
								?? ('localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : 'acct' in selection.entitySelector ? selection.entitySelector.acct : selection.entitySelector.activityStreamsUri)}

						{#if actor.acct && actor.acct !== activityPubSummaryHeadingLine}
							<div>
								<dt>acct</dt>
								<dd>{actor.acct}</dd>
							</div>
						{/if}

						{#if actor.displayName && actor.displayName !== activityPubSummaryHeadingLine}
							<div>
								<dt>Display name</dt>
								<dd>{actor.displayName}</dd>
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
									value: actor.$$timestamps?.values.at(0)?.followersCount,
								},
								{
									label: 'Following',
									value: actor.$$timestamps?.values.at(0)?.followingCount,
								},
								{
									label: 'Statuses',
									value: actor.$$timestamps?.values.at(0)?.statusesCount,
								},
							]}
						/>

						{#if actor.createdAt != null}
							<div>
								<dt>Joined</dt>
								<dd>
									<Timestamp
										timestamp={actor.createdAt}
									/>
								</dd>
							</div>
						{/if}

						{#if actor.profileUrl}
							<div>
								<dt>Profile</dt>
								<dd>
									<a
										href={actor.profileUrl}
										rel="noreferrer"
										target="_blank"
									>{actor.profileUrl}</a>
								</dd>
							</div>
						{/if}

						{#if actor.activityStreamsUri}
							<div>
								<dt>Activity Streams URI</dt>
								<dd>
									<a
										href={actor.activityStreamsUri}
										rel="noreferrer"
										target="_blank"
									>{actor.activityStreamsUri}</a>
								</dd>
							</div>
						{/if}

						{#if actor.website}
							<div>
								<dt>Website</dt>
								<dd>
									<a
										href={actor.website}
										rel="noreferrer"
										target="_blank"
									>{actor.website}</a>
								</dd>
							</div>
						{/if}

						{#if actor.bot != null}
							<div>
								<dt>Bot</dt>
								<dd>{actor.bot ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if actor.locked != null}
							<div>
								<dt>Locked</dt>
								<dd>{actor.locked ? 'Yes' : 'No'}</dd>
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
							actor.acct == null
							&& actor.displayName == null
							&& actor.username == null
							&& actor.note == null
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
							{@const localAccountId = 'localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : actor.localAccountId}
							{#if 'instanceOrigin' in selection.entitySelector && localAccountId != null}
								<ActivityPubNotesView
									CollapsibleProps={{ canToggle: false }}
									selection={select(
			EntityType.ActivityPubActor,
			{
											instanceOrigin: selection.entitySelector.instanceOrigin,
											localAccountId,
										}
		).$$notes}
									fieldOpen={_open}
									id={`${idKey}:activity-notes-activityPubActors`}
									orderByCreatedAt="desc"
									placeholderText="Loading Mastodon outbox statuses…"
									{sources}
									title="Outbox"
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionMetricSnapshots()}
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading actor…"
					>
						{#snippet children(actor)}
							{@const localAccountId = 'localAccountId' in selection.entitySelector ? selection.entitySelector.localAccountId : actor.localAccountId}
							{#if 'instanceOrigin' in selection.entitySelector && localAccountId != null}
								<ActivityPubActor_TimestampsView
									selection={select(
			EntityType.ActivityPubActor,
			{
											instanceOrigin: selection.entitySelector.instanceOrigin,
											localAccountId,
										}
		).$$timestamps}
									href={resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
										instanceOrigin: encodeURIComponent(selection.entitySelector.instanceOrigin),
										localAccountId,
									})}
									id={`${idKey}:metric-snapshots`}
									{sources}
									title="Metric snapshots"
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
