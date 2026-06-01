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
			$$timestamps: {
				$: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				],
				$limit: 1,
			},
			createdAt: {},
			$subreddit: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditLink_TimestampsView from '$/views/RedditLink_TimestampsView.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
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
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(link)}
				{link.title ?? entityId.fullname}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={link}
		>
			{#snippet children(link)}
				{#if link.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={link.createdAt}
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

	{#snippet Content({})}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(link)}
				<p>
					{#if !link.selftext}
						<span data-text="muted">No submission text.</span>
					{:else}
						<TruncatedValue
							value={link.selftext}
							format={TruncatedValueFormat.Visual}
						/>
					{/if}
				</p>

				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Score',
								value: link.$$timestamps[0]?.score ?? link.score,
							},
							{
								label: 'Comments',
								value: link.$$timestamps[0]?.commentCount ?? link.commentCount,
							},
						]}
					/>

					{#if link.author}
						<div>
							<dt>Author</dt>
							<dd>u/{link.author}</dd>
						</div>
					{/if}

					{#if link.$subreddit}
						<div>
							<dt>Posted in</dt>
							<dd>
								<RedditSubredditView
									entityId={link.$subreddit[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if link.url}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={link.url}
									rel="noreferrer"
									target="_blank"
								>{link.url}</a>
							</dd>
						</div>
					{/if}

					{#if link.permalink}
						<div>
							<dt>Permalink</dt>
							<dd>
								<a
									href={`https://reddit.com${link.permalink}`}
									rel="noreferrer"
									target="_blank"
								>reddit.com{link.permalink}</a>
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
		<CollapsibleTabs
				sectionIdPrefix={idKey}
					sections={collapsibleTabsSections([
						{ id: 'comments', label: 'Top-level comments' },
						{ id: 'metric-snapshots', label: 'Metrics' },
					])}
				id={`${idKey}:carousel-comments`}
				data-card
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

					{#snippet SectionComments()}
						<RedditCommentsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.RedditLink,
							entityId,
							fieldName: '$$comments',
						}}
						id={`${idKey}:reddit-comments`}
						/>
					{/snippet}

					{#snippet SectionMetricSnapshots()}
						<RedditLink_TimestampsView
							entityFieldReference={{
								entityType: EntityType.RedditLink,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`${idKey}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
