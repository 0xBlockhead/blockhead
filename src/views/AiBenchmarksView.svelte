<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AiBenchmark> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiBenchmark}
	bind:open
	resource={
		selection({
			fields: {
				label: true,
				taskType: true,
				benchmarkId: true,
				benchmarkUri: true,
				metricName: true,
			},
		})
	}
>
	{#snippet Item({ item: aiBenchmark })}
		{@const aiBenchmarkSelector = aiBenchmark[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AiBenchmark}
			entitySelector={aiBenchmarkSelector}
			href={
				aiBenchmarkSelector.source !== undefined
				&& aiBenchmarkSelector.sourceBenchmarkId !== undefined ?
					resolve(
						'/(ai)/ai/benchmark/source/[source=stringSegment]/[sourceBenchmarkId=stringSegment]',
						{
							source: aiBenchmarkSelector.source,
							sourceBenchmarkId: aiBenchmarkSelector.sourceBenchmarkId,
						}
					)
				:
					aiBenchmarkSelector.benchmarkId !== undefined ?
						resolve(
							'/(ai)/ai/benchmark/id/[benchmarkId=stringSegment]',
							{
								benchmarkId: aiBenchmarkSelector.benchmarkId,
							}
						)
					:
						aiBenchmarkSelector.benchmarkUri !== undefined ?
							resolve(
								'/(ai)/ai/benchmark/uri/[benchmarkUri=absoluteUrl]',
								{
									benchmarkUri: encodeURIComponent(aiBenchmarkSelector.benchmarkUri),
								}
							)
						:
							undefined
			}
		>
			{#snippet Title()}
				{(aiBenchmark.label ?? '') || [(aiBenchmark.benchmarkId ?? ''), (aiBenchmark.benchmarkUri ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
			{/snippet}

			{#snippet Value()}
				{aiBenchmark.taskType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aiBenchmark.metricName ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
