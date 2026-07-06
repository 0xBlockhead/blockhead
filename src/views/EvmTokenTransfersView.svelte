<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Token transfers',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTokenTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmTokenTransfer>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					indexInLog: true,
					standard: true,
					amount: true,
					tokenSymbol: true,
					tokenId: true,
					$log: true,
				},
				limit: 64,
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTokenTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmTokenTransfers)}
			{@const uniqueEvmTokenTransfers = [...new Map(evmTokenTransfers.values.map((evmTokenTransfer) => [evmTokenTransfer[EntityMetaKey.SelectorKey], evmTokenTransfer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmTokenTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmTokenTransfers.totalCount}
				getKey={(evmTokenTransfer) => evmTokenTransfer[EntityMetaKey.SelectorKey]}
				items={uniqueEvmTokenTransfers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Token transfers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmTokenTransfer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmTokenTransfer> })}
					{@const evmTokenTransferFields = { ...evmTokenTransfer[EntityMetaKey.Selector], ...evmTokenTransfer }}
					{@const evmTokenTransferHrefFields = { ...evmTokenTransfer, ...evmTokenTransfer[EntityMetaKey.Selector] }}
					<EvmTokenTransferView
						selection={select(EntityType.EvmTokenTransfer, evmTokenTransfer[EntityMetaKey.Selector])}
						prefetched={evmTokenTransferFields}
						href={
							(evmTokenTransferHrefFields.$log !== undefined && evmTokenTransferHrefFields.$log.$transaction !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network.caip2 !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network.caip2.namespace !== undefined && evmTokenTransferHrefFields.$log !== undefined && evmTokenTransferHrefFields.$log.$transaction !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network.caip2 !== undefined && evmTokenTransferHrefFields.$log.$transaction.$network.caip2.reference !== undefined && evmTokenTransferHrefFields.$log !== undefined && evmTokenTransferHrefFields.$log.$transaction !== undefined && evmTokenTransferHrefFields.$log.$transaction.txHash !== undefined && evmTokenTransferHrefFields.$log !== undefined && evmTokenTransferHrefFields.$log.indexInTransaction !== undefined && evmTokenTransferHrefFields.indexInLog !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/token-transfer/[indexInTransaction=nonNegativeInteger]/[indexInLog=nonNegativeInteger]', {
								caip2: `${String(evmTokenTransferHrefFields.$log.$transaction.$network.caip2.namespace ?? '')}:${String(evmTokenTransferHrefFields.$log.$transaction.$network.caip2.reference ?? '')}`,
								transactionId: String(evmTokenTransferHrefFields.$log.$transaction.txHash ?? ''),
								indexInTransaction: String(evmTokenTransferHrefFields.$log.indexInTransaction ?? ''),
								indexInLog: String(evmTokenTransferHrefFields.indexInLog ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmTokenTransfer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
