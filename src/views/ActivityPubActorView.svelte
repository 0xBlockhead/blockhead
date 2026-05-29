<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
			localAccountId: entityId.localAccountId,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubActor>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { htmlToPlainText } from '$/lib/html.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const actor = useEntity(
		EntityType.ActivityPubActor,
		entityId,
		{
			$: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
			username: {},
			acct: {},
			displayName: {},
			$icon: {},
			...(open ?
				{
					note: {},
					profileUrl: {},
					activityStreamsUri: {},
					website: {},
					followersCount: {},
					followingCount: {},
					statusesCount: {},
					createdAt: {},
					bot: {},
					locked: {},
					$headerImage: {},
				}
			:
				{}),
		},
	)


	// Components
	import ActivityPubNotesView from '$/views/ActivityPubNotesView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading actor…"
		>
			{#snippet children(actor)}
				{actor.displayName
					?? actor.acct
					?? actor.username
					?? entityId.localAccountId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{#if actor.$icon}
					<IconComponent
						alt={actor.displayName ?? actor.acct ?? actor.username ?? entityId.localAccountId}
						shape={IconShape.Circle}
						src={actor.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{entityId.localAccountId}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A federated ActivityPub Actor (Mastodon account) keyed by instance origin + local account id (acct or REST id).
		</p>
		<p>
			Profile fields and outbox statuses resolve from the configured instance REST API—not a live crawl of every federated server.
		</p>
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
					?? entityId.localAccountId}
				{#if actor.username && actor.username !== activityPubSummaryHeadingLine}
					<span data-text="muted">
						@{actor.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
							?? entityId.localAccountId}

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
						{#if actor.followersCount != null}
							<div>
								<dt>Followers</dt>
								<dd>
									<NumberValue
										value={actor.followersCount}
									/>
								</dd>
							</div>
						{/if}

						{#if actor.followingCount != null}
							<div>
								<dt>Following</dt>
								<dd>
									<NumberValue
										value={actor.followingCount}
									/>
								</dd>
							</div>
						{/if}

						{#if actor.statusesCount != null}
							<div>
								<dt>Statuses</dt>
								<dd>
									<NumberValue
										value={actor.statusesCount}
									/>
								</dd>
							</div>
						{/if}

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

						{#if actor.bot != null || actor.locked != null}
							<div>
								<dt>Account flags</dt>
								<dd>
									{#if actor.bot != null}
										{actor.bot ? 'Bot' : 'Not a bot'}
									{/if}
									{#if actor.bot != null && actor.locked != null}
										{' · '}
									{/if}
									{#if actor.locked != null}
										{actor.locked ? 'Locked' : 'Unlocked'}
									{/if}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Local account id</dt>
					<dd data-text="mono">
						{entityId.localAccountId}
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
				id={`${idKey}:carousel-activity`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'mastodon-profile', label: 'Profile' },
					{ id: 'activity-statuses', label: 'Outbox' },
				]}
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

				{#snippet SectionMastodonProfile({ id: _id, label: _label })}
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

				{#snippet SectionActivityStatuses({ id: _id, label: _label })}
					<ActivityPubNotesView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/activitypub/notes')}
						entityFieldReference={{
							entityType: EntityType.ActivityPubActor,
							entityId,
							fieldName: '$$notes',
						}}
						fieldOpen={_open}
						id={`${idKey}:activity-notes-list`}
						orderByCreatedAt="desc"
						placeholderText="Loading Mastodon outbox statuses…"
						title="Outbox"
					/>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
