<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


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
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
			| 'Heading'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const link = useEntity(
		EntityType.RedditLink,
		entityId,
		{
			$: [
				Source.Reddit_Rest,
			],
			title: {},
			selftext: {},
			url: {},
			author: {},
			$subreddit: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading post…"
		>
			{#snippet children(u)}
				{u.title ?? entityId.fullname}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading post…"
		>
			{#snippet children(u)}
				{#if !u.selftext}
					<p data-text="muted">No post text.</p>
				{:else}
					<p>{u.selftext}</p>
				{/if}
				<dl data-column-item="center">
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

					{#if open}
						<div>
							<dt>Post id</dt>
							<dd>
								<span data-text="mono">
									{entityId.fullname}
								</span>
							</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Title</dt>
							<dd>{u.title}</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Author</dt>
							<dd>u/{u.author}</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>Subreddit</dt>
							<dd>
								<a
									href={resolve(
										'/(social)/reddit/r/[name]',
										{ name: encodeURIComponent(u.$subreddit[EntityMetaKey.Id].name) },
									)}
								>r/{u.$subreddit[EntityMetaKey.Id].name}</a>
							</dd>
						</div>
					{/if}
					{#if open}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={u.url}
									rel="noreferrer"
									target="_blank"
								>{u.url}</a>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditLink}
			{entityId}
		>
			<ResourceBoundary
				resource={link}
				placeholderText="Loading post…"
			>
				{#snippet children(_u)}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		<Collapsible
			id={`${idKey}:carousel-comments`}
			{...{ 'data-card': '' }}
		>
			{#snippet Summary({
				open: _summaryOpen,
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
							href={resolve('/(social)/reddit/link/[fullname]/(link)/comments', {
								fullname: encodeURIComponent(entityId.fullname),
							})}
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
