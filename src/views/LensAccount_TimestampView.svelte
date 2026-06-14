<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
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
			selector: EntitySelector<typeof schema, EntityType.LensAccount_Timestamp>
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
		selector,
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
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	title="Lens account snapshot"
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
