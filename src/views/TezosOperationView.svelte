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
	}: EntitySelectionViewProps<EntityType.TezosOperation> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosOperationGroupView from '$/views/TezosOperationGroupView.svelte'
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosOperation}
	entitySelector={selection.entitySelector}
	title={title ?? 'tezos operation'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos operation
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>operation group</dt>
				<dd>
					<TezosOperationGroupView
						selection={select(EntityType.TezosOperationGroup, selection.entitySelector.$operationGroup)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>content index</dt>
				<dd>
					{selection.entitySelector.contentIndex}
				</dd>
			</div>

			<div>
				<dt>operation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.operationKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceAddress = entity.sourceAddress}
					{#if sourceAddress != null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={sourceAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationAddress = entity.destinationAddress}
					{#if destinationAddress != null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={destinationAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegateAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegateAddress = entity.delegateAddress}
					{#if delegateAddress != null}
						<div>
							<dt>delegate address</dt>
							<dd>
								<TruncatedValue value={delegateAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress}
					{#if contractAddress != null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							counter: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const counter = entity.counter}
					{#if counter != null}
						<div>
							<dt>counter</dt>
							<dd>
								{counter}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeMutez = entity.feeMutez}
					{#if feeMutez != null}
						<div>
							<dt>fee mutez</dt>
							<dd>
								{feeMutez}
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
							storageLimit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageLimit = entity.storageLimit}
					{#if storageLimit != null}
						<div>
							<dt>storage limit</dt>
							<dd>
								{storageLimit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountMutez: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountMutez = entity.amountMutez}
					{#if amountMutez != null}
						<div>
							<dt>amount mutez</dt>
							<dd>
								{amountMutez}
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
							consumedGas: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consumedGas = entity.consumedGas}
					{#if consumedGas != null}
						<div>
							<dt>consumed gas</dt>
							<dd>
								{consumedGas}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storageSize = entity.storageSize}
					{#if storageSize != null}
						<div>
							<dt>storage size</dt>
							<dd>
								{storageSize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paidStorageSizeDiff: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const paidStorageSizeDiff = entity.paidStorageSizeDiff}
					{#if paidStorageSizeDiff != null}
						<div>
							<dt>paid storage size diff</dt>
							<dd>
								{paidStorageSizeDiff}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>originated contract addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									originatedContractAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.originatedContractAddresses.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tezosBlock)}
					{#if tezosBlock != null}
						<div>
							<dt>block</dt>
							<dd>
								<TezosBlockView
									selection={select(EntityType.TezosBlock, tezosBlock[EntityMetaKey.Selector])}
									prefetched={tezosBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
