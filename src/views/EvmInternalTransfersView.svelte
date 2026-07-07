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
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM internal transfers',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmInternalTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmInternalTransfer>
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
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'
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

{#if open}
	<ResourceBoundary
		resource={
			selection({
				sources: [
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
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmInternalTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmInternalTransfers)}
			{@const uniqueEvmInternalTransfers = [...new Map(evmInternalTransfers.values.map((evmInternalTransfer) => [evmInternalTransfer[EntityMetaKey.SelectorKey], evmInternalTransfer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmInternalTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmInternalTransfers.totalCount}
				getKey={(evmInternalTransfer) => evmInternalTransfer[EntityMetaKey.SelectorKey]}
				items={uniqueEvmInternalTransfers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM internal transfers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmInternalTransfer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmInternalTransfer> })}
					{@const evmInternalTransferFields = { ...evmInternalTransfer[EntityMetaKey.Selector], ...evmInternalTransfer }}
					{@const evmInternalTransferHrefFields = { ...evmInternalTransfer, ...evmInternalTransfer[EntityMetaKey.Selector] }}
					<EvmInternalTransferView
						selection={select(EntityType.EvmInternalTransfer, evmInternalTransfer[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmInternalTransferFields}
						href={
							(evmInternalTransferHrefFields.$transaction !== undefined && evmInternalTransferHrefFields.$transaction.$network !== undefined && evmInternalTransferHrefFields.$transaction.$network.caip2 !== undefined && evmInternalTransferHrefFields.$transaction.$network.caip2.namespace !== undefined && evmInternalTransferHrefFields.$transaction !== undefined && evmInternalTransferHrefFields.$transaction.$network !== undefined && evmInternalTransferHrefFields.$transaction.$network.caip2 !== undefined && evmInternalTransferHrefFields.$transaction.$network.caip2.reference !== undefined && evmInternalTransferHrefFields.$transaction !== undefined && evmInternalTransferHrefFields.$transaction.txHash !== undefined && evmInternalTransferHrefFields.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(evmInternalTransferHrefFields.$transaction.$network.caip2.namespace ?? '')}:${String(evmInternalTransferHrefFields.$transaction.$network.caip2.reference ?? '')}`,
								transactionId: String(evmInternalTransferHrefFields.$transaction.txHash ?? ''),
								indexInTransaction: String(evmInternalTransferHrefFields.indexInTransaction ?? ''),
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
		entityType={EntityType.EvmInternalTransfer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
