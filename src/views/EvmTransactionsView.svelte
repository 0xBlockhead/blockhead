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
		title = 'EVM transactions',
		typeAnnotationParagraphs = ['A transaction submitted to or included in an EVM-compatible network.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmTransaction>
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
	entityType={EntityType.EvmTransaction}
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
				txHash: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmTransactions) => [...new Map(evmTransactions.values.map((evmTransaction) => [evmTransaction[EntityMetaKey.SelectorKey], evmTransaction])).values()]}
	getKey={(evmTransaction) => evmTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmTransaction })}
		{@const evmTransactionFields = { ...evmTransaction[EntityMetaKey.Selector], ...evmTransaction }}
		<EntityView
			entityType={EntityType.EvmTransaction}
			entitySelector={evmTransaction[EntityMetaKey.Selector]}
			href={
				(
					evmTransaction[EntityMetaKey.Selector] != null && 'txHash' in evmTransaction[EntityMetaKey.Selector]
					&& evmTransaction[EntityMetaKey.Selector].txHash != null
					&& evmTransaction[EntityMetaKey.Selector] != null && '$network' in evmTransaction[EntityMetaKey.Selector] ?
						evmTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in evmTransaction[EntityMetaKey.Selector].$network
						&& evmTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
						transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
						network: String(caip2StringFromValue(evmTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmTransaction[EntityMetaKey.Selector].$network != null && 'slug' in evmTransaction[EntityMetaKey.Selector].$network
							&& evmTransaction[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
							transactionId: String(evmTransaction[EntityMetaKey.Selector].txHash ?? ''),
							network: String(evmTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((evmTransactionFields.txHash) ?? '')].filter(Boolean).join(' ') || 'EVM transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((evmTransactionFields.txHash) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
