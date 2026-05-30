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
		href = resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
			instanceOrigin: encodeURIComponent(entityId.$actor.instanceOrigin),
			localAccountId: entityId.$actor.localAccountId,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActivityPubActor_Timestamp>
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

	const activityPubActorTimestamp = useEntity(
		EntityType.ActivityPubActor_Timestamp,
		entityId,
		{
			$: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
			followersCount: {},
			followingCount: {},
			statusesCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.ActivityPubActor_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="ActivityPub actor snapshot"
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
			Timestamped ActivityPub actor counters resolved from provider-visible Mastodon-compatible account data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={activityPubActorTimestamp}
			placeholderText="Loading ActivityPub actor snapshot..."
		>
			{#snippet children(activityPubActorTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: activityPubActorTimestamp.followersCount,
							},
							{
								label: 'Following',
								value: activityPubActorTimestamp.followingCount,
							},
							{
								label: 'Statuses',
								value: activityPubActorTimestamp.statusesCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
