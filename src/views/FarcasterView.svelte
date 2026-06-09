<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/farcaster'),
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

	const trendingFeed: EntityId<typeof schema, EntityType.FarcasterFeed> = {
		variant: 'trending',
	}

	const network = useEntity(entityCollectionsContext, EntityType.FarcasterNetwork,
		entityId,
		({ sources: [Source.Farcaster_Rest], fields: { ...(open ? ({ protocolName: true, homeUrl: true, docsUrl: true, registryLabel: true, topology: true, $$channels: true, $$users: ({ sources: [Source.Snapchain_Rest] }) }) : ({  })) } }),
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	}


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
		Farcaster
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={network}
			placeholderText="Farcaster"
		>
			{#snippet children(network)}
				{network.fields.protocolName ?? 'Farcaster'}
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

	{#snippet Content({})}
		<dl>
			<ResourceBoundary
				resource={network}
				placeholderText="Loading Farcaster hub directory…"
			>
				{#snippet children(network)}
					{#if open}
						<div>
							<dt>Channels</dt>
							<dd>{String(network.fields.$$channels?.values.length)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Users</dt>
							<dd>{String(network.fields.$$users?.values.length)}</dd>
						</div>
					{/if}

					{#if open && network.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{network.fields.protocolName}</dd>
						</div>
					{/if}

					{#if open && network.fields.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={network.fields.homeUrl}>{network.fields.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.fields.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={network.fields.docsUrl}>{network.fields.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && network.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{network.fields.registryLabel}</dd>
						</div>
					{/if}

					{#if open && network.fields.topology}
						<div>
							<dt>Topology</dt>
							<dd>{network.fields.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const networkIdKey = stringify(entityId)}
		<CollapsibleTabs
			id={`${networkIdKey}:carousel-discovery`}
			sectionIdPrefix={networkIdKey}
			sections={collapsibleTabsSections([
				{ id: 'feeds', label: 'Feeds' },
				{ id: 'trending', label: 'Trending casts' },
			])}
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
			sections={collapsibleTabsSections([
				{ id: 'channels', label: 'Channels' },
				{ id: 'users', label: 'Users' },
			])}
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
			sections={collapsibleTabsSections([
				{ id: 'accounts', label: 'Connected accounts' },
			])}
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
						entityId: { scope: '$$blockheadFarcasterAccountConnections' },
						fieldName: '$$blockheadFarcasterAccountConnections',
					}}
					id="accounts"
					open={_open}
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
