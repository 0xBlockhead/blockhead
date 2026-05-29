<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/farcaster',
			entityId,
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// Functions
	const trendingFeed = (
		{
			variant: 'trending' as const,
		} satisfies EntityId<typeof schema, EntityType.FarcasterFeed>
	)


	// State
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

	const trending = useEntity(
		EntityType.FarcasterFeed,
		trendingFeed,
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
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Farcaster"
>
	{#snippet Value()}
		{entityId.scope}

	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={network}
			placeholderText="Farcaster"
		>
			{#snippet children(network)}
				{network.protocolName ?? 'Farcaster'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster profiles, channels, and casts: FID + hash identity with hub feeds from Neynar or Snapchain when configured.
		</p>
		<p>
			Social timelines here are not on-chain markets, XMTP threads, or local agent chat logs.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<ResourceBoundary
				resource={network}
				placeholderText="Loading Farcaster hub directory…"
			>
				{#snippet children(network)}
					{#if open}
						<div>
							<dt>Channels</dt>
							<dd>{String(network.$$channels.length)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Users</dt>
							<dd>{String(network.$$users.length)}</dd>
						</div>
					{/if}

					{#if open && network.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{network.protocolName}</dd>
						</div>
					{/if}

					{#if open && network.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.homeUrl}>{network.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={network.docsUrl}>{network.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{network.registryLabel}</dd>
						</div>
					{/if}

					{#if open && network.topology}
						<div>
							<dt>Topology</dt>
							<dd>{network.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary
					resource={trending}
					placeholderText="Loading trending feed (casts by FID + cast hash)…"
				>
					{#snippet children(trending)}
						<div>
							<dt>Trending feed entries</dt>
							<dd>{String(trending.$$entries.length)}</dd>
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
		<CollapsibleTabs
				id={`${networkIdKey}:carousel-discovery`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'feeds', label: 'Feeds' },
					{ id: 'trending', label: 'Trending casts' },
				]}
				data-card
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

				{#snippet SectionFeeds({ id, label })}
					<FarcasterFeedsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/farcaster/feed')}
						entityFieldReference={{
							entityType: EntityType.FarcasterNetwork,
							entityId: { scope: 'FarcasterNetwork' },
							fieldName: '$$feeds',
						}}
						id="feed-index"
						limit={36}
						open={_open}
					/>
				{/snippet}

				{#snippet SectionTrending({ id, label })}
					<FarcasterCastsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/farcaster/feed/trending')}
						entityFieldReference={{
							entityType: EntityType.FarcasterFeed,
							entityId: trendingFeed,
							fieldName: '$$entries',
						}}
						id="casts"
						limit={25}
						open={_open}
						title="Trending casts"
					/>
				{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
				id={`${networkIdKey}:carousel-community`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'channels', label: 'Channels' },
					{ id: 'users', label: 'Users' },
				]}
				data-card
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

				{#snippet SectionChannels({ id, label })}
					<FarcasterChannelsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/farcaster/channels')}
						entityFieldReference={{
							entityType: EntityType.FarcasterNetwork,
							entityId,
							fieldName: '$$channels',
						}}
						id="channels"
						open={_open}
					/>
				{/snippet}

				{#snippet SectionUsers({ id, label })}
					<FarcasterUsersView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/farcaster/users')}
						entityFieldReference={{
							entityType: EntityType.FarcasterNetwork,
							entityId,
							fieldName: '$$users',
						}}
						id="users"
						open={_open}
					/>
				{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
				id={`${networkIdKey}:carousel-accounts`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'accounts', label: 'Connected accounts' },
				]}
				data-card
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

				{#snippet SectionAccounts({ id, label })}
					<BlockheadFarcasterAccountConnectionsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/farcaster/accounts')}
						entityFieldReference={{
							entityType: EntityType._Global,
							entityId: {},
							fieldName: '$$blockheadFarcasterAccountConnections',
						}}
						id="accounts"
						open={_open}
					/>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
