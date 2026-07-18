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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SorobanContractStorageEntry_Timestamp>
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
	import SorobanContractStorageEntry_TimestampView from '$/views/SorobanContractStorageEntry_TimestampView.svelte'
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
		{@const selection = select(EntityType.SorobanContractStorageEntry_Timestamp, sorobanContractStorageEntryTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SorobanContractStorageEntry_TimestampView
			selection={selection}
			prefetched={sorobanContractStorageEntryTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
