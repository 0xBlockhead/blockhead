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
		title = 'Regulated asset profile observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RegulatedAssetProfile_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RegulatedAssetProfile_Timestamp>
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
	import RegulatedAssetProfile_TimestampView from '$/views/RegulatedAssetProfile_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RegulatedAssetProfile_Timestamp}
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
	getResourceItems={(regulatedAssetProfileTimestamps) => [...new Map(regulatedAssetProfileTimestamps.values.map((regulatedAssetProfileTimestamp) => [regulatedAssetProfileTimestamp[EntityMetaKey.SelectorKey], regulatedAssetProfileTimestamp])).values()]}
	getKey={(regulatedAssetProfileTimestamp) => regulatedAssetProfileTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Regulated asset profile observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: regulatedAssetProfileTimestamp })}
		{@const regulatedAssetProfileTimestampFields = { ...regulatedAssetProfileTimestamp[EntityMetaKey.Selector], ...regulatedAssetProfileTimestamp }}
		{@const selection = select(EntityType.RegulatedAssetProfile_Timestamp, regulatedAssetProfileTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<RegulatedAssetProfile_TimestampView
			selection={selection}
			prefetched={regulatedAssetProfileTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
