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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM internal transfers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmInternalTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmInternalTransfer>
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

{#snippet ModelTypeAnnotationTooltip()}
		<p>
			Native currency sent by internal <code>CALL</code> frames during execution, distinct from the signed envelope <code>value</code>.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmInternalTransfer}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Blockscout_Rest,
			],
			fields: {
				indexInTransaction: true,
				callType: true,
				value: true,
				success: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmInternalTransfers) => [...new Map(evmInternalTransfers.values.map((evmInternalTransfer) => [evmInternalTransfer[EntityMetaKey.SelectorKey], evmInternalTransfer])).values()]}
	getKey={(evmInternalTransfer) => evmInternalTransfer[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM internal transfers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmInternalTransfer })}
		{@const evmInternalTransferFields = { ...evmInternalTransfer[EntityMetaKey.Selector], ...evmInternalTransfer }}
		<EntityView
			entityType={EntityType.EvmInternalTransfer}
			entitySelector={evmInternalTransfer[EntityMetaKey.Selector]}
			href={
				(
					evmInternalTransfer[EntityMetaKey.Selector] != null && 'indexInTransaction' in evmInternalTransfer[EntityMetaKey.Selector]
					&& evmInternalTransfer[EntityMetaKey.Selector].indexInTransaction != null
					&& evmInternalTransfer[EntityMetaKey.Selector] != null && '$transaction' in evmInternalTransfer[EntityMetaKey.Selector]
					&& evmInternalTransfer[EntityMetaKey.Selector].$transaction != null && 'txHash' in evmInternalTransfer[EntityMetaKey.Selector].$transaction
					&& evmInternalTransfer[EntityMetaKey.Selector].$transaction.txHash != null
					&& evmInternalTransfer[EntityMetaKey.Selector].$transaction != null && '$network' in evmInternalTransfer[EntityMetaKey.Selector].$transaction ?
						evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network
						&& evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
						indexInTransaction: String(evmInternalTransfer[EntityMetaKey.Selector].indexInTransaction ?? ''),
						transactionId: String(evmInternalTransfer[EntityMetaKey.Selector].$transaction.txHash ?? ''),
						network: String(caip2StringFromValue(evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network
							&& evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
							indexInTransaction: String(evmInternalTransfer[EntityMetaKey.Selector].indexInTransaction ?? ''),
							transactionId: String(evmInternalTransfer[EntityMetaKey.Selector].$transaction.txHash ?? ''),
							network: String(evmInternalTransfer[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
				{(String((evmInternalTransferFields.indexInTransaction) ?? '') ? 'Internal #' + String((evmInternalTransferFields.indexInTransaction) ?? '') : '') || [String((evmInternalTransferFields.callType) ?? ''), String((evmInternalTransferFields.value) ?? '')].filter(Boolean).join(' ') || [(String((evmInternalTransferFields.indexInTransaction) ?? '') ? '#' + String((evmInternalTransferFields.indexInTransaction) ?? '') : '')].filter(Boolean).join(' ') || 'EVM internal transfer'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmInternalTransferFields.success) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
