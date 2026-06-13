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


	// State
	let {
		entityId,
		href,
		layout = EntityLayout.Summary,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LensAccount_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const lensAccountTimestamp = subscribe(EntityType.LensAccount_Timestamp,
		entityId,
		({ sources: [
				Source.Lens_Graphql,
			], fields: { followerCount: true, followingCount: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.LensAccount_Timestamp}
	{entityId}
	href={href}
	{layout}
	bind:open
	title="Lens account snapshot"
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
			Timestamped Lens account counters resolved from Lens GraphQL account stats.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={lensAccountTimestamp}
			placeholderText="Loading Lens account snapshot..."
		>
			{#snippet children(lensAccountTimestamp)}
				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: lensAccountTimestamp.fields.followerCount,
							},
							{
								label: 'Following',
								value: lensAccountTimestamp.fields.followingCount,
							},
						]}
					/>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
