<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	import { htmlToPlainText } from '$/lib/html.ts'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubActor>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const actor = useEntity(
		EntityType.ActivityPubActor,
		entityId,
		{
			$: [Source.Mastodon_Rest],
			username: {},
			acct: {},
			displayName: {},
			$icon: {},
			...(open ?
				{
					note: {},
				}
			:
				{}),
		},
	)


	// Components
	import ActivityPubMastodonFieldNotes from '$/views/ActivityPubMastodonFieldNotes.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
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
			placeholderText=""
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

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
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

	{#snippet Content({ title: _title, href: _href, open })}
		<dl data-column-item="center">
			<div>
				<dt>Local account id</dt>
				<dd data-text="mono">
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading actor…"
					>
						{#snippet children(actor)}
							{@const activityPubSummaryHeadingLine = (
								actor.displayName
								?? actor.acct
								?? actor.username
								?? entityId.localAccountId
							)}
							{#if activityPubSummaryHeadingLine !== entityId.localAccountId}
								{@render Title()}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Username on instance</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading actor…"
						>
							{#snippet children(actor)}
								{#if actor.username}
									{actor.username}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Federated handle (acct)</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading actor…"
						>
							{#snippet children(actor)}
								{#if actor.acct}
									{actor.acct}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Display name</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading actor…"
						>
							{#snippet children(actor)}
								{#if actor.displayName}
									{actor.displayName}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Bio (plain text)</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading actor…"
						>
							{#snippet children(actor)}
								{#if actor.note}
									{htmlToPlainText(actor.note)}
								{/if}
							{/snippet}
						</ResourceBoundary>
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

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Profile"
						href={`#${idKey}:mastodon-profile`}
					>Profile</a>
					<a
						data-scroll-marker-label="Outbox"
						href={`#${idKey}:activity-statuses`}
					>Outbox</a>
				{/snippet}

				{#snippet body(_activityChildrenContext)}
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
					</section>

					<section
						data-scroll-marker-label="Outbox"
						id={`${idKey}:activity-statuses`}
					>
						<ActivityPubMastodonFieldNotes
							entityFieldReference={{
								entityType: EntityType.ActivityPubActor,
								entityId,
								fieldName: '$$notes',
							}}
							fieldOpen={_open}
							href={resolve('/(social)/activitypub/actor/[instanceOrigin]/[localAccountId]/(actor)/notes', {
								instanceOrigin: encodeURIComponent(entityId.instanceOrigin),
								localAccountId: encodeURIComponent(entityId.localAccountId),
							})}
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
