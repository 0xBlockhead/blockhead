<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.Network_Timestamp>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						network.caip2 !== undefined ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					timestampMs: String(selection.entitySelector.timestampMs),
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
	{#snippet Icon()}
		<IconComponent />
	{/snippet}

	{#snippet Content()}
		<ProjectionBoundary
			resource={selection.Utxo}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.hashrateHashesPerSecond}
					>
						{#snippet children(hashrateHashesPerSecond)}
							{#if hashrateHashesPerSecond != null}
								<div>
									<dt>Estimated network hashes per second</dt>
									<dd>
										{hashrateHashesPerSecond}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.hashrateBlockWindow}
					>
						{#snippet children(hashrateBlockWindow)}
							{#if hashrateBlockWindow != null}
								<div>
									<dt>Hashrate block window</dt>
									<dd>
										<NumberValue
											value={hashrateBlockWindow}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.difficultyAdjustmentProgressPercent}
					>
						{#snippet children(difficultyAdjustmentProgressPercent)}
							{#if difficultyAdjustmentProgressPercent != null}
								<div>
									<dt>Difficulty adjustment progress</dt>
									<dd>
										<NumberValue
											value={difficultyAdjustmentProgressPercent}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.difficultyChangePercent}
					>
						{#snippet children(difficultyChangePercent)}
							{#if difficultyChangePercent != null}
								<div>
									<dt>Estimated difficulty change</dt>
									<dd>
										<NumberValue
											value={difficultyChangePercent}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.previousRetargetPercent}
					>
						{#snippet children(previousRetargetPercent)}
							{#if previousRetargetPercent != null}
								<div>
									<dt>Previous retarget change</dt>
									<dd>
										<NumberValue
											value={previousRetargetPercent}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.remainingBlocks}
					>
						{#snippet children(remainingBlocks)}
							{#if remainingBlocks != null}
								<div>
									<dt>Blocks remaining in epoch</dt>
									<dd>
										<NumberValue
											value={remainingBlocks}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.expectedBlocks}
					>
						{#snippet children(expectedBlocks)}
							{#if expectedBlocks != null}
								<div>
									<dt>Expected blocks in epoch</dt>
									<dd>
										<NumberValue
											value={expectedBlocks}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.nextRetargetHeight}
					>
						{#snippet children(nextRetargetHeight)}
							{#if nextRetargetHeight != null}
								<div>
									<dt>Next retarget height</dt>
									<dd>
										<NumberValue
											value={nextRetargetHeight}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.estimatedRetargetDateMs}
					>
						{#snippet children(estimatedRetargetDateMs)}
							{#if estimatedRetargetDateMs != null}
								<div>
									<dt>Estimated retarget time</dt>
									<dd>
										<Timestamp timestamp={estimatedRetargetDateMs} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.conservativeFeeRate2BlocksSatsPerKvb}
					>
						{#snippet children(conservativeFeeRate2BlocksSatsPerKvb)}
							{#if conservativeFeeRate2BlocksSatsPerKvb != null}
								<div>
									<dt>Conservative fee rate (2 blocks), sats/kvB</dt>
									<dd>
										{conservativeFeeRate2BlocksSatsPerKvb}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.conservativeFeeRate6BlocksSatsPerKvb}
					>
						{#snippet children(conservativeFeeRate6BlocksSatsPerKvb)}
							{#if conservativeFeeRate6BlocksSatsPerKvb != null}
								<div>
									<dt>Conservative fee rate (6 blocks), sats/kvB</dt>
									<dd>
										{conservativeFeeRate6BlocksSatsPerKvb}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.conservativeFeeRate12BlocksSatsPerKvb}
					>
						{#snippet children(conservativeFeeRate12BlocksSatsPerKvb)}
							{#if conservativeFeeRate12BlocksSatsPerKvb != null}
								<div>
									<dt>Conservative fee rate (12 blocks), sats/kvB</dt>
									<dd>
										{conservativeFeeRate12BlocksSatsPerKvb}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.conservativeFeeRate24BlocksSatsPerKvb}
					>
						{#snippet children(conservativeFeeRate24BlocksSatsPerKvb)}
							{#if conservativeFeeRate24BlocksSatsPerKvb != null}
								<div>
									<dt>Conservative fee rate (24 blocks), sats/kvB</dt>
									<dd>
										{conservativeFeeRate24BlocksSatsPerKvb}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.miningTemplateHeight}
					>
						{#snippet children(miningTemplateHeight)}
							{#if miningTemplateHeight != null}
								<div>
									<dt>Mining template height</dt>
									<dd>
										<NumberValue
											value={miningTemplateHeight}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplatePreviousBlockHash}
					>
						{#snippet children(miningTemplatePreviousBlockHash)}
							{#if miningTemplatePreviousBlockHash != null}
								<div>
									<dt>Mining template previous block</dt>
									<dd>
										<TruncatedValue value={miningTemplatePreviousBlockHash} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateTarget}
					>
						{#snippet children(miningTemplateTarget)}
							{#if miningTemplateTarget != null}
								<div>
									<dt>Mining template target</dt>
									<dd>
										{miningTemplateTarget}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateCurrentTimeMs}
					>
						{#snippet children(miningTemplateCurrentTimeMs)}
							{#if miningTemplateCurrentTimeMs != null}
								<div>
									<dt>Mining template current time</dt>
									<dd>
										<Timestamp timestamp={miningTemplateCurrentTimeMs} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateMinimumTimeMs}
					>
						{#snippet children(miningTemplateMinimumTimeMs)}
							{#if miningTemplateMinimumTimeMs != null}
								<div>
									<dt>Mining template minimum time</dt>
									<dd>
										<Timestamp timestamp={miningTemplateMinimumTimeMs} />
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<ResourceBoundary
						resource={projection.miningTemplateCoinbaseValueSats}
					>
						{#snippet children(miningTemplateCoinbaseValueSats)}
							{#if miningTemplateCoinbaseValueSats != null}
								<div>
									<dt>Mining template coinbase value</dt>
									<dd>
										{miningTemplateCoinbaseValueSats}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateTransactionCount}
					>
						{#snippet children(miningTemplateTransactionCount)}
							{#if miningTemplateTransactionCount != null}
								<div>
									<dt>Mining template transactions</dt>
									<dd>
										<NumberValue
											value={miningTemplateTransactionCount}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateSizeLimitBytes}
					>
						{#snippet children(miningTemplateSizeLimitBytes)}
							{#if miningTemplateSizeLimitBytes != null}
								<div>
									<dt>Mining template size limit</dt>
									<dd>
										{miningTemplateSizeLimitBytes}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateWeightLimit}
					>
						{#snippet children(miningTemplateWeightLimit)}
							{#if miningTemplateWeightLimit != null}
								<div>
									<dt>Mining template weight limit</dt>
									<dd>
										{miningTemplateWeightLimit}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateSigopLimit}
					>
						{#snippet children(miningTemplateSigopLimit)}
							{#if miningTemplateSigopLimit != null}
								<div>
									<dt>Mining template sigop limit</dt>
									<dd>
										{miningTemplateSigopLimit}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
					<div>
						<dt>Mining template rules</dt>
						<dd>
							<ResourceBoundary
								resource={projection.miningTemplateRules}
							>
								{#snippet children(miningTemplateRules)}
									{miningTemplateRules.values.join(', ')}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Mining template mutable fields</dt>
						<dd>
							<ResourceBoundary
								resource={projection.miningTemplateMutableFields}
							>
								{#snippet children(miningTemplateMutableFields)}
									{miningTemplateMutableFields.values.join(', ')}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={projection.miningTemplateNonceRange}
					>
						{#snippet children(miningTemplateNonceRange)}
							{#if miningTemplateNonceRange != null}
								<div>
									<dt>Mining template nonce range</dt>
									<dd>
										{miningTemplateNonceRange}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={projection.miningTemplateBits}
					>
						{#snippet children(miningTemplateBits)}
							{#if miningTemplateBits != null}
								<div>
									<dt>Mining template bits</dt>
									<dd>
										{miningTemplateBits}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Details()}
		<ProjectionBoundary
			resource={selection.Utxo}
		>
			{#snippet Applicable(projection)}
				{@const miningTemplateTransactionsResource = projection.$$miningTemplateTransactions}
				<ResourceBoundary
					resource={miningTemplateTransactionsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
							<UtxoTransactionsView
								selection={miningTemplateTransactionsResource}
								countResource={miningTemplateTransactionsResource.count}
								title='Mining template transactions'
								id='mining-template-transactions'
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
