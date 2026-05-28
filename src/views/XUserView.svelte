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
			websiteUrl: {},
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
			{#snippet children(user)}
				{user.name ?? user.username ?? entityId.id}
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
							{#snippet children(user)}
								{#if user.description}
									<p data-text="muted">
										{user.description}
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
							{#snippet children(user)}
								{#if user.name}
									{user.name}
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
							{#snippet children(user)}
								{#if user.username}
									{user.username}
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
							{#snippet children(user)}
								{#if user.description}
									{user.description}
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
							{#snippet children(user)}
								{#if user.followerCount != null}
									<NumberValue
										value={user.followerCount}
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
							{#snippet children(user)}
								{#if user.followingCount != null}
									<NumberValue
										value={user.followingCount}
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
							{#snippet children(user)}
								{#if user.tweetCount != null}
									<NumberValue
										value={user.tweetCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Listed</dt>
					<dd>
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if user.listedCount != null}
									<NumberValue
										value={user.listedCount}
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
				sections={[
					{ id: 'profile', label: 'Profile' },
					...(user.$$posts?.length ? [
						{ id: 'posts', label: 'Posts' },
					] : []),
				]}
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

				{#snippet SectionProfile({ id, label })}
					<ResourceBoundary
						resource={user}
						placeholderText="Loading X profile…"
					>
						{#snippet children(user)}
							<dl data-column-item="center">
								{#if user.description}
									<div>
										<dt>Description</dt>
										<dd>{user.description}</dd>
									</div>
								{/if}

								{#if user.$profileBanner?.[EntityMetaKey.Id].url != null}
									<div>
										<dt>Banner</dt>
										<dd>
											<Media
												alt=""
												media={{ url: user.$profileBanner[EntityMetaKey.Id].url }}
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
						{#snippet children(user)}
							{#if (user.$$posts?.length)}
								<XPostsView
									CollapsibleProps={{ canToggle: false }}
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
	{/snippet}
</EntityView>
