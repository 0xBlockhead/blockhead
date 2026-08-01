<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.PythPriceFeed_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.PythBenchmarks_Rest,
			Source.PythHermes_Rest,
			Source.Pyth_EvmContract,
			Source.Pyth_SolanaProgram,
		],
	}))
	const pythPriceFeedTimestamp = $derived(viewSelection({
		fields: {
			price: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PythPriceFeedView from '$/views/PythPriceFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.PythPriceFeed_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.publishTimeMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.publishTimeMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={pythPriceFeedTimestamp}>
			{#snippet children(entity)}
				{String(entity.price ?? '') || String(selection.entitySelector.publishTimeMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<PythPriceFeedView
						selection={select(EntityType.PythPriceFeed, selection.entitySelector.$feed)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Publish time ms</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.publishTimeMs} />
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
					viewSelection({
						fields: {
							observedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedAtMs = entity.observedAtMs}
					{#if observedAtMs != null}
						<div>
							<dt>Observed at ms</dt>
							<dd>
								<Timestamp timestamp={observedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={pythPriceFeedTimestamp}
			>
				{#snippet children(entity)}
					{@const price = entity.price}
					{#if price != null}
						<div>
							<dt>Price</dt>
							<dd>
								<NumberValue
									value={price}
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
					viewSelection({
						fields: {
							conf: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const conf = entity.conf}
					{#if conf != null}
						<div>
							<dt>Conf</dt>
							<dd>
								<NumberValue
									value={conf}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expo = entity.expo}
					{#if expo != null}
						<div>
							<dt>Expo</dt>
							<dd>
								<NumberValue
									value={expo}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							emaPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const emaPrice = entity.emaPrice}
					{#if emaPrice != null}
						<div>
							<dt>EMA price</dt>
							<dd>
								<NumberValue
									value={emaPrice}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							emaConf: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const emaConf = entity.emaConf}
					{#if emaConf != null}
						<div>
							<dt>EMA conf</dt>
							<dd>
								<NumberValue
									value={emaConf}
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
					viewSelection({
						fields: {
							vaa: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const vaa = entity.vaa}
					{#if vaa != null}
						<div>
							<dt>VAA</dt>
							<dd>
								{vaa}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							updateDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const updateDataHash = entity.updateDataHash}
					{#if updateDataHash != null}
						<div>
							<dt>Update data hash</dt>
							<dd>
								<TruncatedValue value={updateDataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>Slot</dt>
							<dd>
								<NumberValue
									value={slot}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd>
								<NumberValue
									value={sequence}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							onChainNetwork: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onChainNetwork = entity.onChainNetwork}
					{#if onChainNetwork != null}
						<div>
							<dt>On-chain network</dt>
							<dd>
								{onChainNetwork}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							onChainContract: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onChainContract = entity.onChainContract}
					{#if onChainContract != null}
						<div>
							<dt>On-chain contract</dt>
							<dd>
								{onChainContract}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stale: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stale = entity.stale}
					{#if stale != null}
						<div>
							<dt>Stale</dt>
							<dd>
								{stale ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
