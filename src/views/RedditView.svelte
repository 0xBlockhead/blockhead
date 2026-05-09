<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'

	const entityId = {
		scope: 'RedditNetwork' as const,
	}


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
				.from({ row: entityCollectionByEntityType[EntityType.RedditNetwork] })
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

	const subredditsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.RedditNetwork]['$$redditSubreddits'] })
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

	const linksQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityFieldCollections[EntityType.RedditNetwork]['$$redditLinks'] })
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
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditNetwork}
	{entityId}
	href={resolve('/(social)/reddit')}
	open={true}
	title="Reddit"
>
	{#snippet Content()}
		<dl>
			<div>
				<dt>Scope</dt>
				<dd>{entityId.scope}</dd>
			</div>
			<div>
				<dt>Communities</dt>
				<dd>{String(subredditsQuery.data?.length ?? 0)}</dd>
			</div>
			<div>
				<dt>Posts</dt>
				<dd>{String(linksQuery.data?.length ?? 0)}</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditNetwork}
			{entityId}
		>
			<QueryBoundary
				query={networkQuery}
			>
				{#snippet children(_rows)}
					<dl>
						<div>
							<dt>Protocol name</dt>
							<dd>{String(networkFields?.protocolName ?? 'Reddit')}</dd>
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
							Popular index
						</HeadingComponent>
					</header>
				{/snippet}

				<div
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
					style="--carousel-basis: 36ch"
				>
					<section data-scroll-marker-label="Subreddits">
						<RedditSubredditsView
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditSubreddits',
							}}
							href={resolve('/(social)/reddit')}
							id={`${networkIdKey}:subreddits`}
							open={false}
						/>
					</section>

					<section data-scroll-marker-label="Popular posts">
						<RedditLinksView
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditLinks',
							}}
							href={resolve('/(social)/reddit')}
							id={`${networkIdKey}:links`}
							open={false}
							title="Popular posts"
						/>
					</section>
				</div>
			</Collapsible>
		</div>
	{/snippet}
</EntityView>
