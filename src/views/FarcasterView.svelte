<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterNetwork>
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
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const network = useEntity(
		EntityType.FarcasterNetwork,
		entityId,
		{
			$: [Source.Farcaster_Rest],
			...(open ?
				{
					protocolName: {},
					homeUrl: {},
					docsUrl: {},
					registryLabel: {},
					topology: {},
					$$channels: {},
					$$users: { $: [Source.Snapchain_Rest] },
				}
			:
				{}),
		},
	)

	const trendingFeedEntityId = (
		{
			variant: 'trending' as const,
		} satisfies EntityId<typeof schema, EntityType.FarcasterFeed>
	)

	const trending = useEntity(
		EntityType.FarcasterFeed,
		trendingFeedEntityId,
		{
			$: [
				import.meta.env.PUBLIC_NEYNAR_API_KEY?.trim() ?
					Source.Neynar_Rest
				:
					Source.Snapchain_Rest,
			],
			...(open ?
				{
					$$entries: {},
				}
			:
				{}),
		},
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterNetwork}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	title="Farcaster"
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			{#if open}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading Farcaster hub directory…"
				>
					{#snippet children(n)}
						<div>
							<dt>Scope</dt>
							<dd>{entityId.scope}</dd>
						</div>
						<div>
							<dt>Channels (id / slug)</dt>
							<dd>{String(n.$$channels.length)}</dd>
						</div>
						<div>
							<dt>Users (FID · fname on profile)</dt>
							<dd>{String(n.$$users.length)}</dd>
						</div>
						{#if n.protocolName}
							<div>
								<dt>Protocol</dt>
								<dd>{n.protocolName}</dd>
							</div>
						{/if}

						{#if n.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={n.homeUrl}>{n.homeUrl}</a>
								</dd>
							</div>
						{/if}

						{#if n.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={n.docsUrl}>{n.docsUrl}</a>
								</dd>
							</div>
						{/if}

						{#if n.registryLabel}
							<div>
								<dt>Registry</dt>
								<dd>{n.registryLabel}</dd>
							</div>
						{/if}

						{#if n.topology}
							<div>
								<dt>Topology</dt>
								<dd>{n.topology}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
				<ResourceBoundary
					resource={trending}
					placeholderText="Loading trending feed (casts by FID + cast hash)…"
				>
					{#snippet children(t)}
						<div>
							<dt>Trending casts (feed)</dt>
							<dd>{String(t.$$entries.length)}</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const networkIdKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.FarcasterNetwork}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-discovery`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _open })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Discovery
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Feeds"
						href={`#${networkIdKey}:feeds`}
					>Feeds</a>
					<a
						data-scroll-marker-label="Trending casts"
						href={`#${networkIdKey}:trending`}
					>Trending casts</a>
				{/snippet}

				{#snippet children({ open: _open })}
					<section data-scroll-marker-label="Feeds">
						<FarcasterFeedsView
							entityFieldReference={{
								entityType: EntityType.FarcasterNetwork,
								entityId: { scope: 'FarcasterNetwork' },
								fieldName: '$$feeds',
							}}
							href={resolve('/farcaster/feed')}
							id={`${networkIdKey}:feeds`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Trending casts">
						<FarcasterCastsView
							entityFieldReference={{
								entityType: EntityType.FarcasterFeed,
								entityId: trendingFeedEntityId,
								fieldName: '$$entries',
							}}
							href={resolve('/farcaster/feed/trending')}
							id={`${networkIdKey}:trending`}
							limit={25}
							open={false}
							title="Trending casts"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-community`}
				{...{ 'data-card': '' }}
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _open })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Community
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Channels"
						href={`#${networkIdKey}:channels`}
					>Channels</a>
					<a
						data-scroll-marker-label="Users"
						href={`#${networkIdKey}:users`}
					>Users</a>
				{/snippet}

				{#snippet children({ open: _open })}
					<section data-scroll-marker-label="Channels">
						<FarcasterChannelsView
							entityFieldReference={{
								entityType: EntityType.FarcasterNetwork,
								entityId,
								fieldName: '$$channels',
							}}
							href={resolve('/farcaster/channels')}
							id={`${networkIdKey}:channels`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Users">
						<FarcasterUsersView
							entityFieldReference={{
								entityType: EntityType.FarcasterNetwork,
								entityId,
								fieldName: '$$users',
							}}
							href={resolve('/farcaster/users')}
							id={`${networkIdKey}:users`}
							open={false}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${networkIdKey}:carousel-accounts`}
				{...{ 'data-card': '' }}
				scrollContainerProps={entityViewDetailCarouselScrollProps}
			>
				{#snippet Summary({ open: _open })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Accounts
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Connected accounts"
						href={`#${networkIdKey}:accounts`}
					>Connected accounts</a>
				{/snippet}

				{#snippet children({ open: _open })}
					<section data-scroll-marker-label="Connected accounts">
						<BlockheadFarcasterAccountConnectionsView
							entityFieldReference={{
								entityType: EntityType._Global,
								entityId: {},
								fieldName: '$$blockheadFarcasterAccountConnections',
							}}
							href={resolve('/farcaster/accounts')}
							id={`${networkIdKey}:accounts`}
							open={false}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
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
