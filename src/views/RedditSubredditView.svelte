<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
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
			entityId: EntityId<typeof schema, EntityType.RedditSubreddit>
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

	const subreddit = useEntity(
		EntityType.RedditSubreddit,
		entityId,
		{
			$: [
				Source.Reddit_Rest,
			],
			title: {},
			publicDescription: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.name}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(u)}
				{u.title ?? `r/${entityId.name}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(u)}
				{#if !u.publicDescription}
					<p data-text="muted">No subreddit description.</p>
				{:else}
					{#if !open}
						<p data-text="muted">{u.publicDescription}</p>
					{/if}
				{/if}
				<dl data-column-item="center">
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

					<div>
						<dt>Subreddit</dt>
						<dd>r/{entityId.name}</dd>
					</div>
					{#if open}
						{#if u.title}
							<div>
								<dt>Title</dt>
								<dd>{u.title}</dd>
							</div>
						{/if}
					{/if}
					{#if open}
						{#if u.publicDescription}
							<div>
								<dt>Description</dt>
								<dd>{u.publicDescription}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditSubreddit}
			{entityId}
		/>

		<div class="entity-view-detail-carousels">
			<CollapsibleTabs
				id={`${idKey}:carousel-posts`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
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
					<section data-scroll-marker-label="Posts">
						<RedditLinksView
							entityFieldReference={{
								entityType: EntityType.RedditSubreddit,
								entityId,
								fieldName: '$$links',
							}}
							href={resolve('/(social)/reddit/r/[name]/(subreddit)/links', {
								name: encodeURIComponent(entityId.name),
							})}
							id={`${idKey}:links`}
							open={false}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
