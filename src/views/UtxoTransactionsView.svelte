<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'UTXO transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.UtxoTransaction>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoTransaction}
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
				txId: true,
				feeSats: true,
				isCoinbase: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(utxoTransactions) => [...new Map(utxoTransactions.values.map((utxoTransaction) => [utxoTransaction[EntityMetaKey.SelectorKey], utxoTransaction])).values()]}
	getKey={(utxoTransaction) => utxoTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No UTXO transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: utxoTransaction })}
		{@const utxoTransactionFields = { ...utxoTransaction[EntityMetaKey.Selector], ...utxoTransaction }}
		<EntityView
			entityType={EntityType.UtxoTransaction}
			entitySelector={utxoTransaction[EntityMetaKey.Selector]}
			href={
				(
					utxoTransaction[EntityMetaKey.Selector] != null && 'txId' in utxoTransaction[EntityMetaKey.Selector]
					&& utxoTransaction[EntityMetaKey.Selector].txId != null
					&& utxoTransaction[EntityMetaKey.Selector] != null && '$network' in utxoTransaction[EntityMetaKey.Selector] ?
						utxoTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in utxoTransaction[EntityMetaKey.Selector].$network
						&& utxoTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
						transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
						network: String(caip2StringFromValue(utxoTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							utxoTransaction[EntityMetaKey.Selector].$network != null && 'slug' in utxoTransaction[EntityMetaKey.Selector].$network
							&& utxoTransaction[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
							network: String(utxoTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((utxoTransactionFields.txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((utxoTransactionFields.txId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((utxoTransactionFields.feeSats) ?? ''), String((utxoTransactionFields.isCoinbase) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
