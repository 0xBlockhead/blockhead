<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'
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
	}: EntitySelectionViewProps<EntityType.EigenLayerReward_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.EigenLayerSubgraph_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const eigenLayerRewardTimestamp = $derived(viewSelection({
		fields: {
			rewardToken: true,
		},
	}))
	const titleFallback = 'eigen layer reward timestamp'


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
	import EigenLayerAvsView from '$/views/EigenLayerAvsView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerReward_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.rewardContextKey ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerRewardTimestamp}>
			{#snippet children(entity)}
				{@const rewardToken0 = entity.rewardToken}
				{#if rewardToken0 != null}
					<span data-text="muted">
						{String(rewardToken0)}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>earner</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>reward context key</dt>
				<dd>
					{pendingEntity.rewardContextKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$strategy}
			>
				{#snippet children(eigenLayerStrategy)}
					{#if eigenLayerStrategy != null}
						<div>
							<dt>strategy</dt>
							<dd>
								<EigenLayerStrategyView
									selection={select(EntityType.EigenLayerStrategy, eigenLayerStrategy[EntityMetaKey.Selector])}
									prefetched={eigenLayerStrategy}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operator}
			>
				{#snippet children(eigenLayerOperator)}
					{#if eigenLayerOperator != null}
						<div>
							<dt>operator</dt>
							<dd>
								<EigenLayerOperatorView
									selection={select(EntityType.EigenLayerOperator, eigenLayerOperator[EntityMetaKey.Selector])}
									prefetched={eigenLayerOperator}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$avs}
			>
				{#snippet children(eigenLayerAvs)}
					{#if eigenLayerAvs != null}
						<div>
							<dt>AVS</dt>
							<dd>
								<EigenLayerAvsView
									selection={select(EntityType.EigenLayerAvs, eigenLayerAvs[EntityMetaKey.Selector])}
									prefetched={eigenLayerAvs}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={eigenLayerRewardTimestamp}
			>
				{#snippet children(entity)}
					{@const rewardToken = entity.rewardToken}
					{#if rewardToken != null}
						<div>
							<dt>reward token</dt>
							<dd>
								{String(rewardToken)}
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
							rewardAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardAmount = entity.rewardAmount}
					{#if rewardAmount != null}
						<div>
							<dt>reward amount</dt>
							<dd>
								<NumberValue
									value={rewardAmount}
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
							cumulativeClaimed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cumulativeClaimed = entity.cumulativeClaimed}
					{#if cumulativeClaimed != null}
						<div>
							<dt>cumulative claimed</dt>
							<dd>
								<NumberValue
									value={cumulativeClaimed}
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
							merkleRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const merkleRoot = entity.merkleRoot}
					{#if merkleRoot != null}
						<div>
							<dt>merkle root</dt>
							<dd>
								{String(merkleRoot)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							proofRequested: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofRequested = entity.proofRequested}
					{#if proofRequested != null}
						<div>
							<dt>proof requested</dt>
							<dd>
								{proofRequested ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
