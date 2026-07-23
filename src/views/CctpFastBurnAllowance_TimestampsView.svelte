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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CctpFastBurnAllowance_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.CctpFastBurnAllowance_Timestamp}
			entitySelector={cctpFastBurnAllowanceTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((cctpFastBurnAllowanceTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'CCTP fast burn allowance timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((cctpFastBurnAllowanceTimestampFields.allowanceUsdc) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((cctpFastBurnAllowanceTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
