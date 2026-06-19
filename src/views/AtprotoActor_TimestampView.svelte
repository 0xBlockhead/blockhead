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
		href = resolve('/(social)/(atproto)/atproto/actor/[did]', {
			did: 'did' in selection.entitySelector.$actor ?
				selection.entitySelector.$actor.did
			:
				selection.entitySelector.$actor.handle,
		}),
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AtprotoActor_Timestamp>
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
	entityType={EntityType.AtprotoActor_Timestamp}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	title="AT Protocol actor snapshot"
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
			Timestamped AT Protocol profile counters resolved from app-view and XRPC profile data.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { sources: [
				Source.Atproto_Xrpc,			], fields: { followersCount: true, followsCount: true, postsCount: true } })}
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
