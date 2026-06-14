<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(x)/x/user/[userId]', {
			userId: 'id' in selector ? selector.id : selector.username,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.XUser>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const user = subscribe(EntityType.XUser,
		selector,
		({
			...(!('id' in selector) && {
				sources: [Source.X_FxEmbed_Rest],
			}),
			fields: { id: true, username: true, name: true, description: true, location: true, websiteUrl: true, verified: true, createdAt: true, followerCount: true, followingCount: true, tweetCount: true, listedCount: true, $$timestamps: ({ limit: 1 }), $icon: true, $profileBanner: true, $$posts: true },
		}),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
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
	entitySelector={selector}
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
				{#if user.fields.$icon !== undefined}
					<IconComponent
						alt={user.fields.name ?? user.fields.username ?? ''}
						shape={IconShape.Circle}
						src={user.fields.$icon[EntityMetaKey.Selector].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={'id' in selector ? selector.id : `@${selector.username}`}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(user)}
				{user.fields.name ?? user.fields.username ?? ('id' in selector ? selector.id : selector.username)}
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
					user.fields.username !== undefined
					&& user.fields.username !== (
						user.fields.name ?? ('id' in selector ? selector.id : selector.username)
					)
				)}
					<span data-text="muted">
						@{user.fields.username}
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

	{#snippet Content({ open })}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(user)}
				{#if user.fields.description}
					<p>
						<TruncatedValue
							value={user.fields.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={user}
					placeholderText="Loading X profile…"
				>
					{#snippet children(user)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Followers',
									value: user.fields.$$timestamps[0]?.followerCount ?? user.fields.followerCount,
								},
								{
									label: 'Following',
									value: user.fields.$$timestamps[0]?.followingCount ?? user.fields.followingCount,
								},
								{
									label: 'Posts',
									value: user.fields.$$timestamps[0]?.tweetCount ?? user.fields.tweetCount,
								},
								{
									label: 'Listed',
									value: user.fields.$$timestamps[0]?.listedCount ?? user.fields.listedCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<div>
					<dt>Verified</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.fields.verified != null}
									{user.fields.verified ? 'Yes' : 'No'}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Website</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.fields.websiteUrl}
									<a
										href={user.fields.websiteUrl}
										rel="noreferrer noopener"
										target="_blank"
									>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={user.fields.websiteUrl}
										/>
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Location</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.fields.location}
									{user.fields.location}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Joined</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.fields.createdAt != null}
									<Timestamp
										timestamp={user.fields.createdAt}
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
		{@const userSelectorKey = stringify(selector)}
		<CollapsibleTabs
			sectionIdPrefix={userSelectorKey}
				sections={collapsibleTabsSections([
					{ id: 'profile', label: 'Profile' },
					{ id: 'posts', label: 'Posts' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
			id={`${userSelectorKey}:carousel-profile`}
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
							{#if user.fields.description}
								<p><strong>Description:</strong> {user.fields.description}</p>
							{/if}

							{#if user.fields.$profileBanner?.[EntityMetaKey.Selector].url != null}
								<figure>
									<Media
										alt=""
										media={{ url: user.fields.$profileBanner[EntityMetaKey.Selector].url }}
									/>
								</figure>
							{/if}

							{#if (
								user.fields.name === undefined
								&& user.fields.username === undefined
								&& user.fields.description === undefined
								&& user.fields.$icon === undefined
								&& user.fields.$profileBanner === undefined
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
						{#if (user.fields.$$posts?.values.length)}
							<XPostsView
								CollapsibleProps={{ canToggle: false }}
								href={resolve(
									'/(social)/(x)/x/user/[userId]',
									{ userId: user.fields.id },
								)}
								entityFieldReference={{
									entityType: EntityType.XUser,
									selector: {
										id: user.fields.id,
									},
									fieldName: '$$posts',
								}}
								id={`${userSelectorKey}:posts`}
								title="Posts"
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<ResourceBoundary resource={user}>
					{#snippet children(user)}
						<XUser_TimestampsView
							entityFieldReference={{
								entityType: EntityType.XUser,
								selector: {
									id: user.fields.id,
								},
								fieldName: '$$timestamps',
							}}
							href={resolve('/(social)/(x)/x/user/[userId]', {
								userId: user.fields.id,
							})}
							id={`${userSelectorKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</EntityView>
