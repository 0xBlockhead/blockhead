<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(x)/x/user/[userId]', {
			userId: entityId.$user.id,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XUser_Timestamp>
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

	const xUserTimestamp = useEntity(
		EntityType.XUser_Timestamp,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.XUser_Timestamp]?.map((resolver) => resolver.source)
				?? [Source.Local_Internal]
			),
			followerCount: {},
			followingCount: {},
			tweetCount: {},
			listedCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.XUser_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="X user snapshot"
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
								value: xUserTimestamp.followerCount,
							},
							{
								label: 'Following',
								value: xUserTimestamp.followingCount,
							},
							{
								label: 'Posts',
								value: xUserTimestamp.tweetCount,
							},
							{
								label: 'Listed',
								value: xUserTimestamp.listedCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
