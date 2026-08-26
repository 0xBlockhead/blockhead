<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmStateChange> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const evmStateChange = $derived(selection({
		fields: {
			kind: true,
			isMiner: true,
		},
	}))
	const titleFallback = $derived((prefetched.kind ?? '') || 'EVM state change')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmStateChange}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/state-change/[stateChangeKey=stringSegment]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txHash,
					stateChangeKey: encodeURIComponent(selection.entitySelector.stateChangeKey),
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
		<ResourceBoundary resource={evmStateChange}>
			{#snippet children(entity)}
				{entity.kind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.stateChangeKey} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmStateChange}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.isMiner ? 'Yes' : 'No'}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<EvmTransactionView
						selection={select(EntityType.EvmTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Account</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$account}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Kind</dt>
				<dd>
					<ResourceBoundary
						resource={evmStateChange}
					>
						{#snippet children(entity)}
							{entity.kind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$tokenContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Token contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								<NumberValue
									value={tokenId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							balanceBefore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceBefore = entity.balanceBefore}
					{#if balanceBefore != null}
						<div>
							<dt>Balance before</dt>
							<dd>
								<NumberValue
									value={balanceBefore}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balanceAfter: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceAfter = entity.balanceAfter}
					{#if balanceAfter != null}
						<div>
							<dt>Balance after</dt>
							<dd>
								<NumberValue
									value={balanceAfter}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delta: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delta = entity.delta}
					{#if delta != null}
						<div>
							<dt>Delta</dt>
							<dd>
								<NumberValue
									value={delta}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Miner</dt>
				<dd>
					<ResourceBoundary
						resource={evmStateChange}
					>
						{#snippet children(entity)}
							{entity.isMiner ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
