<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, entityDefinitionByType, schema } from '$/schema/$schema.ts'
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
	} from '$/collections/$collections.ts'
	import { Source } from '$/sources/$Sources.ts'


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
			| 'Summary'
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
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
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
					ch: entityFieldCollections[EntityType.FarcasterNetwork]['$$farcasterChannels'],
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
					user: entityFieldCollections[EntityType.FarcasterNetwork]['$$farcasterUsers'],
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
						Source.Snapchain,
					)
				))
				.select(({ user }) => ({ user }))
		),
		[() => networkIdKey],
	)

	const castsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
					cast: entityFieldCollections[EntityType.FarcasterNetwork]['$$casts'],
				})
				.where(({ cast }) => (
					eq(
						cast[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.where(({ cast }) => (
					eq(
						cast[EntityMetaKey.Source],
						Source.Snapchain,
					)
				))
				.select(({ cast }) => ({ cast }))
		),
		[() => networkIdKey],
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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import BlockheadFarcasterAccountConnectionsView from '$/views/BlockheadFarcasterAccountConnectionsView.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
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
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
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
				<dt>Casts</dt>
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
					{#if networkRows?.[0]?.row == null}
						<p data-text="muted">
							No network row in collections yet.
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
								<dt>Casts (field rows)</dt>
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

		<FarcasterCastsView
			href={resolve('/farcaster/feed')}
			id={`${networkIdKey}:feed`}
			limit={25}
			open={false}
			parentEntityType={EntityType.FarcasterNetwork}
			parentEntityId={entityId}
			title="Feed"
		/>

		<FarcasterChannelsView
			href={resolve('/farcaster/channels')}
			id={`${networkIdKey}:channels`}
			open={false}
		/>

		<FarcasterUsersView
			href={resolve('/farcaster/users')}
			id={`${networkIdKey}:users`}
			open={false}
		/>

		<BlockheadFarcasterAccountConnectionsView
			href={resolve('/farcaster/accounts')}
			id={`${networkIdKey}:accounts`}
			open={false}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
