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
		title = 'Hedera network supply observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'HederaNetworkSupply_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.HederaNetworkSupply_Timestamp>
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
	import HederaNetworkSupply_TimestampView from '$/views/HederaNetworkSupply_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNetworkSupply_Timestamp}
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
	getResourceItems={(hederaNetworkSupplyTimestamps) => [...new Map(hederaNetworkSupplyTimestamps.values.map((hederaNetworkSupplyTimestamp) => [hederaNetworkSupplyTimestamp[EntityMetaKey.SelectorKey], hederaNetworkSupplyTimestamp])).values()]}
	getKey={(hederaNetworkSupplyTimestamp) => hederaNetworkSupplyTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Hedera network supply observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: hederaNetworkSupplyTimestamp })}
		{@const hederaNetworkSupplyTimestampFields = { ...hederaNetworkSupplyTimestamp[EntityMetaKey.Selector], ...hederaNetworkSupplyTimestamp }}
		{@const selection = select(EntityType.HederaNetworkSupply_Timestamp, hederaNetworkSupplyTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<HederaNetworkSupply_TimestampView
			selection={selection}
			prefetched={hederaNetworkSupplyTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
