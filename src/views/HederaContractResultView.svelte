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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaContractResult>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractResult}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'consensusTimestamp' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result',
						{
							network: (
								'caip2' in transaction.$network ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							consensusTimestamp: transaction.consensusTimestamp,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<HederaTransactionView
						selection={select(EntityType.HederaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(hederaContract)}
					{#if hederaContract != null}
						{@const hederaContractInitial = untrack(() => hederaContract)}
						<div>
							<dt>contract</dt>
							<dd>
								<HederaContractView
									selection={select(EntityType.HederaContract, (hederaContract ?? hederaContractInitial)[EntityMetaKey.Selector])}
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
							contractId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractId = entity.contractId}
					{#if contractId != null}
						<div>
							<dt>contract ID</dt>
							<dd>
								{contractId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evmAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evmAddress = entity.evmAddress}
					{#if evmAddress != null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={evmAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ethereumHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ethereumHash = entity.ethereumHash}
					{#if ethereumHash != null}
						<div>
							<dt>ethereum hash</dt>
							<dd>
								<TruncatedValue value={ethereumHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							functionParameters: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const functionParameters = entity.functionParameters}
					{#if functionParameters != null}
						<div>
							<dt>function parameters</dt>
							<dd>
								{functionParameters}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasLimit = entity.gasLimit}
					{#if gasLimit != null}
						<div>
							<dt>gas limit</dt>
							<dd>
								{gasLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								{gasUsed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountTinybar: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountTinybar = entity.amountTinybar}
					{#if amountTinybar != null}
						<div>
							<dt>amount tinybar</dt>
							<dd>
								{amountTinybar}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							errorMessage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const errorMessage = entity.errorMessage}
					{#if errorMessage != null}
						<div>
							<dt>error message</dt>
							<dd>
								{errorMessage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bloom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bloom = entity.bloom}
					{#if bloom != null}
						<div>
							<dt>bloom</dt>
							<dd>
								{bloom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
