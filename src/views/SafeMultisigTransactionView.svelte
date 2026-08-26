<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SafeMultisigTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SafeTransactionService_Rest,
		],
	}))
	const safeMultisigTransaction = $derived(viewSelection({
		fields: {
			value: true,
			operation: true,
			nonce: true,
			isExecuted: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.safeTxHash || 'Safe transaction')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.SafeMultisigTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/safe-tx/[safeTxHash=evmTxHash]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					safeTxHash: selection.entitySelector.safeTxHash,
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
		<TruncatedValue value={selection.entitySelector.safeTxHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={safeMultisigTransaction}>
			{#snippet children(entity)}
				{[entity.operation, String(entity.isExecuted)].filter(Boolean).join(' ') || selection.entitySelector.safeTxHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$safe}
		>
			{#snippet children(evmContract)}
				{@const evmContractInitial = untrack(() => evmContract)}
				<span data-text="muted">
					<EvmContractView
						selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
						prefetched={evmContract ?? evmContractInitial}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>To</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$to}
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
				<dt>Value</dt>
				<dd>
					<ResourceBoundary
						resource={safeMultisigTransaction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Operation</dt>
				<dd>
					<ResourceBoundary
						resource={safeMultisigTransaction}
					>
						{#snippet children(entity)}
							{entity.operation}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Nonce</dt>
				<dd>
					<ResourceBoundary
						resource={safeMultisigTransaction}
					>
						{#snippet children(entity)}
							{entity.nonce}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							data: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const data = entity.data}
					{#if data != null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue value={data} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							isSuccessful: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isSuccessful = entity.isSuccessful}
					{#if isSuccessful != null}
						<div>
							<dt>Successful</dt>
							<dd>
								{isSuccessful ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Confirmations required</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									confirmationsRequired: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.confirmationsRequired}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$proposer}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Proposer</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$executor}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						{@const evmAccountInitial = untrack(() => evmAccount)}
						<div>
							<dt>Executor</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$executionTransaction}
			>
				{#snippet children(evmTransaction)}
					{#if evmTransaction != null}
						{@const evmTransactionInitial = untrack(() => evmTransaction)}
						<div>
							<dt>Execution transaction</dt>
							<dd>
								<EvmTransactionView
									selection={select(EntityType.EvmTransaction, (evmTransaction ?? evmTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Submitted</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									submittedAtMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.submittedAtMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							executedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const executedAtMs = entity.executedAtMs}
					{#if executedAtMs != null}
						<div>
							<dt>Executed at</dt>
							<dd>
								<Timestamp timestamp={executedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
