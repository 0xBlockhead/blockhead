<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinDeal>, 'prefetched'> = $props()

	const filecoinDeal = $derived(selection({
		fields: {
			verifiedDeal: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinDeal_TimestampsView from '$/views/FilecoinDeal_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinDeal}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.dealId)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.dealId}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$provider}
		>
			{#snippet children(filecoinMiner)}
				{#if filecoinMiner != null}
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<ResourceBoundary
			resource={selection.$client}
		>
			{#snippet children(filecoinActor)}
				{#if filecoinActor != null}
					<FilecoinActorView
						selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinDeal}>
			{#snippet children(entity)}
				{@const verifiedDeal = entity.verifiedDeal}
				{#if verifiedDeal != null}
					<span data-text="muted">
						{verifiedDeal ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Deal ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.dealId}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$provider}
			>
				{#snippet children(filecoinMiner)}
					{#if filecoinMiner != null}
						<div>
							<dt>Provider</dt>
							<dd>
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$client}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null}
						<div>
							<dt>Client</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
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
							pieceCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceCid = entity.pieceCid}
					{#if pieceCid != null}
						<div>
							<dt>Piece CID</dt>
							<dd>
								<TruncatedValue value={pieceCid} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pieceSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pieceSizeBytes = entity.pieceSizeBytes}
					{#if pieceSizeBytes != null}
						<div>
							<dt>Piece size bytes</dt>
							<dd>
								<NumberValue
									value={pieceSizeBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinDeal}
			>
				{#snippet children(entity)}
					{@const verifiedDeal = entity.verifiedDeal}
					{#if verifiedDeal != null}
						<div>
							<dt>Verified deal</dt>
							<dd>
								{verifiedDeal ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
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
							startEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startEpoch = entity.startEpoch}
					{#if startEpoch != null}
						<div>
							<dt>Start epoch</dt>
							<dd>
								<NumberValue
									value={startEpoch}
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
							endEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const endEpoch = entity.endEpoch}
					{#if endEpoch != null}
						<div>
							<dt>End epoch</dt>
							<dd>
								<NumberValue
									value={endEpoch}
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
							storagePricePerEpochAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const storagePricePerEpochAttoFil = entity.storagePricePerEpochAttoFil}
					{#if storagePricePerEpochAttoFil != null}
						<div>
							<dt>Storage price per epoch attoFIL</dt>
							<dd>
								<NumberValue
									value={storagePricePerEpochAttoFil}
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
							providerCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerCollateralAttoFil = entity.providerCollateralAttoFil}
					{#if providerCollateralAttoFil != null}
						<div>
							<dt>Provider collateral attoFIL</dt>
							<dd>
								<NumberValue
									value={providerCollateralAttoFil}
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
							clientCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const clientCollateralAttoFil = entity.clientCollateralAttoFil}
					{#if clientCollateralAttoFil != null}
						<div>
							<dt>Client collateral attoFIL</dt>
							<dd>
								<NumberValue
									value={clientCollateralAttoFil}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinDeal_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
