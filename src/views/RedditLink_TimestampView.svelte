<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RedditLink_Timestamp>, 'prefetched'> = $props()

	const redditLinkTimestamp = $derived(selection({
		fields: {
			score: true,
			commentCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditLink_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={redditLinkTimestamp}>
			{#snippet children(entity)}
				{@const score = entity.score}
				{#if score != null}
					<NumberValue
						value={score}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={redditLinkTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{selection.entitySelector.source}
				</span>
				{@const commentCount = entity.commentCount}
				{#if commentCount != null}
					<span data-text="muted">
						<NumberValue
							value={commentCount}
						/>

						<span> comments</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={redditLinkTimestamp}
			>
				{#snippet children(entity)}
					{@const score = entity.score}
					{#if score != null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue
									value={score}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={redditLinkTimestamp}
			>
				{#snippet children(entity)}
					{@const commentCount = entity.commentCount}
					{#if commentCount != null}
						<div>
							<dt>Comments</dt>
							<dd>
								<NumberValue
									value={commentCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Submission</dt>
				<dd>
					<RedditLinkView
						selection={select(EntityType.RedditLink, selection.entitySelector.$link)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
