<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CctpBurnFee_Timestamp>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CctpBurnFee_TimestampView from '$/views/CctpBurnFee_TimestampView.svelte'
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
				$sourceDomain: true,
				$destinationDomain: true,
				source: true,
			},
		})
	}
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
		{@const selection = select(EntityType.CctpBurnFee_Timestamp, cctpBurnFeeTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CctpBurnFee_TimestampView
			selection={selection}
			prefetched={cctpBurnFeeTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
