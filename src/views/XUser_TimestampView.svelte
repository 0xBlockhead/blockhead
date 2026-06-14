<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'


	// State
	let {
		selector,
		href,
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.XUser_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const xUserTimestamp = subscribe(EntityType.XUser_Timestamp,
		selector,
		({ fields: { followerCount: true, followingCount: true, tweetCount: true, listedCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.XUser_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="X user snapshot"
	{...EntityViewProps}
>
	{#snippet Value()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet Title()}
		<Timestamp timestamp={selector.timestampMs} />
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped X user counters resolved from enabled X-compatible profile sources.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={xUserTimestamp}
			placeholderText="Loading X user snapshot..."
		>
			{#snippet children(xUserTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: xUserTimestamp.fields.followerCount,
							},
							{
								label: 'Following',
								value: xUserTimestamp.fields.followingCount,
							},
							{
								label: 'Posts',
								value: xUserTimestamp.fields.tweetCount,
							},
							{
								label: 'Listed',
								value: xUserTimestamp.fields.listedCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
