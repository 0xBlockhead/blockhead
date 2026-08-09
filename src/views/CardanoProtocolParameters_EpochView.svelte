<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.CardanoProtocolParameters_Epoch>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoProtocolParameters_Epoch}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano protocol parameters epoch'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/protocol-parameters/[epoch=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					epoch: String(selection.entitySelector.epoch),
					source: selection.entitySelector.source,
				}
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
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					{selection.entitySelector.epoch}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minFeeA: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minFeeA = entity.minFeeA}
					{#if minFeeA != null}
						<div>
							<dt>min fee a</dt>
							<dd>
								{minFeeA}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minFeeB: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minFeeB = entity.minFeeB}
					{#if minFeeB != null}
						<div>
							<dt>min fee b</dt>
							<dd>
								{minFeeB}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxBlockBodySize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxBlockBodySize = entity.maxBlockBodySize}
					{#if maxBlockBodySize != null}
						<div>
							<dt>max block body size</dt>
							<dd>
								{maxBlockBodySize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxTxSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxTxSize = entity.maxTxSize}
					{#if maxTxSize != null}
						<div>
							<dt>max transaction size</dt>
							<dd>
								{maxTxSize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxBlockHeaderSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxBlockHeaderSize = entity.maxBlockHeaderSize}
					{#if maxBlockHeaderSize != null}
						<div>
							<dt>max block header size</dt>
							<dd>
								{maxBlockHeaderSize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							keyDeposit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyDeposit = entity.keyDeposit}
					{#if keyDeposit != null}
						<div>
							<dt>key deposit</dt>
							<dd>
								{keyDeposit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolDeposit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolDeposit = entity.poolDeposit}
					{#if poolDeposit != null}
						<div>
							<dt>pool deposit</dt>
							<dd>
								{poolDeposit}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxEpoch = entity.maxEpoch}
					{#if maxEpoch != null}
						<div>
							<dt>max epoch</dt>
							<dd>
								{maxEpoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nOpt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nOpt = entity.nOpt}
					{#if nOpt != null}
						<div>
							<dt>n opt</dt>
							<dd>
								{nOpt}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rho: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rho = entity.rho}
					{#if rho != null}
						<div>
							<dt>rho</dt>
							<dd>
								{rho}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tau: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tau = entity.tau}
					{#if tau != null}
						<div>
							<dt>tau</dt>
							<dd>
								{tau}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							decentralisation: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const decentralisation = entity.decentralisation}
					{#if decentralisation != null}
						<div>
							<dt>decentralisation</dt>
							<dd>
								{decentralisation}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolMajor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolMajor = entity.protocolMajor}
					{#if protocolMajor != null}
						<div>
							<dt>protocol major</dt>
							<dd>
								{protocolMajor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolMinor: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolMinor = entity.protocolMinor}
					{#if protocolMinor != null}
						<div>
							<dt>protocol minor</dt>
							<dd>
								{protocolMinor}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minPoolCost: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minPoolCost = entity.minPoolCost}
					{#if minPoolCost != null}
						<div>
							<dt>min pool cost</dt>
							<dd>
								{minPoolCost}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinsPerUtxoByte: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinsPerUtxoByte = entity.coinsPerUtxoByte}
					{#if coinsPerUtxoByte != null}
						<div>
							<dt>coins per UTXO byte</dt>
							<dd>
								{coinsPerUtxoByte}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxValueSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxValueSize = entity.maxValueSize}
					{#if maxValueSize != null}
						<div>
							<dt>max value size</dt>
							<dd>
								{maxValueSize}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							collateralPercentage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collateralPercentage = entity.collateralPercentage}
					{#if collateralPercentage != null}
						<div>
							<dt>collateral percentage</dt>
							<dd>
								{collateralPercentage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxCollateralInputs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxCollateralInputs = entity.maxCollateralInputs}
					{#if maxCollateralInputs != null}
						<div>
							<dt>max collateral inputs</dt>
							<dd>
								{maxCollateralInputs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
