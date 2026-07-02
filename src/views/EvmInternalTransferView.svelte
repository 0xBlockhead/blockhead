<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmInternalCallType } from '$/constants/Evm.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmInternalTransfer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmInternalTransfer>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const evmInternalTransfer = $derived(selection({
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			value: true,
			callType: true,
			success: true,
			$from: true,
			$to: true,
			...(open && {
				$createdContract: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Internal #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || 'EVM internal transfer')
	const viewDomId = $derived('evm-internal-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmInternalTransfer}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$transaction.$network.caip2.reference)}`,
			transactionId: String(({ ...selection.entitySelector, ...prefetched }).$transaction.txHash),
			indexInTransaction: String(({ ...selection.entitySelector, ...prefetched }).indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{(String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Internal #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || title || ['#' + String((selection.entitySelector.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'EVM internal transfer'}
		{:else}
			<ResourceBoundary resource={evmInternalTransfer}>
				{#snippet Pending()}
					{(String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') ? 'Internal #' + String((({ ...selection.entitySelector, ...prefetched }).indexInTransaction) ?? '') : '') || title || ['#' + String((selection.entitySelector.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'EVM internal transfer'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.callType) ?? ''), String((entity.value) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInTransaction}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Native currency moved inside EVM transaction execution.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${String(selection.entitySelector.$transaction.$network.caip2.namespace)}:${String(selection.entitySelector.$transaction.$network.caip2.reference)}`,
								transactionId: String(selection.entitySelector.$transaction.txHash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={evmInternalTransfer}>
				{#snippet Pending()}
					{@const success = prefetched.success ?? selection.entitySelector.success}
					{#if success !== undefined && success !== null}
						<div>
							<dt>Success</dt>
							<dd>
								{String((success) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const success = entity.success ?? selection.entitySelector.success ?? prefetched.success}
					{#if success !== undefined && success !== null}
						<div>
							<dt>Success</dt>
							<dd>
								{String((success) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$from')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$to')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$createdContract')}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null}
							<div>
								<dt>Created contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract.entitySelector)}
										prefetched={evmContract}
										href={
											resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
												caip2: `${String(evmContract.entitySelector.$network.caip2.namespace)}:${String(evmContract.entitySelector.$network.caip2.reference)}`,
												address: String(evmContract.entitySelector.address),
											})
										}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}
</EntityView>
