<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { EvmAddress, ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EigenLayerReward_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EigenLayerReward_Timestamp>>
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
	const eigenLayerRewardTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			rewardToken: true,
		},
	}))
	const titleFallback = $derived('eigen layer reward timestamp')
	const viewDomId = $derived('eigen-layer-reward-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner)}
						href={
						(selection.entitySelector.$earner.$actor !== undefined && selection.entitySelector.$earner.$actor.address !== undefined && selection.entitySelector.$earner.$network !== undefined && selection.entitySelector.$earner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$earner.$actor.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$earner.$network.caip2) ?? ''),
						}) : selection.entitySelector.$earner.$actor !== undefined && selection.entitySelector.$earner.$actor.address !== undefined && selection.entitySelector.$earner.$network !== undefined && selection.entitySelector.$earner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$earner.$actor.address ?? ''),
							network: String(selection.entitySelector.$earner.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={eigenLayerRewardTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner)}
						href={
						(selection.entitySelector.$earner.$actor !== undefined && selection.entitySelector.$earner.$actor.address !== undefined && selection.entitySelector.$earner.$network !== undefined && selection.entitySelector.$earner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$earner.$actor.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$earner.$network.caip2) ?? ''),
						}) : selection.entitySelector.$earner.$actor !== undefined && selection.entitySelector.$earner.$actor.address !== undefined && selection.entitySelector.$earner.$network !== undefined && selection.entitySelector.$earner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(selection.entitySelector.$earner.$actor.address ?? ''),
							network: String(selection.entitySelector.$earner.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.rewardContextKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={eigenLayerRewardTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.rewardContextKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const rewardToken0 = pendingEntity.rewardToken}
			{#if rewardToken0 !== undefined && rewardToken0 !== null}
				<span data-text="muted">
					{String((rewardToken0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={eigenLayerRewardTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardToken0 = resolvedEntity.rewardToken}
					{#if rewardToken0 !== undefined && rewardToken0 !== null}
						<span data-text="muted">
							{String((rewardToken0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>earner</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$earner, {})}
						href={
							(selection.entitySelector.$earner.$actor !== undefined && selection.entitySelector.$earner.$actor.address !== undefined && selection.entitySelector.$earner.$network !== undefined && selection.entitySelector.$earner.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$earner.$actor.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$earner.$network.caip2) ?? ''),
							}) : selection.entitySelector.$earner.$actor !== undefined && selection.entitySelector.$earner.$actor.address !== undefined && selection.entitySelector.$earner.$network !== undefined && selection.entitySelector.$earner.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$earner.$actor.address ?? ''),
								network: String(selection.entitySelector.$earner.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>reward context key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									rewardContextKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rewardContextKey = resolvedEntity.rewardContextKey}
							{#if rewardContextKey !== undefined && rewardContextKey !== null}
								{String((rewardContextKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$strategy}
			>
				{#snippet children(eigenLayerStrategy)}
					{#if eigenLayerStrategy != null && eigenLayerStrategy[EntityMetaKey.Selector] != null}
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
					{#if eigenLayerOperator != null && eigenLayerOperator[EntityMetaKey.Selector] != null}
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
					{#if eigenLayerAvs != null && eigenLayerAvs[EntityMetaKey.Selector] != null}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							rewardToken: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardToken = resolvedEntity.rewardToken}
					{#if rewardToken !== undefined && rewardToken !== null}
						<div>
							<dt>reward token</dt>
							<dd>
								{String((rewardToken) ?? '')}
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
						sources: selection.sources,
						fields: {
							rewardAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardAmount = resolvedEntity.rewardAmount}
					{#if rewardAmount !== undefined && rewardAmount !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							cumulativeClaimed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cumulativeClaimed = resolvedEntity.cumulativeClaimed}
					{#if cumulativeClaimed !== undefined && cumulativeClaimed !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							merkleRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const merkleRoot = resolvedEntity.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							proofRequested: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofRequested = resolvedEntity.proofRequested}
					{#if proofRequested !== undefined && proofRequested !== null}
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
