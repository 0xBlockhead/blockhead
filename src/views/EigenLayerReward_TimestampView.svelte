<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.EigenLayerReward_Timestamp>, 'prefetched'> = $props()

	const earner = $derived(selection.entitySelector.$earner)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.EigenExplorer_Rest,
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/eigenlayer/reward/[rewardContextKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in earner.$network ?
							caip2StringFromValue(earner.$network.caip2)
						:
							earner.$network.slug
					),
					accountId: earner.$actor.address,
					rewardContextKey: selection.entitySelector.rewardContextKey,
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
	{#snippet Title()}
		<EvmNetworkAccountView
			selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.rewardContextKey || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerRewardTimestamp}>
			{#snippet children(entity)}
				{@const rewardToken = entity.rewardToken}
				{#if rewardToken != null}
					<span data-text="muted">
						{rewardToken}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>earner</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>reward context key</dt>
				<dd>
					{selection.entitySelector.rewardContextKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$strategy}
			>
				{#snippet children(eigenLayerStrategy)}
					{#if eigenLayerStrategy != null}
						{@const eigenLayerStrategyInitial = untrack(() => eigenLayerStrategy)}
						<div>
							<dt>strategy</dt>
							<dd>
								<EigenLayerStrategyView
									selection={select(EntityType.EigenLayerStrategy, (eigenLayerStrategy ?? eigenLayerStrategyInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const eigenLayerOperatorInitial = untrack(() => eigenLayerOperator)}
						<div>
							<dt>operator</dt>
							<dd>
								<EigenLayerOperatorView
									selection={select(EntityType.EigenLayerOperator, (eigenLayerOperator ?? eigenLayerOperatorInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const eigenLayerAvsInitial = untrack(() => eigenLayerAvs)}
						<div>
							<dt>AVS</dt>
							<dd>
								<EigenLayerAvsView
									selection={select(EntityType.EigenLayerAvs, (eigenLayerAvs ?? eigenLayerAvsInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
				resource={eigenLayerRewardTimestamp}
			>
				{#snippet children(entity)}
					{@const rewardToken = entity.rewardToken}
					{#if rewardToken != null}
						<div>
							<dt>reward token</dt>
							<dd>
								{rewardToken}
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
								{merkleRoot}
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
