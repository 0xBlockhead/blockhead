<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(reddit)/reddit/link/[fullname]', {
			fullname: entityId.fullname,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditLink>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
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
				Source.Reddit_PublicJson,
			],
			title: {},
			selftext: {},
			url: {},
			permalink: {},
			author: {},
			score: {},
			commentCount: {},
			createdAt: {},
			$subreddit: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.fullname}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(loadedLink)}
				{loadedLink.title ?? entityId.fullname}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={link}
		>
			{#snippet children(loadedLink)}
				{#if loadedLink.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={loadedLink.createdAt}
						/>
					</span>
				{/if}
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
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(loadedLink)}
				<dl data-column-item="center">
					<div>
						<dt>Body</dt>
						<dd>
							{#if !loadedLink.selftext}
								<p data-text="muted">No submission text.</p>
							{:else}
								<Markdown content={loadedLink.selftext} />
							{/if}
						</dd>
					</div>

					{#if loadedLink.score != null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue
									value={loadedLink.score}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedLink.commentCount != null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue
									value={loadedLink.commentCount}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedLink.author}
						<div>
							<dt>Author</dt>
							<dd>u/{loadedLink.author}</dd>
						</div>
					{/if}

					{#if loadedLink.$subreddit}
						<div>
							<dt>Posted in</dt>
							<dd>
								<RedditSubredditView
									entityId={loadedLink.$subreddit[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedLink.url}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={loadedLink.url}
									rel="noreferrer"
									target="_blank"
								>{loadedLink.url}</a>
							</dd>
						</div>
					{/if}

					{#if loadedLink.permalink}
						<div>
							<dt>Permalink</dt>
							<dd>
								<a
									href={`https://reddit.com${loadedLink.permalink}`}
									rel="noreferrer"
									target="_blank"
								>reddit.com{loadedLink.permalink}</a>
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
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'comments', label: 'Top-level comments' },
				]}
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
							Top-level comments
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionComments({ id, label })}
					<RedditCommentsView
						href={resolve('/reddit/comments')}
						entityFieldReference={{
							entityType: EntityType.RedditLink,
							entityId,
							fieldName: '$$comments',
						}}
						id={`${idKey}:reddit-comments`}
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


