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
		title = 'UTXO blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.UtxoBlock>
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
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoBlock}
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
				height: true,
				hash: true,
				transactionCount: true,
				$network: true,
			},
		})
	}
	getResourceItems={(utxoBlocks) => [...new Map(utxoBlocks.values.map((utxoBlock) => [utxoBlock[EntityMetaKey.SelectorKey], utxoBlock])).values()]}
	getKey={(utxoBlock) => utxoBlock[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No UTXO blocks yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: utxoBlock })}
		{@const utxoBlockFields = { ...utxoBlock[EntityMetaKey.Selector], ...utxoBlock }}
		{@const selection = select(EntityType.UtxoBlock, utxoBlock[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const utxoBlockHrefFields = { ...utxoBlock, ...utxoBlock[EntityMetaKey.Selector] }}
		<UtxoBlockView
			selection={selection}
			prefetched={utxoBlockFields}
			href={
				(utxoBlockHrefFields.height !== undefined && utxoBlockHrefFields.hash !== undefined && utxoBlockHrefFields.$network !== undefined && utxoBlockHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
					blockNumber: String(utxoBlockHrefFields.height ?? ''),
					hash: String(utxoBlockHrefFields.hash ?? ''),
					network: String(caip2StringFromValue(utxoBlockHrefFields.$network.caip2) ?? ''),
				}) : utxoBlockHrefFields.height !== undefined && utxoBlockHrefFields.hash !== undefined && utxoBlockHrefFields.$network !== undefined && utxoBlockHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
					blockNumber: String(utxoBlockHrefFields.height ?? ''),
					hash: String(utxoBlockHrefFields.hash ?? ''),
					network: String(utxoBlockHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
