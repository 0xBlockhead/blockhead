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
		href = resolve('/(social)/(reddit)/reddit/r/[name]', {
			name: selection.entitySelector.name,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RedditSubreddit>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const subreddit = $derived(
		selection(({ sources: [
				Source.Constants_Internal,
			], fields: {
				title: true,
				publicDescription: true,
				createdAt: true,
				over18: true,
				$icon: true,
			} }),
		)
	)

	const idKey = $derived(stringify(selection.entitySelector))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(subreddit)}
				{#if subreddit.$icon !== undefined}
					<IconComponent
						alt={subreddit.title ?? selection.entitySelector.name}
						shape={IconShape.Circle}
						src={subreddit.$icon[EntityMetaKey.Selector].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{selection.entitySelector.name}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(subreddit)}
				{subreddit.title ?? `r/${selection.entitySelector.name}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Subreddits are Reddit’s named communities—their moderators and description power the posts redditSubreddits surfaced here.
		</p>
		<p>
			Profiles on other networks or realtime rooms tracked locally are unrelated redditSubreddits.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(subreddit)}
				{#if subreddit.publicDescription}
					<p>
						<TruncatedValue
							value={subreddit.publicDescription}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if subreddit.createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp
									timestamp={subreddit.createdAt}
								/>
							</dd>
						</div>
					{/if}

					{#if subreddit.over18 != null}
						<div>
							<dt>NSFW</dt>
							<dd>{subreddit.over18 ? 'Yes' : 'No'}</dd>
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
				{ id: 'links', label: 'Submissions' },
				{ id: 'metric-snapshots', label: 'Metrics' },
			])}
			id={`${idKey}:carousel-posts`}
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
						Posts
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLinks()}
				<RedditLinksView
					CollapsibleProps={{ canToggle: false }}
					selection={selection.$$links}
					id={`${idKey}:reddit-links`}
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<RedditSubreddit_TimestampsView
					selection={selection.$$timestamps}
					href={href}
					id={`${idKey}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
