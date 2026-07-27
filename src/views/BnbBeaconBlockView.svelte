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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BnbBeaconBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const bnbBeaconBlock = $derived(selection({
		fields: {
			height: true,
			timestampMs: true,
			hash: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.height ?? '') || (pendingEntity.hash ?? '') || 'bnb beacon block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconTransactionsView from '$/views/BnbBeaconTransactionsView.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.height}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconBlock}>
			{#snippet children(entity)}
				{@const timestampMs0 = entity.timestampMs}
				{#if timestampMs0 != null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={bnbBeaconBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.height}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={bnbBeaconBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={bnbBeaconBlock}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
							proposerAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proposerAddress = entity.proposerAddress}
					{#if proposerAddress != null}
						<div>
							<dt>proposer address</dt>
							<dd>
								<TruncatedValue value={proposerAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							appHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const appHash = entity.appHash}
					{#if appHash != null}
						<div>
							<dt>app hash</dt>
							<dd>
								<TruncatedValue value={appHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dataHash = entity.dataHash}
					{#if dataHash != null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={dataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validatorsHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validatorsHash = entity.validatorsHash}
					{#if validatorsHash != null}
						<div>
							<dt>validators hash</dt>
							<dd>
								<TruncatedValue value={validatorsHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextValidatorsHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nextValidatorsHash = entity.nextValidatorsHash}
					{#if nextValidatorsHash != null}
						<div>
							<dt>next validators hash</dt>
							<dd>
								<TruncatedValue value={nextValidatorsHash} />
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
							consensusHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consensusHash = entity.consensusHash}
					{#if consensusHash != null}
						<div>
							<dt>consensus hash</dt>
							<dd>
								<TruncatedValue value={consensusHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evidenceHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceHash = entity.evidenceHash}
					{#if evidenceHash != null}
						<div>
							<dt>evidence hash</dt>
							<dd>
								<TruncatedValue value={evidenceHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue
									value={transactionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const bnbBeaconBlockBnbBeaconTransactionsViewTransactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={bnbBeaconBlockBnbBeaconTransactionsViewTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BnbBeaconTransactionsView
						selection={bnbBeaconBlockBnbBeaconTransactionsViewTransactionsResource}
						countResource={bnbBeaconBlockBnbBeaconTransactionsViewTransactionsResource.count}
						title='transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
