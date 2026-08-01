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
	}: EntitySelectionViewProps<EntityType.FilecoinDeal_Timestamp> = $props()

	const filecoinDealTimestamp = $derived(selection({
		fields: {
			verifiedDeal: true,
			height: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FilecoinDealView from '$/views/FilecoinDealView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinDeal_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinDealTimestamp}>
			{#snippet children(entity)}
				{String(entity.verifiedDeal ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinDealTimestamp}>
			{#snippet children(entity)}
				{@const height = entity.height}
				{#if height != null}
					<span data-text="muted">
						<NumberValue
							value={height}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Deal</dt>
				<dd>
					<FilecoinDealView
						selection={select(EntityType.FilecoinDeal, selection.entitySelector.$deal)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={filecoinDealTimestamp}
			>
				{#snippet children(entity)}
					{@const height = entity.height}
					{#if height != null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue
									value={height}
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
							tipsetKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tipsetKey = entity.tipsetKey}
					{#if tipsetKey != null}
						<div>
							<dt>Tipset key</dt>
							<dd>
								{tipsetKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$tipset}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null}
						<div>
							<dt>Tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
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
							sectorStartEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sectorStartEpoch = entity.sectorStartEpoch}
					{#if sectorStartEpoch != null}
						<div>
							<dt>Sector start epoch</dt>
							<dd>
								<NumberValue
									value={sectorStartEpoch}
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
							lastUpdatedEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastUpdatedEpoch = entity.lastUpdatedEpoch}
					{#if lastUpdatedEpoch != null}
						<div>
							<dt>Last updated epoch</dt>
							<dd>
								<NumberValue
									value={lastUpdatedEpoch}
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
							slashEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slashEpoch = entity.slashEpoch}
					{#if slashEpoch != null}
						<div>
							<dt>Slash epoch</dt>
							<dd>
								<NumberValue
									value={slashEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinDealTimestamp}
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
</EntityView>
