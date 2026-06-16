<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(reddit)/reddit/link/[fullname]', {
			fullname: selector.fullname,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.RedditLink>
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
		subscribe(
			EntityType.RedditLink,
			selector,
			({ sources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			], fields: {
				title: true,
				selftext: true,
				url: true,
				permalink: true,
				author: true,
				$$timestamps: ({ sources: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				], limit: 1 }),
				createdAt: true,
				$subreddit: true,
			} }),
		)
	)

	const idKey = $derived(stringify(selector))


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
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selector.fullname}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={link}
			placeholderText="Loading Reddit submission…"
		>
			{#snippet children(link)}
				{link.fields.title ?? selector.fullname}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={link}
		>
			{#snippet children(link)}
				{#if link.fields.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={link.fields.createdAt}
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
					{#if !link.fields.selftext}
						<span data-text="muted">No submission text.</span>
					{:else}
						<TruncatedValue
							value={link.fields.selftext}
							format={TruncatedValueFormat.Visual}
						/>
					{/if}
				</p>

				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Score',
								value: link.fields.$$timestamps.values.at(0)?.score,
							},
							{
								label: 'Comments',
								value: link.fields.$$timestamps.values.at(0)?.commentCount,
							},
						]}
					/>

					{#if link.fields.author}
						<div>
							<dt>Author</dt>
							<dd>u/{link.fields.author}</dd>
						</div>
					{/if}

					{#if link.fields.$subreddit}
						<div>
							<dt>Posted in</dt>
							<dd>
								<RedditSubredditView
									selector={link.fields.$subreddit[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if link.fields.url}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={link.fields.url}
									rel="noreferrer"
									target="_blank"
								>{link.fields.url}</a>
							</dd>
						</div>
					{/if}

					{#if link.fields.permalink}
						<div>
							<dt>Permalink</dt>
							<dd>
								<a
									href={`https://reddit.com${link.fields.permalink}`}
									rel="noreferrer"
									target="_blank"
								>reddit.com{link.fields.permalink}</a>
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
						selector,
						fieldName: '$$comments',
					}}
					id={`${idKey}:reddit-comments`}
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<RedditLink_TimestampsView
					entityFieldReference={{
						entityType: EntityType.RedditLink,
						selector,
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
