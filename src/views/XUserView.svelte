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
		href = resolve('/(social)/x/user/[userId]', {
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
			profileUrl: {},
			verified: {},
			createdAt: {},
			followerCount: {},
			followingCount: {},
			tweetCount: {},
			listedCount: {},
			$icon: {},
			$profileBanner: {},
			$$posts: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Media from '$/components/Media.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	{entityId}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(loadedUser)}
				{loadedUser.name ?? loadedUser.username ?? entityId.id}
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
		{@render Value()}
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(loadedUser)}
				{#if loadedUser.$icon !== undefined}
					<IconComponent
						alt={loadedUser.name ?? loadedUser.username ?? ''}
						shape={IconShape.Circle}
						src={loadedUser.$icon[EntityMetaKey.Id].url}
					/>
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

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={user}
			placeholderText="Loading X profile…"
		>
			{#snippet children(loadedUser)}
				{#if (
					user.username !== undefined
					&& user.username !== (
						user.name ?? loadedUser.username ?? entityId.id
					)
				)}
					<span data-text="muted">
						@{loadedUser.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			{#if !contentOpen}
				<div>
					<dt>Description</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.description}
									<p data-text="muted">
										{loadedUser.description}
									</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>Name</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.name}
									{loadedUser.name}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Username</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.username}
									{loadedUser.username}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Description</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.description}
									{loadedUser.description}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Followers</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.followerCount != null}
									<NumberValue
										value={loadedUser.followerCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Following</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.followingCount != null}
									<NumberValue
										value={loadedUser.followingCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Posts</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.tweetCount != null}
									<NumberValue
										value={loadedUser.tweetCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Verified</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.verified != null}
									{loadedUser.verified ? 'Yes' : 'No'}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Profile URL</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(loadedUser)}
								{#if loadedUser.profileUrl}
									<a
										href={loadedUser.profileUrl}
										rel="noreferrer noopener"
										target="_blank"
									>
										<TruncatedValue
											format={TruncatedValueFormat.Visual}
											value={loadedUser.profileUrl}
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
							{#snippet children(loadedUser)}
								{#if loadedUser.location}
									{loadedUser.location}
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
							{#snippet children(loadedUser)}
								{#if loadedUser.createdAt != null}
									<Timestamp
										timestamp={loadedUser.createdAt}
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
		<EntityDetails
			entityType={EntityType.XUser}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				sectionIdPrefix={userIdKey}
				sections={[
					{ id: 'profile', label: 'Profile' },
					...(user.$$posts?.length ? [
						{ id: 'posts', label: 'Posts' },
					] : []),
				]}
				id={`${userIdKey}:carousel-profile`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet SectionProfile({ id, label })}
					<ResourceBoundary
						resource={user}
						placeholderText="Loading X profile…"
					>
						{#snippet children(loadedUser)}
							<dl data-column-item="center">
								{#if loadedUser.description}
									<div>
										<dt>Description</dt>
										<dd>{loadedUser.description}</dd>
									</div>
								{/if}

								{#if loadedUser.$profileBanner?.[EntityMetaKey.Id].url != null}
									<div>
										<dt>Banner</dt>
										<dd>
											<Media
												alt=""
												media={{ url: loadedUser.$profileBanner[EntityMetaKey.Id].url }}
											/>
										</dd>
									</div>
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
							</dl>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionPosts({ id, label })}
					<ResourceBoundary resource={user}>
						{#snippet children(loadedUser)}
							{#if (user.$$posts?.length)}
								<XPostsView
									collapsible={false}
									href={resolve(
										'/(social)/x/user/[userId]',
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
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

