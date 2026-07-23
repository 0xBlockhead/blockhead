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
		title = 'Blockhead Quilibrium account state observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumAccountState_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadQuilibriumAccountState_Timestamp>
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
	entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
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
				timestampMs: true,
				balance: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadQuilibriumAccountStateTimestamps) => [...new Map(blockheadQuilibriumAccountStateTimestamps.values.map((blockheadQuilibriumAccountStateTimestamp) => [blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.SelectorKey], blockheadQuilibriumAccountStateTimestamp])).values()]}
	getKey={(blockheadQuilibriumAccountStateTimestamp) => blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium account state observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumAccountStateTimestamp })}
		{@const blockheadQuilibriumAccountStateTimestampFields = { ...blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.Selector], ...blockheadQuilibriumAccountStateTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadQuilibriumAccountState_Timestamp}
			entitySelector={blockheadQuilibriumAccountStateTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadQuilibriumAccountStateTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium account state timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadQuilibriumAccountStateTimestampFields.balance) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadQuilibriumAccountStateTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
