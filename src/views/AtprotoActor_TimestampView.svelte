<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(atproto)/atproto/actor/[did]', {
			did: 'did' in entityId.$actor ?
				entityId.$actor.did
			:
				entityId.$actor.handle,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoActor_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const atprotoActorTimestamp = subscribe(EntityType.AtprotoActor_Timestamp,
		entityId,
		({ sources: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			], fields: { followersCount: true, followsCount: true, postsCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoActor_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="AT Protocol actor snapshot"
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
			Timestamped AT Protocol profile counters resolved from app-view and XRPC profile data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={atprotoActorTimestamp}
			placeholderText="Loading AT Protocol actor snapshot..."
		>
			{#snippet children(atprotoActorTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: atprotoActorTimestamp.fields.followersCount,
							},
							{
								label: 'Following',
								value: atprotoActorTimestamp.fields.followsCount,
							},
							{
								label: 'Posts',
								value: atprotoActorTimestamp.fields.postsCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
