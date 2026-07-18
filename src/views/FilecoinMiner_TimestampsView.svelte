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
		title = 'Filecoin miner observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinMiner_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FilecoinMiner_Timestamp>
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
	import FilecoinMiner_TimestampView from '$/views/FilecoinMiner_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMiner_Timestamp}
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
				qualityAdjustedPower: true,
				height: true,
				tipsetKey: true,
				source: true,
				$miner: true,
			},
		})
	}
	getResourceItems={(filecoinMinerTimestamps) => [...new Map(filecoinMinerTimestamps.values.map((filecoinMinerTimestamp) => [filecoinMinerTimestamp[EntityMetaKey.SelectorKey], filecoinMinerTimestamp])).values()]}
	getKey={(filecoinMinerTimestamp) => filecoinMinerTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin miner observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinMinerTimestamp })}
		{@const filecoinMinerTimestampFields = { ...filecoinMinerTimestamp[EntityMetaKey.Selector], ...filecoinMinerTimestamp }}
		{@const selection = select(EntityType.FilecoinMiner_Timestamp, filecoinMinerTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const filecoinMinerTimestampHrefFields = { ...filecoinMinerTimestamp, ...filecoinMinerTimestamp[EntityMetaKey.Selector] }}
		<FilecoinMiner_TimestampView
			selection={selection}
			prefetched={filecoinMinerTimestampFields}
			href={
				(filecoinMinerTimestampHrefFields.height !== undefined && filecoinMinerTimestampHrefFields.tipsetKey !== undefined && filecoinMinerTimestampHrefFields.source !== undefined && filecoinMinerTimestampHrefFields.$miner !== undefined && filecoinMinerTimestampHrefFields.$miner.minerAddress !== undefined && filecoinMinerTimestampHrefFields.$miner.$network !== undefined && filecoinMinerTimestampHrefFields.$miner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
					height: String(filecoinMinerTimestampHrefFields.height ?? ''),
					tipsetKey: String(filecoinMinerTimestampHrefFields.tipsetKey ?? ''),
					source: String(filecoinMinerTimestampHrefFields.source ?? ''),
					minerAddress: String(filecoinMinerTimestampHrefFields.$miner.minerAddress ?? ''),
					network: String(caip2StringFromValue(filecoinMinerTimestampHrefFields.$miner.$network.caip2) ?? ''),
				}) : filecoinMinerTimestampHrefFields.height !== undefined && filecoinMinerTimestampHrefFields.tipsetKey !== undefined && filecoinMinerTimestampHrefFields.source !== undefined && filecoinMinerTimestampHrefFields.$miner !== undefined && filecoinMinerTimestampHrefFields.$miner.minerAddress !== undefined && filecoinMinerTimestampHrefFields.$miner.$network !== undefined && filecoinMinerTimestampHrefFields.$miner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', {
					height: String(filecoinMinerTimestampHrefFields.height ?? ''),
					tipsetKey: String(filecoinMinerTimestampHrefFields.tipsetKey ?? ''),
					source: String(filecoinMinerTimestampHrefFields.source ?? ''),
					minerAddress: String(filecoinMinerTimestampHrefFields.$miner.minerAddress ?? ''),
					network: String(filecoinMinerTimestampHrefFields.$miner.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
