<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoPost_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AtprotoPost_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const atprotoPostTimestamp = $derived(selection({
		fields: {
			likeCount: true,
			repostCount: true,
			replyCount: true,
			quoteCount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'AT Protocol post observation')
	const viewDomId = $derived('atproto-post-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(atproto)/atproto/post/[...uri]/(post)/observations/[timestampMs=nonNegativeInteger]', {
			uri: String(({ ...selection.entitySelector, ...prefetched }).$post.uri),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={atprotoPostTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={atprotoPostTimestamp}>
				{#snippet Pending()}
					{@const likeCount = prefetched.likeCount ?? selection.entitySelector.likeCount}
					{#if likeCount !== undefined && likeCount !== null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue value={Number(likeCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const likeCount = entity.likeCount ?? selection.entitySelector.likeCount ?? prefetched.likeCount}
					{#if likeCount !== undefined && likeCount !== null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue value={Number(likeCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={atprotoPostTimestamp}>
				{#snippet Pending()}
					{@const repostCount = prefetched.repostCount ?? selection.entitySelector.repostCount}
					{#if repostCount !== undefined && repostCount !== null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue value={Number(repostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const repostCount = entity.repostCount ?? selection.entitySelector.repostCount ?? prefetched.repostCount}
					{#if repostCount !== undefined && repostCount !== null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue value={Number(repostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={atprotoPostTimestamp}>
				{#snippet Pending()}
					{@const replyCount = prefetched.replyCount ?? selection.entitySelector.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue value={Number(replyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const replyCount = entity.replyCount ?? selection.entitySelector.replyCount ?? prefetched.replyCount}
					{#if replyCount !== undefined && replyCount !== null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue value={Number(replyCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={atprotoPostTimestamp}>
				{#snippet Pending()}
					{@const quoteCount = prefetched.quoteCount ?? selection.entitySelector.quoteCount}
					{#if quoteCount !== undefined && quoteCount !== null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue value={Number(quoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const quoteCount = entity.quoteCount ?? selection.entitySelector.quoteCount ?? prefetched.quoteCount}
					{#if quoteCount !== undefined && quoteCount !== null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue value={Number(quoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
