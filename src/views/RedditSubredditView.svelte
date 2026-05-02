<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { default as EntityViewComponent } from '$/components/EntityView.svelte'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditSubreddit>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityViewComponent>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const rowQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.RedditSubreddit] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const f = $derived.by(() => {
		const bag = rowQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		if (bag === undefined || typeof bag !== 'object') return null
		const rec = bag as Record<string, unknown>
		const t = rec['title']
		const pd = rec['publicDescription']
		return {
			title: typeof t === 'string' && t.length ? t : undefined,
			publicDescription: typeof pd === 'string' && pd.length ? pd : undefined,
		}
	})

	const displayTitle = $derived(
		f?.title ?? `r/${entityId.name}`,
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<div data-column>
			{#if f !== undefined && f.publicDescription !== undefined}
				<p data-text="muted">
					{f.publicDescription}
				</p>
			{/if}
			<div data-text="mono muted">
				r/{entityId.name}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditSubreddit}
			{entityId}
		>
			<QueryBoundary
				query={rowQuery}
			>
				{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No subreddit data in the app for this name yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Subreddit</dt>
								<dd>r/{entityId.name}</dd>
							</div>
							{#if f?.title !== undefined}
								<div>
									<dt>Title</dt>
									<dd>{f.title}</dd>
								</div>
							{/if}
							{#if f?.publicDescription !== undefined}
								<div>
									<dt>Description</dt>
									<dd>{f.publicDescription}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<Collapsible
			id={`${idKey}:carousel-posts`}
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
						Posts
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet children(_ctx)}
				<div
					class="carousel"
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
				>
					<section>
						<RedditLinksView
							entityFieldReference={{
								entityType: EntityType.RedditSubreddit,
								entityId,
								fieldName: '$$links',
							}}
							href={`/reddit/r/${encodeURIComponent(entityId.name)}/links`}
							id={`${idKey}:links`}
							open={false}
						/>
					</section>
				</div>
			{/snippet}
		</Collapsible>
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
