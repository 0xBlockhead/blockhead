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
		title = 'Filecoin sector observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinSector_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FilecoinSector_Timestamp>
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
	entityType={EntityType.FilecoinSector_Timestamp}
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
				$sector: {
					fields: {
						$miner: true,
						sealedCid: true,
					},
				},
				height: true,
			},
		})
	}
	{countResource}
	getResourceItems={(filecoinSectorTimestamps) => [...new Map(filecoinSectorTimestamps.values.map((filecoinSectorTimestamp) => [filecoinSectorTimestamp[EntityMetaKey.SelectorKey], filecoinSectorTimestamp])).values()]}
	getKey={(filecoinSectorTimestamp) => filecoinSectorTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin sector observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinSectorTimestamp })}
		{@const filecoinSectorTimestampFields = { ...filecoinSectorTimestamp[EntityMetaKey.Selector], ...filecoinSectorTimestamp }}
		<EntityView
			entityType={EntityType.FilecoinSector_Timestamp}
			entitySelector={filecoinSectorTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((filecoinSectorTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin sector timestamp'}
			{/snippet}

			{#snippet Value()}
				{[[String((filecoinSectorTimestampFields.$sector.sectorNumber) ?? '')].filter(Boolean).join(' ') || 'filecoin sector'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((filecoinSectorTimestampFields.height) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
