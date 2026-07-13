<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoProtocolParameters_Epoch>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoProtocolParameters_Epoch>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const cardanoProtocolParametersEpoch = $derived(selection({}))
	const titleFallback = $derived('Cardano protocol parameters epoch')
	const viewDomId = $derived('cardano-protocol-parameters-epoch-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoNetworkView from '$/views/CardanoNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoProtocolParameters_Epoch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoProtocolParametersEpoch}>
			{#snippet Pending()}
				{title || 'Cardano protocol parameters epoch'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CardanoNetworkView
						selection={select(EntityType.CardanoNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									epoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const epoch = pendingEntity.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const epoch = resolvedEntity.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const minFeeA = pendingEntity.minFeeA}
					{#if minFeeA !== undefined && minFeeA !== null}
						<div>
							<dt>min fee a</dt>
							<dd>
								{String((minFeeA) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minFeeA = resolvedEntity.minFeeA}
					{#if minFeeA !== undefined && minFeeA !== null}
						<div>
							<dt>min fee a</dt>
							<dd>
								{String((minFeeA) ?? '')}
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
				{#snippet Pending()}
					{@const minFeeB = pendingEntity.minFeeB}
					{#if minFeeB !== undefined && minFeeB !== null}
						<div>
							<dt>min fee b</dt>
							<dd>
								{String((minFeeB) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minFeeB = resolvedEntity.minFeeB}
					{#if minFeeB !== undefined && minFeeB !== null}
						<div>
							<dt>min fee b</dt>
							<dd>
								{String((minFeeB) ?? '')}
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
				{#snippet Pending()}
					{@const maxBlockBodySize = pendingEntity.maxBlockBodySize}
					{#if maxBlockBodySize !== undefined && maxBlockBodySize !== null}
						<div>
							<dt>max block body size</dt>
							<dd>
								{String((maxBlockBodySize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxBlockBodySize = resolvedEntity.maxBlockBodySize}
					{#if maxBlockBodySize !== undefined && maxBlockBodySize !== null}
						<div>
							<dt>max block body size</dt>
							<dd>
								{String((maxBlockBodySize) ?? '')}
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
				{#snippet Pending()}
					{@const maxTxSize = pendingEntity.maxTxSize}
					{#if maxTxSize !== undefined && maxTxSize !== null}
						<div>
							<dt>max transaction size</dt>
							<dd>
								{String((maxTxSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxTxSize = resolvedEntity.maxTxSize}
					{#if maxTxSize !== undefined && maxTxSize !== null}
						<div>
							<dt>max transaction size</dt>
							<dd>
								{String((maxTxSize) ?? '')}
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
				{#snippet Pending()}
					{@const maxBlockHeaderSize = pendingEntity.maxBlockHeaderSize}
					{#if maxBlockHeaderSize !== undefined && maxBlockHeaderSize !== null}
						<div>
							<dt>max block header size</dt>
							<dd>
								{String((maxBlockHeaderSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxBlockHeaderSize = resolvedEntity.maxBlockHeaderSize}
					{#if maxBlockHeaderSize !== undefined && maxBlockHeaderSize !== null}
						<div>
							<dt>max block header size</dt>
							<dd>
								{String((maxBlockHeaderSize) ?? '')}
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
				{#snippet Pending()}
					{@const keyDeposit = pendingEntity.keyDeposit}
					{#if keyDeposit !== undefined && keyDeposit !== null}
						<div>
							<dt>key deposit</dt>
							<dd>
								{String((keyDeposit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyDeposit = resolvedEntity.keyDeposit}
					{#if keyDeposit !== undefined && keyDeposit !== null}
						<div>
							<dt>key deposit</dt>
							<dd>
								{String((keyDeposit) ?? '')}
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
				{#snippet Pending()}
					{@const poolDeposit = pendingEntity.poolDeposit}
					{#if poolDeposit !== undefined && poolDeposit !== null}
						<div>
							<dt>pool deposit</dt>
							<dd>
								{String((poolDeposit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const poolDeposit = resolvedEntity.poolDeposit}
					{#if poolDeposit !== undefined && poolDeposit !== null}
						<div>
							<dt>pool deposit</dt>
							<dd>
								{String((poolDeposit) ?? '')}
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
				{#snippet Pending()}
					{@const maxEpoch = pendingEntity.maxEpoch}
					{#if maxEpoch !== undefined && maxEpoch !== null}
						<div>
							<dt>max epoch</dt>
							<dd>
								{String((maxEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxEpoch = resolvedEntity.maxEpoch}
					{#if maxEpoch !== undefined && maxEpoch !== null}
						<div>
							<dt>max epoch</dt>
							<dd>
								{String((maxEpoch) ?? '')}
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
				{#snippet Pending()}
					{@const nOpt = pendingEntity.nOpt}
					{#if nOpt !== undefined && nOpt !== null}
						<div>
							<dt>n opt</dt>
							<dd>
								{String((nOpt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nOpt = resolvedEntity.nOpt}
					{#if nOpt !== undefined && nOpt !== null}
						<div>
							<dt>n opt</dt>
							<dd>
								{String((nOpt) ?? '')}
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
				{#snippet Pending()}
					{@const rho = pendingEntity.rho}
					{#if rho !== undefined && rho !== null}
						<div>
							<dt>rho</dt>
							<dd>
								{String((rho) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rho = resolvedEntity.rho}
					{#if rho !== undefined && rho !== null}
						<div>
							<dt>rho</dt>
							<dd>
								{String((rho) ?? '')}
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
				{#snippet Pending()}
					{@const tau = pendingEntity.tau}
					{#if tau !== undefined && tau !== null}
						<div>
							<dt>tau</dt>
							<dd>
								{String((tau) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tau = resolvedEntity.tau}
					{#if tau !== undefined && tau !== null}
						<div>
							<dt>tau</dt>
							<dd>
								{String((tau) ?? '')}
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
				{#snippet Pending()}
					{@const decentralisation = pendingEntity.decentralisation}
					{#if decentralisation !== undefined && decentralisation !== null}
						<div>
							<dt>decentralisation</dt>
							<dd>
								{String((decentralisation) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decentralisation = resolvedEntity.decentralisation}
					{#if decentralisation !== undefined && decentralisation !== null}
						<div>
							<dt>decentralisation</dt>
							<dd>
								{String((decentralisation) ?? '')}
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
				{#snippet Pending()}
					{@const protocolMajor = pendingEntity.protocolMajor}
					{#if protocolMajor !== undefined && protocolMajor !== null}
						<div>
							<dt>protocol major</dt>
							<dd>
								{String((protocolMajor) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolMajor = resolvedEntity.protocolMajor}
					{#if protocolMajor !== undefined && protocolMajor !== null}
						<div>
							<dt>protocol major</dt>
							<dd>
								{String((protocolMajor) ?? '')}
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
				{#snippet Pending()}
					{@const protocolMinor = pendingEntity.protocolMinor}
					{#if protocolMinor !== undefined && protocolMinor !== null}
						<div>
							<dt>protocol minor</dt>
							<dd>
								{String((protocolMinor) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolMinor = resolvedEntity.protocolMinor}
					{#if protocolMinor !== undefined && protocolMinor !== null}
						<div>
							<dt>protocol minor</dt>
							<dd>
								{String((protocolMinor) ?? '')}
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
				{#snippet Pending()}
					{@const minPoolCost = pendingEntity.minPoolCost}
					{#if minPoolCost !== undefined && minPoolCost !== null}
						<div>
							<dt>min pool cost</dt>
							<dd>
								{String((minPoolCost) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minPoolCost = resolvedEntity.minPoolCost}
					{#if minPoolCost !== undefined && minPoolCost !== null}
						<div>
							<dt>min pool cost</dt>
							<dd>
								{String((minPoolCost) ?? '')}
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
				{#snippet Pending()}
					{@const coinsPerUtxoByte = pendingEntity.coinsPerUtxoByte}
					{#if coinsPerUtxoByte !== undefined && coinsPerUtxoByte !== null}
						<div>
							<dt>coins per UTXO byte</dt>
							<dd>
								{String((coinsPerUtxoByte) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinsPerUtxoByte = resolvedEntity.coinsPerUtxoByte}
					{#if coinsPerUtxoByte !== undefined && coinsPerUtxoByte !== null}
						<div>
							<dt>coins per UTXO byte</dt>
							<dd>
								{String((coinsPerUtxoByte) ?? '')}
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
				{#snippet Pending()}
					{@const maxValueSize = pendingEntity.maxValueSize}
					{#if maxValueSize !== undefined && maxValueSize !== null}
						<div>
							<dt>max value size</dt>
							<dd>
								{String((maxValueSize) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxValueSize = resolvedEntity.maxValueSize}
					{#if maxValueSize !== undefined && maxValueSize !== null}
						<div>
							<dt>max value size</dt>
							<dd>
								{String((maxValueSize) ?? '')}
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
				{#snippet Pending()}
					{@const collateralPercentage = pendingEntity.collateralPercentage}
					{#if collateralPercentage !== undefined && collateralPercentage !== null}
						<div>
							<dt>collateral percentage</dt>
							<dd>
								{String((collateralPercentage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const collateralPercentage = resolvedEntity.collateralPercentage}
					{#if collateralPercentage !== undefined && collateralPercentage !== null}
						<div>
							<dt>collateral percentage</dt>
							<dd>
								{String((collateralPercentage) ?? '')}
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
				{#snippet Pending()}
					{@const maxCollateralInputs = pendingEntity.maxCollateralInputs}
					{#if maxCollateralInputs !== undefined && maxCollateralInputs !== null}
						<div>
							<dt>max collateral inputs</dt>
							<dd>
								{String((maxCollateralInputs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxCollateralInputs = resolvedEntity.maxCollateralInputs}
					{#if maxCollateralInputs !== undefined && maxCollateralInputs !== null}
						<div>
							<dt>max collateral inputs</dt>
							<dd>
								{String((maxCollateralInputs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
