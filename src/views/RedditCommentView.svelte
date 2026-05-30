<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(reddit)/reddit/comment/[fullname]', {
			fullname: entityId.fullname,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditComment>
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

	const comment = useEntity(
		EntityType.RedditComment,
		entityId,
		{
			$: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
			body: {},
			author: {},
			score: {},
			$$timestamps: {
				$: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				],
				$limit: 1,
			},
			createdAt: {},
			depth: {},
			$link: {},
			$parentComment: {},
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
	import NumberValue from '$/views/NumberValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditComment_TimestampsView from '$/views/RedditComment_TimestampsView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
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
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				<TruncatedValue
					value={(
						comment.body ?
							comment.body.replaceAll('\n', ' ')
						:
							entityId.fullname
					)}
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
				{#if comment.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={comment.createdAt}
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

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				<p>
					{#if !comment.body}
						<span data-text="muted">No comment text.</span>
					{:else}
						<TruncatedValue
							value={comment.body}
							format={TruncatedValueFormat.Visual}
						/>
					{/if}
				</p>

				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Score',
								value: comment.$$timestamps[0]?.score ?? comment.score,
							},
						]}
					/>

					{#if comment.depth != null}
						<div>
							<dt>Depth</dt>
							<dd>
								<NumberValue
									value={comment.depth}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Author</dt>
						<dd>
							{#if comment.author}
								u/{comment.author}
							{:else}
								<span data-text="muted">[deleted]</span>
							{/if}
						</dd>
					</div>

					{#if comment.$parentComment}
						<div>
							<dt>Reply to</dt>
							<dd>
								<svelte:self
									entityId={comment.$parentComment[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if comment.$link}
						<div>
							<dt>Submission</dt>
							<dd>
								<RedditLinkView
									entityId={comment.$link[EntityMetaKey.Id]}
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
						{ id: 'comment-details', label: 'Metadata' },
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

				{#snippet SectionCommentDetails()}
				{/snippet}

					{#snippet SectionCommentReplies()}
						<RedditCommentsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.RedditComment,
							entityId,
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
