<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href: hrefProp,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XUser>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const selector = $derived(
		selection.value[EntityMetaKey.Selector]
	)
	const userRouteId = $derived(
		'id' in selector ? selector.id : selector.username
	)

	const href = $derived(
		hrefProp ?? resolve('/(social)/(x)/x/user/[userId]', {
			userId: userRouteId,
		})
	)


	const user = $derived(
		selection({
					...(!('id' in selector) && {
					sources: [
						Source.X_FxEmbed_Rest,
					],
				}),
				fields: {
					id: true,
					username: true,
					name: true,
					description: true,
					location: true,
					websiteUrl: true,
					verified: true,
					createdAt: true,
					$$timestamps: {
						limit: 1,
					},
					$icon: true,
					$profileBanner: true,
					$$posts: true,
				},
			},
		),
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
		{#if open}
			<ResourceBoundary
				resource={user}
				placeholderText="Loading X profile…"
			>
				{#snippet children(user)}
					{#if user.$icon !== undefined}
						<IconComponent
							alt={user.name ?? user.username ?? ''}
							shape={IconShape.Circle}
							src={user.$icon[EntityMetaKey.Selector].url}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={'id' in selector ? selector.id : `@${selector.username}`}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				resource={user}
				placeholderText="Loading X profile…"
				>
					{#snippet children(user)}
						{user.name ?? user.username ?? ('id' in selector ? selector.id : selector.username)}
					{/snippet}
				</ResourceBoundary>
			{:else}
				{'id' in selector ? selector.id : `@${selector.username}`}
			{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if open}
			<ResourceBoundary
				resource={user}
				placeholderText="Loading X profile…"
			>
				{#snippet children(user)}
					{#if (
							user.username !== undefined
							&& user.username !== (
								user.name ?? ('id' in selector ? selector.id : selector.username)
							)
						)}
						<span data-text="muted">
							@{user.username}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
		{#if open}
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
		{/if}

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
									value: user.$$timestamps?.values.at(0)?.followerCount,
								},
								{
									label: 'Following',
									value: user.$$timestamps?.values.at(0)?.followingCount,
								},
								{
									label: 'Posts',
									value: user.$$timestamps?.values.at(0)?.tweetCount,
								},
								{
									label: 'Listed',
									value: user.$$timestamps?.values.at(0)?.listedCount,
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
								{#if user.verified != null}
									{user.verified ? 'Yes' : 'No'}
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

			{#if open}
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

			{#if open}
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
							{#if user.description}
								<p><strong>Description:</strong> {user.description}</p>
							{/if}

							{#if user.$profileBanner?.[EntityMetaKey.Selector].url != null}
								<figure>
									<Media
										alt=""
										media={{ url: user.$profileBanner[EntityMetaKey.Selector].url }}
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
					<XPostsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve(
							'/(social)/(x)/x/user/[userId]',
							{ userId: userRouteId },
						)}
						selection={selection.$$posts}
						id={`${userSelectorKey}:posts`}
						title="Posts"
					/>
				{/snippet}

				{#snippet SectionMetricSnapshots()}
					<XUser_TimestampsView
						selection={selection.$$timestamps}
						href={resolve('/(social)/(x)/x/user/[userId]', {
							userId: userRouteId,
						})}
						id={`${userSelectorKey}:metric-snapshots`}
						title="Metric snapshots"
					/>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
