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
		title = 'XRPL ledgers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'XrplLedgers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.XrplLedger>
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
	import XrplLedgerView from '$/views/XrplLedgerView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplLedger}
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
				ledgerIndex: true,
				$network: true,
			},
		})
	}
	getResourceItems={(xrplLedgers) => [...new Map(xrplLedgers.values.map((xrplLedger) => [xrplLedger[EntityMetaKey.SelectorKey], xrplLedger])).values()]}
	getKey={(xrplLedger) => xrplLedger[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No XRPL ledgers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: xrplLedger })}
		{@const xrplLedgerFields = { ...xrplLedger[EntityMetaKey.Selector], ...xrplLedger }}
		{@const selection = select(EntityType.XrplLedger, xrplLedger[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const xrplLedgerHrefFields = { ...xrplLedger, ...xrplLedger[EntityMetaKey.Selector] }}
		<XrplLedgerView
			selection={selection}
			prefetched={xrplLedgerFields}
			href={
				(xrplLedgerHrefFields.ledgerIndex !== undefined && xrplLedgerHrefFields.$network !== undefined && xrplLedgerHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
					ledgerIndex: String(xrplLedgerHrefFields.ledgerIndex ?? ''),
					network: String(caip2StringFromValue(xrplLedgerHrefFields.$network.caip2) ?? ''),
				}) : xrplLedgerHrefFields.ledgerIndex !== undefined && xrplLedgerHrefFields.$network !== undefined && xrplLedgerHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/ledger/[ledgerIndex=nonNegativeBigInt]', {
					ledgerIndex: String(xrplLedgerHrefFields.ledgerIndex ?? ''),
					network: String(xrplLedgerHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
