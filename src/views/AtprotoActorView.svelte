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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(atproto)/atproto/actor/[did]', {
			did: 'did' in entityId ? entityId.did : entityId.handle,
		}),
		open = $bindable(true),
			...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoActor>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const idKey = stringify(entityId)

	const actor = useEntity(
		EntityType.AtprotoActor,
		entityId,
		{
			$: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
			did: {},
			displayName: {},
			handle: {},
			$icon: {},
			...(open ?
				{
					$banner: {},
					description: {},
					followersCount: {},
					followsCount: {},
					postsCount: {},
					$$timestamps: {
						$: [
							Source.Atproto_Xrpc,
							Source.Atproto_BskySocial_Xrpc,
						],
						$limit: 1,
					},
					indexedAt: {},
				}
			:
				{}),
		},
	)


	// Components
	import AtprotoActor_TimestampsView from '$/views/AtprotoActor_TimestampsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
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
	entityType={EntityType.AtprotoActor}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{@const atprotoBrandIconSrc = actor.$icon?.[EntityMetaKey.Id].url}
				{#if atprotoBrandIconSrc}
					<IconComponent
						alt={actor.displayName ?? actor.handle ?? ''}
						shape={IconShape.Circle}
						src={atprotoBrandIconSrc}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{'did' in entityId ? entityId.did : `@${entityId.handle}`}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading profile…"
		>
			{#snippet children(actor)}
					{actor.displayName
						?? actor.handle
						?? ('did' in entityId ? entityId.did : entityId.handle)}
				{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
					{@const atprotoSummaryHeadingLine = (
						actor.displayName
						?? actor.handle
						?? ('did' in entityId ? entityId.did : entityId.handle)
					)}
				{#if actor.handle && actor.handle !== atprotoSummaryHeadingLine}
					<span data-text="muted">
						@{actor.handle}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			AT Protocol profiles are DIDs with Bluesky App View metadata (handle, avatar, counts); the repo record lives behind the DID, not a legacy numeric profile id.
		</p>
	{/snippet}

	{#snippet Content({ open })}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading profile…"
		>
			{#snippet children(actor)}
				{#if actor.description}
					<p>
						<TruncatedValue
							value={actor.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if open}
				<div>
					<dt>Handle</dt>
					<dd>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading profile…"
						>
							{#snippet children(actor)}
								{#if actor.handle}
									{actor.handle}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading profile…"
				>
					{#snippet children(actor)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Followers',
									value: actor.$$timestamps[0]?.followersCount ?? actor.followersCount,
								},
								{
									label: 'Following',
									value: actor.$$timestamps[0]?.followsCount ?? actor.followsCount,
								},
								{
									label: 'Posts',
									value: actor.$$timestamps[0]?.postsCount ?? actor.postsCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading profile…"
				>
					{#snippet children(actor)}
						{#if actor.$banner != null}
							<div>
								<dt>Banner</dt>
								<dd>
									<a href={actor.$banner[EntityMetaKey.Id].url}>
										<TruncatedValue
											value={actor.$banner[EntityMetaKey.Id].url}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading profile…"
				>
					{#snippet children(actor)}
						{#if actor.indexedAt != null}
							<div>
								<dt>Indexed</dt>
								<dd>
									<Timestamp
										timestamp={actor.indexedAt}
									/>
								</dd>
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
			id={`${idKey}:carousel-profile`}
			sectionIdPrefix={idKey}
				sections={collapsibleTabsSections([
					{ id: 'profile-details', label: 'Lexicon identity' },
					{ id: 'activity-posts', label: 'Posts' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
			data-card
		>
			{#snippet Summary({ open: _profileSummaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Lexicon profile & posts
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionProfileDetails()}
				<ResourceBoundary
					resource={actor}
					placeholderText="Loading profile…"
				>
					{#snippet children(actor)}
						{@const atprotoProfileUnset = (
							actor.handle == null
							&& actor.displayName == null
							&& actor.description == null
						)}
						{#if atprotoProfileUnset}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No profile fields yet.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Display name, handle, and description load from the configured ATProto repository when the DID resolves.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Lexicon profile"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

				{#snippet SectionActivityPosts()}
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading profile…"
					>
						{#snippet children(actor)}
							<AtprotoPostsView
								CollapsibleProps={{ canToggle: false }}
								href={resolve(
								'/(social)/(atproto)/atproto/actor/[did]/(actor)/posts',
									{ did: encodeURIComponent(actor.did) },
							)}
								entityFieldReference={{
									entityType: EntityType.AtprotoActor,
									entityId: {
										did: actor.did,
									},
									fieldName: '$$posts',
								}}
								id={`${idKey}:posts`}
								fieldOpen={_open}
								title="Posts"
							/>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionMetricSnapshots()}
					<ResourceBoundary
						resource={actor}
						placeholderText="Loading profile…"
					>
						{#snippet children(actor)}
							<AtprotoActor_TimestampsView
								entityFieldReference={{
									entityType: EntityType.AtprotoActor,
									entityId: {
										did: actor.did,
									},
									fieldName: '$$timestamps',
								}}
								href={resolve('/(social)/(atproto)/atproto/actor/[did]', {
									did: encodeURIComponent(actor.did),
								})}
								id={`${idKey}:metric-snapshots`}
								title="Metric snapshots"
							/>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</EntityView>
