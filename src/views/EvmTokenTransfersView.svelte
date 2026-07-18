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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmTokenTransfer>
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
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTokenTransferView from '$/views/EvmTokenTransferView.svelte'
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
						{@const evmTokenTransferHrefFields = { ...evmTokenTransfer, ...evmTokenTransferProjection0, ...evmTokenTransfer[EntityMetaKey.Selector] }}
						<EvmTokenTransferView
							selection={selection}
							prefetched={evmTokenTransferFields}
							href={
								(evmTokenTransferHrefFields.indexInLog !== undefined && evmTokenTransferHrefFields.$log !== undefined && evmTokenTransferHrefFields.$log.indexInTransaction !== undefined && evmTokenTransferHrefFields.$log.$transaction !== undefined && evmTokenTransferHrefFields.$log.$transaction.txHash !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
									transferIndex: String(evmTokenTransferHrefFields.indexInLog ?? ''),
									indexInTransaction: String(evmTokenTransferHrefFields.$log.indexInTransaction ?? ''),
									transactionId: String(evmTokenTransferHrefFields.$log.$transaction.txHash ?? ''),
									network: String(caip2StringFromValue(evmTokenTransferHrefFields.$log.$transaction.$network.caip2) ?? ''),
								}) : evmTokenTransferHrefFields.indexInLog !== undefined && evmTokenTransferHrefFields.$log !== undefined && evmTokenTransferHrefFields.$log.indexInTransaction !== undefined && evmTokenTransferHrefFields.$log.$transaction !== undefined && evmTokenTransferHrefFields.$log.$transaction.txHash !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]/token-transfer/[transferIndex=nonNegativeInteger]', {
									transferIndex: String(evmTokenTransferHrefFields.indexInLog ?? ''),
									indexInTransaction: String(evmTokenTransferHrefFields.$log.indexInTransaction ?? ''),
									transactionId: String(evmTokenTransferHrefFields.$log.$transaction.txHash ?? ''),
									network: String(evmTokenTransferHrefFields.$log.$transaction.$network.slug ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
