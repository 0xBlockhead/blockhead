<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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
			entityId: EntityId<typeof schema, EntityType.RedditLink>
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
			permalink: {},
			author: {},
			$subreddit: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(link)}
				{link.title ?? entityId.fullname}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A submission bundles a headline, outbound link fields, optional body markdown, then the anchored comment thread underneath.
		</p>
		<p>
			This is Reddit’s threaded model—not realtime rooms or simple chat timelines.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if !open}
				<div>
					<dt>Submission</dt>
					<dd>
						<ResourceBoundary
							resource={link}
							placeholderText="Loading Reddit submission…"
						>
							{#snippet children(link)}
								{#if !link.selftext}
									<p data-text="muted">No submission text.</p>
								{:else}
									<p>{link.selftext}</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if open}
				<div>
					<dt>Submission fullname</dt>
					<dd>
						<span data-text="mono">
							{entityId.fullname}
						</span>
					</dd>
				</div>

				<div>
					<dt>Submission title</dt>
					<dd>
						<ResourceBoundary
							resource={link}
							placeholderText="Loading Reddit submission…"
						>
							{#snippet children(link)}
								{link.title}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={link}
							placeholderText="Loading Reddit submission…"
						>
							{#snippet children(link)}
								link/{link.author}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Posted in</dt>
					<dd>
						<ResourceBoundary
							resource={link}
							placeholderText="Loading Reddit submission…"
						>
							{#snippet children(link)}
								<a
									href={resolve(
										'/(social)/reddit/r/[name]',
										{ name: encodeURIComponent(link.$subreddit[EntityMetaKey.Id].name) },
									)}
								>r/{link.$subreddit[EntityMetaKey.Id].name}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={link}
							placeholderText="Loading Reddit submission…"
						>
							{#snippet children(link)}
								<a
									href={link.url}
									rel="noreferrer"
									target="_blank"
								>{link.url}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Permalink</dt>
					<dd>
						<ResourceBoundary
							resource={link}
							placeholderText="Loading Reddit submission…"
						>
							{#snippet children(link)}
								{#if link.permalink}
									<a
										href={`https://reddit.com${link.permalink}`}
										rel="noreferrer"
										target="_blank"
									>reddit.com{link.permalink}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
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
				placeholderText="Loading Reddit submission…"
			>
				{#snippet children(link)}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-comments`}
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
							Comment thread
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Comment thread"
						href={`#${idKey}:comments`}
					>Thread</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen,
				})}
					<section
						id={`${idKey}:comments`}
						data-scroll-marker-label="Comment thread"
					>
						<RedditCommentsView
							entityFieldReference={{
								entityType: EntityType.RedditLink,
								entityId,
								fieldName: '$$comments',
							}}
							href={resolve('/(social)/reddit/link/[fullname]/(link)/comments', {
								fullname: encodeURIComponent(entityId.fullname),
							})}
							id={`${idKey}:reddit-comments`}
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
