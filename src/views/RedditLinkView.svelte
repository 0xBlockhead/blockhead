<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(reddit)/reddit/link/[fullname]', {
			fullname: selection.entitySelector.fullname,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RedditLink>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const link = $derived(
		selection(({ sources: [
				Source.Constants_Internal,
			], fields: {
				title: true,
				selftext: true,
				url: true,
				permalink: true,
				author: true,
				$$timestamps: ({ sources: [
					Source.Constants_Internal,
				], limit: 1 }),
				createdAt: true,
				$subreddit: true,
			} }),
		)
	)

	const idKey = $derived(stringify(selection.entitySelector))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.fullname}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(link)}
				{link.title ?? selection.entitySelector.fullname}
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
								value: link.$$timestamps?.values.at(0)?.score,
							},
							{
								label: 'Comments',
								value: link.$$timestamps?.values.at(0)?.commentCount,
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
									selection={select(EntityType.RedditSubreddit, link.$subreddit[EntityMetaKey.Selector])}
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
					selection={selection.$$comments}
					id={`${idKey}:reddit-comments`}
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<RedditLink_TimestampsView
					selection={selection.$$timestamps}
					href={href}
					id={`${idKey}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
