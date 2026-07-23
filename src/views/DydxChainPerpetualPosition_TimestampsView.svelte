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
		title = 'dYdX chain perpetual position observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DydxChainPerpetualPosition_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.DydxChainPerpetualPosition_Timestamp>
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
	entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
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
				side: true,
			},
		})
	}
	{countResource}
	getResourceItems={(dydxChainPerpetualPositionTimestamps) => [...new Map(dydxChainPerpetualPositionTimestamps.values.map((dydxChainPerpetualPositionTimestamp) => [dydxChainPerpetualPositionTimestamp[EntityMetaKey.SelectorKey], dydxChainPerpetualPositionTimestamp])).values()]}
	getKey={(dydxChainPerpetualPositionTimestamp) => dydxChainPerpetualPositionTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Dydx chain perpetual position observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: dydxChainPerpetualPositionTimestamp })}
		{@const dydxChainPerpetualPositionTimestampFields = { ...dydxChainPerpetualPositionTimestamp[EntityMetaKey.Selector], ...dydxChainPerpetualPositionTimestamp }}
		<EntityView
			entityType={EntityType.DydxChainPerpetualPosition_Timestamp}
			entitySelector={dydxChainPerpetualPositionTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((dydxChainPerpetualPositionTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'dydx chain perpetual position timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((dydxChainPerpetualPositionTimestampFields.side) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
