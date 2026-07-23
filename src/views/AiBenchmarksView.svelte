<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'AI benchmarks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AiBenchmarks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AiBenchmark>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AiBenchmark}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				label: true,
				taskType: true,
				benchmarkId: true,
				benchmarkUri: true,
				metricName: true,
			},
		})
	}
	{countResource}
	getResourceItems={(aiBenchmarks) => [...new Map(aiBenchmarks.values.map((aiBenchmark) => [aiBenchmark[EntityMetaKey.SelectorKey], aiBenchmark])).values()]}
	getKey={(aiBenchmark) => aiBenchmark[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No AI benchmarks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: aiBenchmark })}
		{@const aiBenchmarkFields = { ...aiBenchmark[EntityMetaKey.Selector], ...aiBenchmark }}
		<EntityView
			entityType={EntityType.AiBenchmark}
			entitySelector={aiBenchmark[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((aiBenchmarkFields.label) ?? '')].filter(Boolean).join(' ') || [String((aiBenchmarkFields.benchmarkId) ?? ''), String((aiBenchmarkFields.benchmarkUri) ?? '')].filter(Boolean).join(' ') || 'AI benchmark'}
			{/snippet}

			{#snippet Value()}
				{[String((aiBenchmarkFields.taskType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((aiBenchmarkFields.metricName) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
