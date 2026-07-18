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
		title = 'XRPL transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XrplTransaction>
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
	import XrplTransactionView from '$/views/XrplTransactionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTransaction}
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
				hash: true,
				$network: true,
			},
		})
	}
	getResourceItems={(xrplTransactions) => [...new Map(xrplTransactions.values.map((xrplTransaction) => [xrplTransaction[EntityMetaKey.SelectorKey], xrplTransaction])).values()]}
	getKey={(xrplTransaction) => xrplTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplTransaction })}
		{@const xrplTransactionFields = { ...xrplTransaction[EntityMetaKey.Selector], ...xrplTransaction }}
		{@const selection = select(EntityType.XrplTransaction, xrplTransaction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xrplTransactionHrefFields = { ...xrplTransaction, ...xrplTransaction[EntityMetaKey.Selector] }}
		<XrplTransactionView
			selection={selection}
			prefetched={xrplTransactionFields}
			href={
				(xrplTransactionHrefFields.hash !== undefined && xrplTransactionHrefFields.$network !== undefined && xrplTransactionHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/transaction/[hash=stringSegment]', {
					hash: String(xrplTransactionHrefFields.hash ?? ''),
					network: String(caip2StringFromValue(xrplTransactionHrefFields.$network.caip2) ?? ''),
				}) : xrplTransactionHrefFields.hash !== undefined && xrplTransactionHrefFields.$network !== undefined && xrplTransactionHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/transaction/[hash=stringSegment]', {
					hash: String(xrplTransactionHrefFields.hash ?? ''),
					network: String(xrplTransactionHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
