<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AtprotoPost> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Atproto_Xrpc,
		],
	}))
	const atprotoPost = $derived(viewSelection({
		fields: {
			text: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.text ?? '') || (pendingEntity.uri ?? '') || 'AT Protocol post')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
	import AtprotoPost_TimestampsView from '$/views/AtprotoPost_TimestampsView.svelte'
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
			{
				uri: encodeURIComponent(String(selection.entitySelector.uri)),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={atprotoPost}>
			{#snippet children(entity)}
				{@const text0 = entity.text}
				{#if text0 != null}
					<span data-text="long-text">{text0}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={atprotoPost}>
			{#snippet children(entity)}
				{@const createdAt0 = entity.createdAt}
				{#if createdAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AT URI</dt>
				<dd>
					<TruncatedValue value={pendingEntity.uri} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$author}
				>
					{#snippet children(atprotoActor)}
						{#if atprotoActor != null}
							<div>
								<dt>Author</dt>
								<dd>
									<AtprotoActorView
										selection={select(EntityType.AtprotoActor, atprotoActor[EntityMetaKey.Selector])}
										prefetched={atprotoActor}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$parent}
				>
					{#snippet children(atprotoPost)}
						{#if atprotoPost != null}
							<div>
								<dt>Reply parent</dt>
								<dd>
									<AtprotoPostView
										selection={select(EntityType.AtprotoPost, atprotoPost[EntityMetaKey.Selector])}
										prefetched={atprotoPost}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$root}
				>
					{#snippet children(atprotoPost)}
						{#if atprotoPost != null}
							<div>
								<dt>Thread root</dt>
								<dd>
									<AtprotoPostView
										selection={select(EntityType.AtprotoPost, atprotoPost[EntityMetaKey.Selector])}
										prefetched={atprotoPost}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={atprotoPost}
				>
					{#snippet children(entity)}
						{@const createdAt = entity.createdAt}
						{#if createdAt != null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								indexedAt: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const indexedAt = entity.indexedAt}
						{#if indexedAt != null}
							<div>
								<dt>Indexed</dt>
								<dd>
									<Timestamp timestamp={Number(indexedAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								langs: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const langs = entity.langs}
						{#if langs != null}
							<div>
								<dt>Languages</dt>
								<dd>
									{langs.join(', ')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								selfLabelValues: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const selfLabelValues = entity.selfLabelValues}
						{#if selfLabelValues != null}
							<div>
								<dt>Self labels</dt>
								<dd>
									{selfLabelValues.join(', ')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<ResourceBoundary
			resource={atprotoPost}
		>
			{#snippet children(entity)}
				{@const text = entity.text}
				{#if text != null && text !== ''}
					<p data-text="long-text">{text}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const atprotoPostAtprotoPostsViewThreadResource = selection.$$thread}
		<ResourceBoundary
			resource={atprotoPostAtprotoPostsViewThreadResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AtprotoPostsView
						selection={atprotoPostAtprotoPostsViewThreadResource}
						countResource={atprotoPostAtprotoPostsViewThreadResource.count}
						title='Thread posts'
						href={
							resolve(
								'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/thread',
								{
									uri: encodeURIComponent(String(selection.entitySelector.uri)),
								}
							)
						}
						id='thread'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const atprotoPostAtprotoPostTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={atprotoPostAtprotoPostTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AtprotoPost_TimestampsView
						selection={atprotoPostAtprotoPostTimestampsViewTimestampsResource}
						countResource={atprotoPostAtprotoPostTimestampsViewTimestampsResource.count}
						title='Metric observations'
						href={
							resolve(
								'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations',
								{
									uri: encodeURIComponent(String(selection.entitySelector.uri)),
								}
							)
						}
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
