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


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XUser>
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
			| 'Heading'
			| 'Details'
			| 'Icon'
			| 'Content'
			| 'HeadingAfter'
			| 'TypeAnnotationTooltip'
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
			$icon: {},
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
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	summaryUsesHeading={true}
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

	{#snippet Title()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
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
						user.name ?? user.username ?? entityId.id
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

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Profile"
						href={`#${userIdKey}:profile`}
					>Profile</a>
					<ResourceBoundary resource={user}>
						{#snippet children(user)}
							{#if (user.$$posts?.length)}
								<a
									data-scroll-marker-label="Posts"
									href={`#${userIdKey}:posts`}
								>Posts</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_childrenContext)}
					<section data-scroll-marker-label="Profile">
						<ResourceBoundary
							resource={user}
							placeholderText="Loading X profile…"
						>
							{#snippet children(user)}
								{#if (
									user.name === undefined
									&& user.username === undefined
									&& user.description === undefined
									&& user.$icon === undefined
								)}
									<p data-text="muted">
										User details are not available yet.
									</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>

					<ResourceBoundary resource={user}>
						{#snippet children(user)}
							{#if (user.$$posts?.length)}
								<section data-scroll-marker-label="Posts">
									<XPostsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.XUser,
											entityId,
											fieldName: '$$posts',
										}}
										href={resolve(
											'/(social)/x/user/[userId]',
											{
												userId: encodeURIComponent(entityId.id),
											},
										)}
										id={`${userIdKey}:posts`}
										title="Posts"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
