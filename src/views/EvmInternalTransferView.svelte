<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmInternalCallType } from '$/constants/Evm.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: EntitySelectionViewProps<EntityType.EvmInternalTransfer> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockscout_Rest,
		],
	}))
	const evmInternalTransfer = $derived(viewSelection({
		fields: {
			value: true,
			callType: true,
			success: true,
		},
	}))
	const titleFallback = $derived((String(pendingEntity.indexInTransaction ?? '') ? 'Internal #' + String(pendingEntity.indexInTransaction ?? '') : '') || 'EVM internal transfer')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmInternalTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInTransaction ?? '')}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$transaction.$network ?
						String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2))
					:
						String(selection.entitySelector.$transaction.$network.slug)
				),
				transactionId: String(selection.entitySelector.$transaction.txHash),
				indexInTransaction: String(selection.entitySelector.indexInTransaction),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmInternalTransfer}>
			{#snippet children(entity)}
				{[entity.callType, String(entity.value)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{String(pendingEntity.indexInTransaction)}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Native currency moved inside EVM transaction execution.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in transaction</dt>
				<dd>
					<span>#</span>
					{String(pendingEntity.indexInTransaction)}
				</dd>
			</div>

			<div>
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Call type</dt>
				<dd>
					<ResourceBoundary
						resource={evmInternalTransfer}
					>
						{#snippet children(entity)}
							{entity.callType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmInternalTransfer}
			>
				{#snippet children(entity)}
					{@const success = entity.success}
					{#if success != null}
						<div>
							<dt>Success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Value</dt>
				<dd>
					<ResourceBoundary
						resource={evmInternalTransfer}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>From</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>To</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$createdContract}
				>
					{#snippet children(evmContract)}
						{#if evmContract != null}
							<div>
								<dt>Created contract</dt>
								<dd>
									<EvmContractView
										selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
										prefetched={evmContract}
										layout={EntityLayout.Value}
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
