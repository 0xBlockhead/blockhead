<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(reddit)/reddit/comment/[fullname]', {
			fullname: selector.fullname,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.RedditComment>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const comment = $derived(
		proxy(
			EntityType.RedditComment,
			selector,
			({ sources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			], fields: {
				body: true,
				author: true,
				$$timestamps: ({ sources: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				], limit: 1 }),
				createdAt: true,
				depth: true,
				$link: true,
				$parentComment: true,
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
	import NumberValue from '$/views/NumberValue.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditComment_TimestampsView from '$/views/RedditComment_TimestampsView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
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
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				<TruncatedValue
					value={
						comment.fields.body ?
							comment.fields.body.replaceAll('\n', ' ')
						:
							selector.fullname
					}
					startLength={64}
					endLength={16}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={comment}
		>
			{#snippet children(comment)}
				{#if comment.fields.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={comment.fields.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Reddit organizes posts with nested threaded replies anchored on a submission.
		</p>
		<p>
			It is unrelated to realtime collaboration rooms here or casts on other networks.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				<p>
					{#if !comment.fields.body}
						<span data-text="muted">No comment text.</span>
					{:else}
						<TruncatedValue
							value={comment.fields.body}
							format={TruncatedValueFormat.Visual}
						/>
					{/if}
				</p>

				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Score',
								value: comment.fields.$$timestamps.values.at(0)?.score,
							},
						]}
					/>

					{#if comment.fields.depth != null}
						<div>
							<dt>Depth</dt>
							<dd>
								<NumberValue
									value={comment.fields.depth}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Author</dt>
						<dd>
							{#if comment.fields.author}
								u/{comment.fields.author}
							{:else}
								<span data-text="muted">[deleted]</span>
							{/if}
						</dd>
					</div>

					{#if comment.fields.$parentComment}
						<div>
							<dt>Reply to</dt>
							<dd>
									<RedditCommentView
										selector={comment.fields.$parentComment[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}

								
									open={false}

								
									/>
							</dd>
						</div>
					{/if}

					{#if comment.fields.$link}
						<div>
							<dt>Submission</dt>
							<dd>
								<RedditLinkView
									selector={comment.fields.$link[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

									open={false}
									/>
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
					{ id: 'comment-replies', label: 'Replies' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
			id={`${idKey}:carousel-comment`}
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
						Comment & replies
					</HeadingComponent>
				</header>
			{/snippet}

				{#snippet SectionCommentReplies()}
				<RedditCommentsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.RedditComment,
						selector,
						fieldName: '$$replies',
					}}
					id={`${idKey}:reddit-replies`}
					sortMode="createdAtAsc"
					title="Replies"
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<RedditComment_TimestampsView
					entityFieldReference={{
						entityType: EntityType.RedditComment,
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
