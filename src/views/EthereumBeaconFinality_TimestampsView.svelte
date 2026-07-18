<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Finality',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EthereumBeaconFinality_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EthereumBeaconFinality_Timestamp>
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
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
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
				finalizedCheckpointEpoch: true,
				timestampMs: true,
				$network: true,
			},
		})
	}
	getResourceItems={(ethereumBeaconFinalityTimestamps) => [...new Map(ethereumBeaconFinalityTimestamps.values.map((ethereumBeaconFinalityTimestamp) => [ethereumBeaconFinalityTimestamp[EntityMetaKey.SelectorKey], ethereumBeaconFinalityTimestamp])).values()]}
	getKey={(ethereumBeaconFinalityTimestamp) => ethereumBeaconFinalityTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Ethereum beacon finality observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: ethereumBeaconFinalityTimestamp })}
		{@const ethereumBeaconFinalityTimestampFields = { ...ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector], ...ethereumBeaconFinalityTimestamp }}
		{@const selection = select(EntityType.EthereumBeaconFinality_Timestamp, ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const ethereumBeaconFinalityTimestampHrefFields = { ...ethereumBeaconFinalityTimestamp, ...ethereumBeaconFinalityTimestamp[EntityMetaKey.Selector] }}
		<EthereumBeaconFinality_TimestampView
			selection={selection}
			prefetched={ethereumBeaconFinalityTimestampFields}
			href={
				(ethereumBeaconFinalityTimestampHrefFields.timestampMs !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(ethereumBeaconFinalityTimestampHrefFields.timestampMs ?? ''),
					network: String(caip2StringFromValue(ethereumBeaconFinalityTimestampHrefFields.$network.caip2) ?? ''),
				}) : ethereumBeaconFinalityTimestampHrefFields.timestampMs !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network !== undefined && ethereumBeaconFinalityTimestampHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(ethereumBeaconFinalityTimestampHrefFields.timestampMs ?? ''),
					network: String(ethereumBeaconFinalityTimestampHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
