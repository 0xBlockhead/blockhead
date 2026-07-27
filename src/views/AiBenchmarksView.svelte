<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
		>
			{#snippet Title()}
				{(aiBenchmark.label ?? '') || [(aiBenchmarkSelector.benchmarkId ?? ''), String(aiBenchmarkSelector.benchmarkUri ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
			{/snippet}

			{#snippet Value()}
				{(aiBenchmark.taskType ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(aiBenchmark.metricName ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
