<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosInternalOperation> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosInternalOperation}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>parent operation</dt>
				<dd>
					<TezosOperationView
						selection={select(EntityType.TezosOperation, selection.entitySelector.$parentOperation)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>internal index</dt>
				<dd>
					{selection.entitySelector.internalIndex}
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
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nonce = entity.nonce}
					{#if nonce != null}
						<div>
							<dt>nonce</dt>
							<dd>
								{nonce}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resultStatus = entity.resultStatus}
					{#if resultStatus != null}
						<div>
							<dt>result status</dt>
							<dd>
								{resultStatus}
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
		</dl>
	{/snippet}
</EntityView>
