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
		title = 'CCTP fast burn allowance observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CctpFastBurnAllowance_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CctpFastBurnAllowance_Timestamp>
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
	import CctpFastBurnAllowance_TimestampView from '$/views/CctpFastBurnAllowance_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpFastBurnAllowance_Timestamp}
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
				allowanceUsdc: true,
				source: true,
			},
		})
	}
	getResourceItems={(cctpFastBurnAllowanceTimestamps) => [...new Map(cctpFastBurnAllowanceTimestamps.values.map((cctpFastBurnAllowanceTimestamp) => [cctpFastBurnAllowanceTimestamp[EntityMetaKey.SelectorKey], cctpFastBurnAllowanceTimestamp])).values()]}
	getKey={(cctpFastBurnAllowanceTimestamp) => cctpFastBurnAllowanceTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No CCTP fast burn allowance observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cctpFastBurnAllowanceTimestamp })}
		{@const cctpFastBurnAllowanceTimestampFields = { ...cctpFastBurnAllowanceTimestamp[EntityMetaKey.Selector], ...cctpFastBurnAllowanceTimestamp }}
		{@const selection = select(EntityType.CctpFastBurnAllowance_Timestamp, cctpFastBurnAllowanceTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<CctpFastBurnAllowance_TimestampView
			selection={selection}
			prefetched={cctpFastBurnAllowanceTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
