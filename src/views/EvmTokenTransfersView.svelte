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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		countResource,
		title = 'Token transfers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTokenTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmTokenTransfer>
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
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		ERC-20, ERC-721, and ERC-1155 movements indexed from receipt logs on this transaction.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTokenTransfer}
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
				indexInLog: true,
				standard: true,
				amount: true,
				tokenSymbol: true,
				$log: true,
			},
			limit: 64,
		})
	}
	{countResource}
	getResourceItems={(evmTokenTransfers) => [...new Map(evmTokenTransfers.values.map((evmTokenTransfer) => [evmTokenTransfer[EntityMetaKey.SelectorKey], evmTokenTransfer])).values()]}
	getKey={(evmTokenTransfer) => evmTokenTransfer[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Token transfers yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmTokenTransfer })}
		{@const selection = select(EntityType.EvmTokenTransfer, evmTokenTransfer[EntityMetaKey.Selector])}
		<ProjectionBoundary
			resource={selection.Nft}
		>
			{#snippet Applicable()}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								Nft: {
									fields: {
										tokenId: true,
									},
								},
							},
						})
					}
				>
					{#snippet children(evmTokenTransferProjection0)}
						{@const evmTokenTransferFields = { ...evmTokenTransfer[EntityMetaKey.Selector], ...evmTokenTransfer, ...evmTokenTransferProjection0 }}
						<EntityView
							entityType={EntityType.EvmTokenTransfer}
							entitySelector={evmTokenTransfer[EntityMetaKey.Selector]}
							href={
								(
									evmTokenTransfer[EntityMetaKey.Selector] != null && 'indexInLog' in evmTokenTransfer[EntityMetaKey.Selector]
									&& evmTokenTransfer[EntityMetaKey.Selector].indexInLog != null
									&& evmTokenTransfer[EntityMetaKey.Selector] != null && '$log' in evmTokenTransfer[EntityMetaKey.Selector]
									&& evmTokenTransfer[EntityMetaKey.Selector].$log != null && 'indexInTransaction' in evmTokenTransfer[EntityMetaKey.Selector].$log
									&& evmTokenTransfer[EntityMetaKey.Selector].$log.indexInTransaction != null
									&& evmTokenTransfer[EntityMetaKey.Selector].$log != null && '$transaction' in evmTokenTransfer[EntityMetaKey.Selector].$log
									&& evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction != null && 'txHash' in evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction
									&& evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.txHash != null
									&& evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction != null && '$network' in evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction ?
										evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network != null && 'caip2' in evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network
										&& evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network.caip2 != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
										transferIndex: String(evmTokenTransfer[EntityMetaKey.Selector].indexInLog ?? ''),
										indexInTransaction: String(evmTokenTransfer[EntityMetaKey.Selector].$log.indexInTransaction ?? ''),
										transactionId: String(evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.txHash ?? ''),
										network: String(caip2StringFromValue(evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network.caip2) ?? ''),
									})
									:
											evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network != null && 'slug' in evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network
											&& evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network.slug != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
											transferIndex: String(evmTokenTransfer[EntityMetaKey.Selector].indexInLog ?? ''),
											indexInTransaction: String(evmTokenTransfer[EntityMetaKey.Selector].$log.indexInTransaction ?? ''),
											transactionId: String(evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.txHash ?? ''),
											network: String(evmTokenTransfer[EntityMetaKey.Selector].$log.$transaction.$network.slug ?? ''),
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
								{(String((evmTokenTransferFields.indexInLog) ?? '') ? 'Transfer #' + String((evmTokenTransferFields.indexInLog) ?? '') : '') || [String((evmTokenTransferFields.standard) ?? ''), String((evmTokenTransferFields.amount) ?? '')].filter(Boolean).join(' ') || [(String((evmTokenTransferFields.indexInLog) ?? '') ? '#' + String((evmTokenTransferFields.indexInLog) ?? '') : '')].filter(Boolean).join(' ') || 'Token transfer'}
							{/snippet}

							{#snippet HeadingAfter()}
								<span data-text="annotation">{[String((evmTokenTransferFields.tokenSymbol) ?? ''), String((evmTokenTransferFields.Nft.tokenId) ?? '')].filter(Boolean).join(' ')}</span>
							{/snippet}
						</EntityView>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
