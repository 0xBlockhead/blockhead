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

	import { isEntityReferenceWithId } from '$/lib/isEntityReferenceWithId.ts'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditLink>
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
				.from({ row: entityCollectionByEntityType[EntityType.RedditLink] })
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
		const bagUnknown = rowQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		if (!(typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown))) return null
		const rec = bagUnknown
		const t = rec['title']
		const st = rec['selftext']
		const u = rec['url']
		const a = rec['author']
		const subRef = rec['$subreddit']
		return {
			title: typeof t === 'string' && t.length ? t : undefined,
			selftext: typeof st === 'string' && st.length ? st : undefined,
			url: typeof u === 'string' && u.length ? u : undefined,
			author: typeof a === 'string' && a.length ? a : undefined,
			subId: (
				isEntityReferenceWithId<EntityType.RedditSubreddit>(subRef) ?
					subRef[EntityMetaKey.Id]
				:	undefined
			),
		}
	})

	const displayTitle = $derived(
		f?.title ?? entityId.fullname,
	)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<div data-column>
			{#if f !== undefined && f.selftext !== undefined}
				<p>
					{f.selftext}
				</p>
			{/if}
			{#if f !== undefined && f.url !== undefined}
				<p>
					<a
						href={f.url}
						target="_blank"
						rel="noreferrer"
					>{f.url}</a>
				</p>
			{/if}
			{#if f !== undefined && f.author !== undefined}
				<p data-text="muted">
					u/{f.author}
				</p>
			{/if}
			{#if f !== undefined && f.subId !== undefined}
				<p data-text="muted">
					<a
						href={resolve(
							'/(social)/reddit/r/[name]',
							{ name: encodeURIComponent(f.subId.name) },
						)}
					>r/{f.subId.name}</a>
				</p>
			{/if}
			<div data-text="mono muted">
				{entityId.fullname}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditLink}
			{entityId}
		>
			<QueryBoundary
				query={rowQuery}
			>
				{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No Reddit post data in the app for this fullname yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Post id</dt>
								<dd>
									<span data-text="mono">
										{entityId.fullname}
									</span>
								</dd>
							</div>
							{#if f?.title !== undefined}
								<div>
									<dt>Title</dt>
									<dd>{f.title}</dd>
								</div>
							{/if}
							{#if f?.author !== undefined}
								<div>
									<dt>Author</dt>
									<dd>u/{f.author}</dd>
								</div>
							{/if}
							{#if f?.subId !== undefined}
								<div>
									<dt>Subreddit</dt>
									<dd>
										<a
											href={resolve(
												'/(social)/reddit/r/[name]',
												{ name: encodeURIComponent(f.subId.name) },
											)}
										>r/{f.subId.name}</a>
									</dd>
								</div>
							{/if}
							{#if f?.url !== undefined}
								<div>
									<dt>URL</dt>
									<dd>
										<a
											href={f.url}
											rel="noreferrer"
											target="_blank"
										>{f.url}</a>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<Collapsible
			id={`${idKey}:carousel-comments`}
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
						Comments
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet children(_ctx)}
				<div
					class="carousel"
					data-scroll-container="inline layout-carousel carousel-marker-tabs"
					data-row="start align-start"
				>
					<section data-scroll-marker-label="Comments">
						<RedditCommentsView
							entityFieldReference={{
								entityType: EntityType.RedditLink,
								entityId,
								fieldName: '$$comments',
							}}
							href={`/reddit/link/${encodeURIComponent(entityId.fullname)}/comments`}
							id={`${idKey}:comments`}
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
