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
		title = 'Soroban contract storage entry observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SorobanContractStorageEntry_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SorobanContractStorageEntry_Timestamp>
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
	entityType={EntityType.SorobanContractStorageEntry_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	{countResource}
	getResourceItems={(sorobanContractStorageEntryTimestamps) => [...new Map(sorobanContractStorageEntryTimestamps.values.map((sorobanContractStorageEntryTimestamp) => [sorobanContractStorageEntryTimestamp[EntityMetaKey.SelectorKey], sorobanContractStorageEntryTimestamp])).values()]}
	getKey={(sorobanContractStorageEntryTimestamp) => sorobanContractStorageEntryTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Soroban contract storage entry observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: sorobanContractStorageEntryTimestamp })}
		{@const sorobanContractStorageEntryTimestampFields = { ...sorobanContractStorageEntryTimestamp[EntityMetaKey.Selector], ...sorobanContractStorageEntryTimestamp }}
		<EntityView
			entityType={EntityType.SorobanContractStorageEntry_Timestamp}
			entitySelector={sorobanContractStorageEntryTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'soroban contract storage entry timestamp'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
