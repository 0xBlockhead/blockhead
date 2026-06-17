<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(atproto)/atproto/post/[...uri]', {
			uri: encodeURIComponent(selector.uri),
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.AtprotoPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const idKey = $derived(stringify(selector))

	const post = $derived(subscribe(EntityType.AtprotoPost,
		selector,
		{
			sources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
			fields: {
				text: true,
				createdAt: true,
				...(open && {
					$author: true,
					$parent: true,
					$root: true,
					indexedAt: true,
					$$timestamps: {
						sources: [
							Source.Atproto_Xrpc,
							Source.Atproto_BskySocial_Xrpc,
						],
						limit: 1,
					},
					langs: true,
					selfLabelValues: true,
				}),
			},
		},
	))


	// Components
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
	import AtprotoPost_TimestampsView from '$/views/AtprotoPost_TimestampsView.svelte'
	import AtprotoPostThreadView from '$/views/AtprotoPostThreadView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			endLength={12}
			format={TruncatedValueFormat.Visual}
			startLength={20}
			value={selector.uri}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(post)}
				{#if post.fields.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={post.fields.text}
					/>
					{:else}
						<span data-text="font-monospace">
							<TruncatedValue
								value={selector.uri}
								format={TruncatedValueFormat.Visual}
							/>
						</span>
					{/if}
				{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={post}
		>
			{#snippet children(post)}
				{#if post.fields.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={post.fields.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Bluesky posts are AT Protocol repository records keyed by at-URI; text, reply parent/root, and engagement counts come from the public App View API.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(post)}
				{#if post.fields.text}
					<p>
						<TruncatedValue
							value={post.fields.text}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if post.fields.createdAt}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={post.fields.createdAt}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.fields.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<AtprotoActorView
									selector={post.fields.$author[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.fields.$parent}
						<div>
							<dt>Reply to</dt>
							<dd>
									<AtprotoPostView
										selector={post.fields.$parent[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}
										open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.fields.$root && post.fields.$root[EntityMetaKey.Selector].uri !== post.fields.$parent?.[EntityMetaKey.Selector].uri}
						<div>
							<dt>Thread root</dt>
							<dd>
									<AtprotoPostView
										selector={post.fields.$root[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						<SocialMetricSnapshotRows
							metrics={[
									{
										label: 'Replies',
										value: post.fields.$$timestamps.values.at(0)?.replyCount,
									},
									{
										label: 'Reposts',
										value: post.fields.$$timestamps.values.at(0)?.repostCount,
									},
									{
										label: 'Likes',
										value: post.fields.$$timestamps.values.at(0)?.likeCount,
									},
									{
										label: 'Quotes',
										value: post.fields.$$timestamps.values.at(0)?.quoteCount,
									},
							]}
						/>
					{/if}

					{#if contentOpen && post.fields.langs?.length}
						<div>
							<dt>Languages</dt>
							<dd>{post.fields.langs.join(', ')}</dd>
						</div>
					{/if}

					{#if contentOpen && post.fields.selfLabelValues?.length}
						<div>
							<dt>Self labels</dt>
							<dd>{post.fields.selfLabelValues.join(', ')}</dd>
						</div>
					{/if}

					{#if contentOpen && post.fields.indexedAt}
						<div>
							<dt>Indexed</dt>
							<dd>
								<Timestamp
									timestamp={post.fields.indexedAt}
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
			id={`${idKey}:carousel-post`}
			sectionIdPrefix={idKey}
				sections={collapsibleTabsSections([
					{ id: 'thread', label: 'Thread' },
					{ id: 'repository', label: 'Repository' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
			data-card
		>
			{#snippet Summary({ open: _postSummaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Thread & repository
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionThread()}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Thread
					</HeadingComponent>
				</header>

				<AtprotoPostThreadView
					entityFieldReference={{
						entityType: EntityType.AtprotoPost,
						selector,
						fieldName: '$$thread',
					}}
					id={`${idKey}:thread-atprotoPosts`}
					open={true}
					title="Thread"
				/>
			{/snippet}

			{#snippet SectionRepository()}
				<header
				data-row-item="flexible"
				data-row="wrap gap-4"
			>
				<HeadingComponent>
					Repository
				</HeadingComponent>
			</header>

			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<AtprotoPost_TimestampsView
					entityFieldReference={{
						entityType: EntityType.AtprotoPost,
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
