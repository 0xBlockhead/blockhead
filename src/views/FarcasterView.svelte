<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { entityDefinitionByType, schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import {
		EntityFieldType,
		EntityMetaKey,
	} from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'
	import { Source } from '$/sources/$Source.ts'


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


	const networkIdKey = $derived(
		stringify(entityId),
	)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterNetwork] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => networkIdKey],
	)

	const networkRow = $derived(
		networkQuery.data?.[0]?.row,
	)

	const networkPrimitiveFields = $derived(
		(() => {
			const bag = networkRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			const out: Record<string, string> = {}
			for (const def of entityDefinitionByType[EntityType.FarcasterNetwork].fields) {
				if (def.type !== EntityFieldType.Primitive) continue
				const v = b[def.name]
				if (v === undefined) continue
				out[def.name] = String(v)
			}
			return out
		})(),
	)

	const channelsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					ch: entityFieldCollections[EntityType.FarcasterNetwork]['$$channels'],
				})
				.where(({ ch }) => (
					eq(
						ch[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ ch }) => ({ ch }))
		),
		[() => networkIdKey],
	)

	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					user: entityFieldCollections[EntityType.FarcasterNetwork]['$$users'],
				})
				.where(({ user }) => (
					eq(
						user[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ user }) => (
					eq(
						user[EntityMetaKey.Source],
						Source.Snapchain_Rest,
					)
				))
				.select(({ user }) => ({ user }))
		),
		[() => networkIdKey],
	)

	const trendingFeedIdKey = $derived(
		stringify(({
			variant: 'trending' as const,
		} satisfies EntityId<typeof schema, EntityType.FarcasterFeed>)),
	)

	const farcasterCastListSource = $derived(
		(
			typeof import.meta.env.PUBLIC_NEYNAR_API_KEY === 'string'
			&& import.meta.env.PUBLIC_NEYNAR_API_KEY.trim() !== ''
		) ?
			Source.Neynar_Rest
		:	Source.Snapchain_Rest,
	)

	const castsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					cast: entityFieldCollections[EntityType.FarcasterFeed]['$$entries']!,
				})
				.where(({ cast }) => (
					eq(
						cast[EntityMetaKey.ParentIdKey],
						trendingFeedIdKey,
					)
				))
				.where(({ cast }) => (
					eq(
						cast[EntityMetaKey.Source],
						farcasterCastListSource,
					)
				))
				.select(({ cast }) => ({ cast }))
		),
		[() => trendingFeedIdKey, () => farcasterCastListSource],
	)

	const channelCount = $derived(
		channelsQuery.data?.length ?? 0,
	)

	const userCount = $derived(
		usersQuery.data?.length ?? 0,
	)

	const castCount = $derived(
		castsQuery.data?.length ?? 0,
	)

	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
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
	{open}
	{...entityViewRest}
	title="Farcaster"
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Channels</dt>
				<dd>{String(channelCount)}</dd>
			</div>
			<div>
				<dt>Users</dt>
				<dd>{String(userCount)}</dd>
			</div>
			<div>
				<dt>Trending feed</dt>
				<dd>{String(castCount)}</dd>
			</div>
			{#if networkPrimitiveFields != null}
				{#each Object.entries(networkPrimitiveFields) as [name, value] (name)}
					<div>
						<dt>{name}</dt>
						<dd>{value}</dd>
					</div>
				{/each}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.FarcasterNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>

				{#snippet children(networkRows)}
					{#if networkRows?.[0]?.row === undefined}
						<p data-text="muted">
							No Farcaster network data yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Scope</dt>
								<dd>{entityId.scope}</dd>
							</div>
							<div>
								<dt>Channels (field rows)</dt>
								<dd>{String(channelCount)}</dd>
							</div>
							<div>
								<dt>Users (field rows)</dt>
								<dd>{String(userCount)}</dd>
							</div>
							<div>
								<dt>Trending feed (field rows)</dt>
								<dd>{String(castCount)}</dd>
							</div>
							{#if networkPrimitiveFields != null}
								{#each Object.entries(networkPrimitiveFields) as [name, value] (name)}
									<div>
										<dt>{name}</dt>
										<dd>{value}</dd>
									</div>
								{/each}
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:carousel-discovery`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _open,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Discovery
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
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

						<section data-scroll-marker-label="Trending">
							<FarcasterCastsView
								entityFieldReference={{
									entityType: EntityType.FarcasterFeed,
									entityId: ({
										variant: 'trending' as const,
									} satisfies EntityId<typeof schema, EntityType.FarcasterFeed>),
									fieldName: '$$entries',
								}}
								href={resolve('/farcaster/feed/trending')}
								id={`${networkIdKey}:trending`}
								limit={25}
								open={false}
								title="Trending"
							/>
						</section>
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-community`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _open,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Community
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
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
					</div>
				{/snippet}
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:carousel-accounts`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({
					open: _open,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Accounts
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet children(_ctx)}
					<div
						class="carousel"
						data-scroll-container="inline layout-carousel carousel-marker-tabs"
						data-row="start align-start"
					>
						<section data-scroll-marker-label="Accounts">
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
					</div>
				{/snippet}
			</Collapsible>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.carousel {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
