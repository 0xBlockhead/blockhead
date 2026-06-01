<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(x)/x/user/[userId]', {
			userId: entityId.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XUser>
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
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const user = useEntity(
		EntityType.XUser,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.XUser]?.map((r) => r.source)
				?? [Source.Local_Internal]
			),
			username: {},
			name: {},
			description: {},
			location: {},
			websiteUrl: {},
			verified: {},
			createdAt: {},
			followerCount: {},
			followingCount: {},
			tweetCount: {},
			listedCount: {},
			$$timestamps: {
				$: (
					entityResolversByEntityType[EntityType.XUser_Timestamp]?.map((r) => r.source)
					?? [Source.Local_Internal]
				),
				$limit: 1,
			},
			$icon: {},
			$profileBanner: {},
			$$posts: {},
		},
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Media from '$/components/Media.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import XUser_TimestampsView from '$/views/XUser_TimestampsView.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	{entityId}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(user)}
				{#if user.$icon !== undefined}
					<IconComponent
						alt={user.name ?? user.username ?? ''}
						shape={IconShape.Circle}
						src={user.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(user)}
				{user.name ?? user.username ?? entityId.id}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(user)}
				{#if (
					user.username !== undefined
					&& user.username !== (
						user.name ?? entityId.id
					)
				)}
					<span data-text="muted">
						@{user.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			X profiles here mirror public handle metadata such as bios and avatars.
		</p>
		<p>
			Handle metadata is public social surface area: it does not, by itself, prove custody of on-chain assets, Farcaster FIDs, or content on other networks.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(user)}
				{#if user.description}
					<p>
						<TruncatedValue
							value={user.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={user}
					placeholderText="Loading X profile…"
				>
					{#snippet children(user)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Followers',
									value: user.$$timestamps[0]?.followerCount ?? user.followerCount,
								},
								{
									label: 'Following',
									value: user.$$timestamps[0]?.followingCount ?? user.followingCount,
								},
								{
									label: 'Posts',
									value: user.$$timestamps[0]?.tweetCount ?? user.tweetCount,
								},
								{
									label: 'Listed',
									value: user.$$timestamps[0]?.listedCount ?? user.listedCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Verified</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.verified != null}
									{user.verified ? 'Yes' : 'No'}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Website</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.websiteUrl}
									<a
										href={user.websiteUrl}
										rel="noreferrer noopener"
										target="_blank"
									>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={user.websiteUrl}
										/>
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Location</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.location}
									{user.location}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Joined</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.createdAt != null}
									<Timestamp
										timestamp={user.createdAt}
									/>
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
		{@const userIdKey = stringify(entityId)}
		<CollapsibleTabs
				sectionIdPrefix={userIdKey}
					sections={collapsibleTabsSections([
						{ id: 'profile', label: 'Profile' },
						{ id: 'posts', label: 'Posts' },
						{ id: 'metric-snapshots', label: 'Metrics' },
					])}
				id={`${userIdKey}:carousel-profile`}
				data-card
			>
				{#snippet Summary({ open: _isOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Profile
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionProfile()}
					<ResourceBoundary
						resource={user}
						placeholderText="Loading X profile…"
					>
						{#snippet children(user)}
							<div>
								{#if user.description}
									<p><strong>Description:</strong> {user.description}</p>
								{/if}

								{#if user.$profileBanner?.[EntityMetaKey.Id].url != null}
									<figure>
										<Media
											alt=""
											media={{ url: user.$profileBanner[EntityMetaKey.Id].url }}
										/>
									</figure>
								{/if}

								{#if (
									user.name === undefined
									&& user.username === undefined
									&& user.description === undefined
									&& user.$icon === undefined
									&& user.$profileBanner === undefined
								)}
									<p data-text="muted">
										User details are not available yet.
									</p>
								{/if}
							</div>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

					{#snippet SectionPosts()}
						<ResourceBoundary resource={user}>
						{#snippet children(user)}
							{#if (user.$$posts?.length)}
								<XPostsView
									CollapsibleProps={{ canToggle: false }}
									href={resolve(
										'/(social)/(x)/x/user/[userId]',
										{ userId: entityId.id },
									)}
									entityFieldReference={{
										entityType: EntityType.XUser,
										entityId,
										fieldName: '$$posts',
									}}
									id={`${userIdKey}:posts`}
									title="Posts"
								/>
							{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<XUser_TimestampsView
							entityFieldReference={{
								entityType: EntityType.XUser,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`${userIdKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
