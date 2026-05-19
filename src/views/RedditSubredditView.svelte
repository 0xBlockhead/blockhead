<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditSubreddit>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
			| 'Heading'
		>
	> = $props()


	// State
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
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	{entityId}
	{href}
	{layout}
	bind:open
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

	{#snippet TypeAnnotationTooltip()}
<p>
					Subreddits are Reddit’s named communities—their moderators and description power the posts list surfaced here.
				</p>
				<p>
					Profiles on other networks or realtime rooms tracked locally are unrelated rows.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
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
						<dt>Subreddit</dt>
						<dd data-text="mono">r/{entityId.name}</dd>
					</div>
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

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
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

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Submissions"
						href={`#${idKey}:links`}
					>Submissions</a>
				{/snippet}

				{#snippet children({
					open: _sectionOpen,
				})}
					<section
						id={`${idKey}:links`}
						data-scroll-marker-label="Submissions"
					>
						<RedditLinksView
							entityFieldReference={{
								entityType: EntityType.RedditSubreddit,
								entityId,
								fieldName: '$$links',
							}}
							href={resolve('/(social)/reddit/r/[name]/(subreddit)/links', {
								name: encodeURIComponent(entityId.name),
							})}
							id={`${idKey}:reddit-links`}
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
