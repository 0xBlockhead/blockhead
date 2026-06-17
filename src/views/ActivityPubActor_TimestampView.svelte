<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = (
			'localAccountId' in selector.$actor ?
				resolve('/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]', {
					instanceOrigin: encodeURIComponent(selector.$actor.instanceOrigin),
					localAccountId: selector.$actor.localAccountId,
				})
			:
				undefined
		),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ActivityPubActor_Timestamp>
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
	entityType={EntityType.ActivityPubActor_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="ActivityPub actor snapshot"
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
			Timestamped ActivityPub actor counters resolved from provider-visible Mastodon-compatible account data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.ActivityPubActor_Timestamp,
					selector,
					({
						sources: [
							Source.Mastodon_Rest,
							Source.Fedi_Rest,
						],
						fields: {
							followersCount: true,
							followingCount: true,
							statusesCount: true,
						},
					}),
				)}
			placeholderText="Loading ActivityPub actor snapshot..."
		>
			{#snippet children(activityPubActorTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: activityPubActorTimestamp.fields.followersCount,
							},
							{
								label: 'Following',
								value: activityPubActorTimestamp.fields.followingCount,
							},
							{
								label: 'Statuses',
								value: activityPubActorTimestamp.fields.statusesCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
