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
		title = 'Blockhead session simulation logs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadSessionSimulationLogs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadSessionSimulationLog>
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
	entityType={EntityType.BlockheadSessionSimulationLog}
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
				logIndex: true,
				address: true,
				callPath: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadSessionSimulationLogs) => [...new Map(blockheadSessionSimulationLogs.values.map((blockheadSessionSimulationLog) => [blockheadSessionSimulationLog[EntityMetaKey.SelectorKey], blockheadSessionSimulationLog])).values()]}
	getKey={(blockheadSessionSimulationLog) => blockheadSessionSimulationLog[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead session simulation logs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadSessionSimulationLog })}
		{@const blockheadSessionSimulationLogFields = { ...blockheadSessionSimulationLog[EntityMetaKey.Selector], ...blockheadSessionSimulationLog }}
		<EntityView
			entityType={EntityType.BlockheadSessionSimulationLog}
			entitySelector={blockheadSessionSimulationLog[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadSessionSimulationLogFields.logIndex) ?? '')].filter(Boolean).join(' ') || 'blockhead session simulation log'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadSessionSimulationLogFields.address) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadSessionSimulationLogFields.callPath) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
