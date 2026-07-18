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
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaTransaction>
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
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTransaction}
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
				signature: true,
				status: true,
				$network: true,
			},
		})
	}
	getResourceItems={(solanaTransactions) => [...new Map(solanaTransactions.values.map((solanaTransaction) => [solanaTransaction[EntityMetaKey.SelectorKey], solanaTransaction])).values()]}
	getKey={(solanaTransaction) => solanaTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaTransaction })}
		{@const solanaTransactionFields = { ...solanaTransaction[EntityMetaKey.Selector], ...solanaTransaction }}
		{@const selection = select(EntityType.SolanaTransaction, solanaTransaction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const solanaTransactionHrefFields = { ...solanaTransaction, ...solanaTransaction[EntityMetaKey.Selector] }}
		<SolanaTransactionView
			selection={selection}
			prefetched={solanaTransactionFields}
			href={
				(solanaTransactionHrefFields.signature !== undefined && solanaTransactionHrefFields.$network !== undefined && solanaTransactionHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
					transactionId: String(solanaTransactionHrefFields.signature ?? ''),
					network: String(caip2StringFromValue(solanaTransactionHrefFields.$network.caip2) ?? ''),
				}) : solanaTransactionHrefFields.signature !== undefined && solanaTransactionHrefFields.$network !== undefined && solanaTransactionHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
					transactionId: String(solanaTransactionHrefFields.signature ?? ''),
					network: String(solanaTransactionHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
