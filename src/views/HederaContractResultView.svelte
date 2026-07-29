<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HederaContractResult> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractResult}
	entitySelector={selection.entitySelector}
	title={title ?? 'hedera contract result'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hedera contract result
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<HederaTransactionView
						selection={select(EntityType.HederaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(hederaContract)}
					{#if hederaContract != null}
						<div>
							<dt>contract</dt>
							<dd>
								<HederaContractView
									selection={select(EntityType.HederaContract, hederaContract[EntityMetaKey.Selector])}
									prefetched={hederaContract}
									layout={EntityLayout.Value}
									open={false}
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
