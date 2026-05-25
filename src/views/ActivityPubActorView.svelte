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


	// Props
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
			{#snippet children(loadedActor)}
				{loadedActor.displayName
					?? loadedActor.acct
					?? loadedActor.username
					?? entityId.localAccountId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(loadedActor)}
				{#if loadedActor.$icon}
					<IconComponent
						alt={loadedActor.displayName ?? loadedActor.acct ?? loadedActor.username ?? entityId.localAccountId}
						shape={IconShape.Circle}
						src={loadedActor.$icon[EntityMetaKey.Id].url}
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
			{#snippet children(loadedActor)}
				{@const activityPubSummaryHeadingLine =
					loadedActor.displayName
					?? loadedActor.acct
					?? loadedActor.username
					?? entityId.localAccountId}
				{#if loadedActor.username && loadedActor.username !== activityPubSummaryHeadingLine}
					<span data-text="muted">
						@{loadedActor.username}
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
		<dl data-column-item="center">
			{#if !contentOpen}
				<div>
					<dt>Bio</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading actor…"
						>
							{#snippet children(loadedActor)}
								{#if loadedActor.note}
									{htmlToPlainText(actor.note)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading actor…"
				>
					{#snippet children(loadedActor)}
						{@const activityPubSummaryHeadingLine =
							loadedActor.displayName
							?? loadedActor.acct
							?? loadedActor.username
							?? entityId.localAccountId}

						{#if loadedActor.acct && loadedActor.acct !== activityPubSummaryHeadingLine}
							<div>
								<dt>Federated handle (acct)</dt>
								<dd>{loadedActor.acct}</dd>
							</div>
						{/if}

						{#if loadedActor.displayName && loadedActor.displayName !== activityPubSummaryHeadingLine}
							<div>
								<dt>Display name</dt>
								<dd>{loadedActor.displayName}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Bio (plain text)</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading actor…"
						>
							{#snippet children(loadedActor)}
								{#if loadedActor.note}
									{htmlToPlainText(actor.note)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading actor…"
				>
					{#snippet children(loadedActor)}
						{#if loadedActor.followersCount != null}
							<div>
								<dt>Followers</dt>
								<dd>
									<NumberValue
										value={loadedActor.followersCount}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedActor.followingCount != null}
							<div>
								<dt>Following</dt>
								<dd>
									<NumberValue
										value={loadedActor.followingCount}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedActor.statusesCount != null}
							<div>
								<dt>Statuses</dt>
								<dd>
									<NumberValue
										value={loadedActor.statusesCount}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedActor.createdAt != null}
							<div>
								<dt>Joined</dt>
								<dd>
									<Timestamp
										timestamp={loadedActor.createdAt}
									/>
								</dd>
							</div>
						{/if}

						{#if loadedActor.profileUrl}
							<div>
								<dt>Profile</dt>
								<dd>
									<a
										href={loadedActor.profileUrl}
										rel="noreferrer"
										target="_blank"
									>{loadedActor.profileUrl}</a>
								</dd>
							</div>
						{/if}

						{#if loadedActor.activityStreamsUri}
							<div>
								<dt>Activity Streams URI</dt>
								<dd>
									<a
										href={loadedActor.activityStreamsUri}
										rel="noreferrer"
										target="_blank"
									>{loadedActor.activityStreamsUri}</a>
								</dd>
							</div>
						{/if}

						{#if loadedActor.website}
							<div>
								<dt>Website</dt>
								<dd>
									<a
										href={loadedActor.website}
										rel="noreferrer"
										target="_blank"
									>{loadedActor.website}</a>
								</dd>
							</div>
						{/if}

						{#if loadedActor.bot != null || loadedActor.locked != null}
							<div>
								<dt>Account flags</dt>
								<dd>
									{#if loadedActor.bot != null}
										{loadedActor.bot ? 'Bot' : 'Not a bot'}
									{/if}
									{#if loadedActor.bot != null && loadedActor.locked != null}
										{' · '}
									{/if}
									{#if loadedActor.locked != null}
										{loadedActor.locked ? 'Locked' : 'Unlocked'}
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
		<div
			class="activitypub-actor-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-activity`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Profile"
						href={`#${idKey}:mastodon-profile`}
					>Profile</a>
					<a
						data-scroll-marker-label="Outbox"
						href={`#${idKey}:activity-statuses`}
					>Outbox</a>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<section
						data-scroll-marker-label="Profile"
						id={`${idKey}:mastodon-profile`}
					>
						<EntityDetails
							entityType={EntityType.ActivityPubActor}
							{entityId}
						/>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading Mastodon profile…"
						>
							{#snippet children(loadedActor)}
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
					</section>

					<section
						data-scroll-marker-label="Outbox"
						id={`${idKey}:activity-statuses`}
					>
						<ActivityPubNotesView
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
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
