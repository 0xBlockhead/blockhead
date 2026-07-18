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
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Filecoin miners',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinMiners-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.FilecoinMiner>
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
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinMiner}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: [
				Source.Lotus_JsonRpc,
			],
			fields: {
				minerAddress: true,
				$network: true,
			},
		})
	}
	getResourceItems={(filecoinMiners) => [...new Map(filecoinMiners.values.map((filecoinMiner) => [filecoinMiner[EntityMetaKey.SelectorKey], filecoinMiner])).values()]}
	getKey={(filecoinMiner) => filecoinMiner[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin miners yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinMiner })}
		{@const filecoinMinerFields = { ...filecoinMiner[EntityMetaKey.Selector], ...filecoinMiner }}
		{@const selection = select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const filecoinMinerHrefFields = { ...filecoinMiner, ...filecoinMiner[EntityMetaKey.Selector] }}
		<FilecoinMinerView
			selection={selection}
			prefetched={filecoinMinerFields}
			href={
				(filecoinMinerHrefFields.minerAddress !== undefined && filecoinMinerHrefFields.$network !== undefined && filecoinMinerHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
					minerAddress: String(filecoinMinerHrefFields.minerAddress ?? ''),
					network: String(caip2StringFromValue(filecoinMinerHrefFields.$network.caip2) ?? ''),
				}) : filecoinMinerHrefFields.minerAddress !== undefined && filecoinMinerHrefFields.$network !== undefined && filecoinMinerHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
					minerAddress: String(filecoinMinerHrefFields.minerAddress ?? ''),
					network: String(filecoinMinerHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
