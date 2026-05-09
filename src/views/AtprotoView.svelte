<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'

	const entityId = {
		scope: 'AtprotoNetwork' as const,
	}

	const exampleDid = 'did:plc:z72i7hdynmk6r22z27h6tvur' as const
	const examplePostUri = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3la6vijfoie2r' as const


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
				.from({ row: entityCollectionByEntityType[EntityType.AtprotoNetwork] })
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

	const actorsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.AtprotoNetwork]['$$atprotoActors'] })
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
				.from({ row: entityFieldCollections[EntityType.AtprotoNetwork]['$$atprotoPosts'] })
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
		return bag != null && (typeof bag === 'object' && bag !== null && !Array.isArray(bag)) ? bag : null
	})


	// Components
	import AtprotoActorsView from '$/views/AtprotoActorsView.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoNetwork}
	{entityId}
	href={resolve('/(social)/atproto')}
	open={true}
	title="AT Protocol"
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Actors</dt>
				<dd>{String(actorsQuery.data?.length ?? 0)}</dd>
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
			entityType={EntityType.AtprotoNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>
				{#snippet children(_rows)}
					<dl>
						<div>
							<dt>Protocol name</dt>
							<dd>{String(networkFields?.protocolName ?? 'AT Protocol')}</dd>
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
							Registry
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Actors">
						<AtprotoActorsView
							entityFieldReference={{
								entityType: EntityType.AtprotoNetwork,
								entityId,
								fieldName: '$$atprotoActors',
							}}
							href={resolve('/(social)/atproto')}
							id={`${networkIdKey}:actors`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Recent posts">
						<AtprotoPostsView
							entityFieldReference={{
								entityType: EntityType.AtprotoNetwork,
								entityId,
								fieldName: '$$atprotoPosts',
							}}
							href={resolve('/(social)/atproto')}
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

				<ul>
					<li>
						<a href={resolve('/(social)/atproto/actor/[did]', {
							did: encodeURIComponent(exampleDid),
						})}>
							Actor example
						</a>
					</li>
					<li>
						<a href={resolve('/(social)/atproto/post/[uri]', {
							uri: encodeURIComponent(examplePostUri),
						})}>
							Post example
						</a>
					</li>
				</ul>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
