<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoneroStealthOutput>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const moneroStealthOutput = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
		fields: {
			publicKey: true,
			commitment: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroStealthOutput}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.outputIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/stealth-output/[outputIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txHash,
					outputIndex: String(selection.entitySelector.outputIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.outputIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroStealthOutput}>
			{#snippet children(entity)}
				{@const publicKey = entity.publicKey}
				{#if publicKey != null}
					<TruncatedValue value={publicKey} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroStealthOutput}>
			{#snippet children(entity)}
				{@const commitment = entity.commitment}
				{#if commitment != null}
					<span data-text="muted">
						<TruncatedValue value={commitment} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<MoneroTransactionView
						selection={select(EntityType.MoneroTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Output index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.outputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={moneroStealthOutput}
			>
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={publicKey} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moneroStealthOutput}
			>
				{#snippet children(entity)}
					{@const commitment = entity.commitment}
					{#if commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue value={commitment} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
