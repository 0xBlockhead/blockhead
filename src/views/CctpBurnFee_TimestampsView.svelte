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
		title = 'CCTP burn fee observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CctpBurnFee_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CctpBurnFee_Timestamp>
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
	entityType={EntityType.CctpBurnFee_Timestamp}
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
				$sourceDomain: {
					fields: {
						name: true,
					},
				},
				$destinationDomain: {
					fields: {
						name: true,
					},
				},
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cctpBurnFeeTimestamps) => [...new Map(cctpBurnFeeTimestamps.values.map((cctpBurnFeeTimestamp) => [cctpBurnFeeTimestamp[EntityMetaKey.SelectorKey], cctpBurnFeeTimestamp])).values()]}
	getKey={(cctpBurnFeeTimestamp) => cctpBurnFeeTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No CCTP burn fee observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cctpBurnFeeTimestamp })}
		{@const cctpBurnFeeTimestampFields = { ...cctpBurnFeeTimestamp[EntityMetaKey.Selector], ...cctpBurnFeeTimestamp }}
		<EntityView
			entityType={EntityType.CctpBurnFee_Timestamp}
			entitySelector={cctpBurnFeeTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cctpBurnFeeTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'CCTP burn fee timestamp'}
			{/snippet}

			{#snippet Value()}
				{[[String((cctpBurnFeeTimestampFields.$sourceDomain.name) ?? '')].filter(Boolean).join(' ') || 'CCTP domain support', [String((cctpBurnFeeTimestampFields.$destinationDomain.name) ?? '')].filter(Boolean).join(' ') || 'CCTP domain support'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cctpBurnFeeTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
