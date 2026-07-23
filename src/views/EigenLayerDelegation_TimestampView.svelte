<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EigenLayerDelegation_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EigenLayerDelegation_Timestamp>
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
	const eigenLayerDelegationTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'eigen layer delegation timestamp'
	const viewDomId = $derived('eigen-layer-delegation-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EigenLayerOperatorView from '$/views/EigenLayerOperatorView.svelte'
	import EigenLayerStrategyView from '$/views/EigenLayerStrategyView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerDelegation_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eigenLayerDelegationTimestamp}>
			{#snippet children(entity)}
				<EvmNetworkAccountView
					selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerDelegationTimestamp}>
			{#snippet children(entity)}
				<EigenLayerOperatorView
					selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerDelegationTimestamp}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>staker</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
						href={
							(
								selection.entitySelector.$staker != null && '$actor' in selection.entitySelector.$staker
								&& selection.entitySelector.$staker.$actor != null && 'address' in selection.entitySelector.$staker.$actor
								&& selection.entitySelector.$staker.$actor.address != null
								&& selection.entitySelector.$staker != null && '$network' in selection.entitySelector.$staker ?
									selection.entitySelector.$staker.$network != null && 'caip2' in selection.entitySelector.$staker.$network
									&& selection.entitySelector.$staker.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
									accountId: String(selection.entitySelector.$staker.$actor.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$staker.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$staker.$network != null && 'slug' in selection.entitySelector.$staker.$network
										&& selection.entitySelector.$staker.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
										accountId: String(selection.entitySelector.$staker.$actor.address ?? ''),
										network: String(selection.entitySelector.$staker.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>strategy</dt>
				<dd>
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
							delegatedShares: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatedShares = resolvedEntity.delegatedShares}
					{#if delegatedShares !== undefined && delegatedShares !== null}
						<div>
							<dt>delegated shares</dt>
							<dd>
								<NumberValue
									value={delegatedShares}
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
					selection({
						sources: selection.sources,
						fields: {
							underlyingTokenAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const underlyingTokenAmount = resolvedEntity.underlyingTokenAmount}
					{#if underlyingTokenAmount !== undefined && underlyingTokenAmount !== null}
						<div>
							<dt>underlying token amount</dt>
							<dd>
								<NumberValue
									value={underlyingTokenAmount}
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
							depositRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const depositRoot = resolvedEntity.depositRoot}
					{#if depositRoot !== undefined && depositRoot !== null}
						<div>
							<dt>deposit root</dt>
							<dd>
								{String((depositRoot) ?? '')}
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
							withdrawalRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawalRoot = resolvedEntity.withdrawalRoot}
					{#if withdrawalRoot !== undefined && withdrawalRoot !== null}
						<div>
							<dt>withdrawal root</dt>
							<dd>
								{String((withdrawalRoot) ?? '')}
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
							withdrawalQueued: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawalQueued = resolvedEntity.withdrawalQueued}
					{#if withdrawalQueued !== undefined && withdrawalQueued !== null}
						<div>
							<dt>withdrawal queued</dt>
							<dd>
								{withdrawalQueued ? 'Yes' : 'No'}
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
							withdrawalCompleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawalCompleted = resolvedEntity.withdrawalCompleted}
					{#if withdrawalCompleted !== undefined && withdrawalCompleted !== null}
						<div>
							<dt>withdrawal completed</dt>
							<dd>
								{withdrawalCompleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
