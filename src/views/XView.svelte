<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'

	const entityId = {
		scope: 'XNetwork' as const,
	}

	const exampleUserId = '783214' as const
	const examplePostId = '1955274825074221427' as const


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
		entityFieldCollections,
	} from '$/routes/+layout.svelte'

	const networkIdKey = stringify(entityId)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.XNetwork] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const usersQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.XNetwork]['$$xUsers']! })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const postsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.XNetwork]['$$xPosts']! })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.ParentIdKey],
						networkIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[],
	)

	const networkFields = $derived.by(() => {
		const bag = networkQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		return bag !== undefined && typeof bag === 'object' ? bag as Record<string, unknown> : null
	})


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import XPostsView from '$/views/XPostsView.svelte'
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<EntityView
	entityType={EntityType.XNetwork}
	{entityId}
	href={resolve('/(social)/x')}
	open={true}
	title="X"
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Users</dt>
				<dd>{String(usersQuery.data?.length ?? 0)}</dd>
			</div>
			<div>
				<dt>Posts</dt>
				<dd>{String(postsQuery.data?.length ?? 0)}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>
				{#snippet children(_rows)}
					<dl data-definition-list="vertical">
						<div>
							<dt>Protocol name</dt>
							<dd>{String(networkFields?.protocolName ?? 'X')}</dd>
						</div>
						<div>
							<dt>Home</dt>
							<dd>
								<a href={String(networkFields?.homeUrl ?? '#')}>
									{String(networkFields?.homeUrl ?? '—')}
								</a>
							</dd>
						</div>
						{#if typeof networkFields?.docsUrl === 'string' && networkFields.docsUrl.length}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={networkFields.docsUrl}>
										{networkFields.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<div data-column="gap-3">
			<Collapsible
				id={`${networkIdKey}:registry`}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Recent search
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section>
						<XUsersView
							entityFieldReference={{
								entityType: EntityType.XNetwork,
								entityId,
								fieldName: '$$xUsers',
							}}
							href={resolve('/(social)/x')}
							id={`${networkIdKey}:users`}
							open={false}
						/>
					</section>

					<section>
						<XPostsView
							entityFieldReference={{
								entityType: EntityType.XNetwork,
								entityId,
								fieldName: '$$xPosts',
							}}
							href={resolve('/(social)/x')}
							id={`${networkIdKey}:posts`}
							open={false}
							title="Recent posts"
						/>
					</section>
				</div>
			</Collapsible>

			<Collapsible
				id={`${networkIdKey}:examples`}
				open={true}
				{...{ 'data-card': '' }}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Examples
						</HeadingComponent>
					</header>
				{/snippet}

				<p data-text="muted">
					Set
					<code>PUBLIC_X_API_BEARER</code>
					to enable the source.
				</p>
				<ul>
					<li>
						<a href={resolve('/(social)/x/user/[userId]', {
							userId: encodeURIComponent(exampleUserId),
						})}>
							Example user
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/x/post/[postId]', {
							postId: examplePostId,
						})}>
							Example post
						</a>
					</li>
				</ul>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
