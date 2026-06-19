<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/(social)/(atproto)/atproto/post/[...uri]', {
			uri: encodeURIComponent(selection.entitySelector.$post.uri),
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoPost_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost_Timestamp}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	title="AT Protocol post snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped AT Protocol post engagement counters resolved from app-view and XRPC post data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.Atproto_Xrpc,						], fields: { likeCount: true, repostCount: true, replyCount: true, quoteCount: true } }),
				)}
			placeholderText="Loading AT Protocol post snapshot..."
		>
			{#snippet children(atprotoPostTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Replies',
								value: atprotoPostTimestamp.fields.replyCount,
							},
							{
								label: 'Reposts',
								value: atprotoPostTimestamp.fields.repostCount,
							},
							{
								label: 'Likes',
								value: atprotoPostTimestamp.fields.likeCount,
							},
							{
								label: 'Quotes',
								value: atprotoPostTimestamp.fields.quoteCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
