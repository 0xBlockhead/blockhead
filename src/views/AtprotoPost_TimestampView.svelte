<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(atproto)/atproto/post/[uri]', {
			uri: encodeURIComponent(entityId.$post.uri),
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoPost_Timestamp>
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

	const atprotoPostTimestamp = useEntity(
		EntityType.AtprotoPost_Timestamp,
		entityId,
		{
			$: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
			likeCount: {},
			repostCount: {},
			replyCount: {},
			quoteCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="AT Protocol post snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={entityId.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped AT Protocol post engagement counters resolved from app-view and XRPC post data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={atprotoPostTimestamp}
			placeholderText="Loading AT Protocol post snapshot..."
		>
			{#snippet children(atprotoPostTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Replies',
								value: atprotoPostTimestamp.replyCount,
							},
							{
								label: 'Reposts',
								value: atprotoPostTimestamp.repostCount,
							},
							{
								label: 'Likes',
								value: atprotoPostTimestamp.likeCount,
							},
							{
								label: 'Quotes',
								value: atprotoPostTimestamp.quoteCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
