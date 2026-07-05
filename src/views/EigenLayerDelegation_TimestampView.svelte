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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerDelegation_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EigenLayerDelegation_Timestamp>>
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
	const eigenLayerDelegationTimestamp = $derived(selection({
		sources: [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.EigenLayerSubgraph_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
	}))
	const titleFallback = $derived('eigen layer delegation timestamp')
	const viewDomId = $derived('eigen-layer-delegation-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
			{#snippet Pending()}
				<EvmNetworkAccountView
					selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmNetworkAccountView
					selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$staker)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerDelegationTimestamp}>
			{#snippet Pending()}
				<EigenLayerOperatorView
					selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EigenLayerOperatorView
					selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerDelegationTimestamp}>
			{#snippet Pending()}
				<span data-text="muted">
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

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
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operator</dt>
				<dd>
					<EigenLayerOperatorView
						selection={select(EntityType.EigenLayerOperator, selection.entitySelector.$operator)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>strategy</dt>
				<dd>
					<EigenLayerStrategyView
						selection={select(EntityType.EigenLayerStrategy, selection.entitySelector.$strategy)}
						layout={EntityLayout.Title}
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
							delegatedShares: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegatedShares = prefetched.delegatedShares}
					{#if delegatedShares !== undefined && delegatedShares !== null}
						<div>
							<dt>delegated shares</dt>
							<dd>
								<NumberValue value={Number(delegatedShares)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatedShares = resolvedEntity.delegatedShares}
					{#if delegatedShares !== undefined && delegatedShares !== null}
						<div>
							<dt>delegated shares</dt>
							<dd>
								<NumberValue value={Number(delegatedShares)} />
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
							underlyingTokenAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const underlyingTokenAmount = prefetched.underlyingTokenAmount}
					{#if underlyingTokenAmount !== undefined && underlyingTokenAmount !== null}
						<div>
							<dt>underlying token amount</dt>
							<dd>
								<NumberValue value={Number(underlyingTokenAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const underlyingTokenAmount = resolvedEntity.underlyingTokenAmount}
					{#if underlyingTokenAmount !== undefined && underlyingTokenAmount !== null}
						<div>
							<dt>underlying token amount</dt>
							<dd>
								<NumberValue value={Number(underlyingTokenAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							depositRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const depositRoot = prefetched.depositRoot}
					{#if depositRoot !== undefined && depositRoot !== null}
						<div>
							<dt>deposit root</dt>
							<dd>
								{String((depositRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							withdrawalRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const withdrawalRoot = prefetched.withdrawalRoot}
					{#if withdrawalRoot !== undefined && withdrawalRoot !== null}
						<div>
							<dt>withdrawal root</dt>
							<dd>
								{String((withdrawalRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							withdrawalQueued: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const withdrawalQueued = prefetched.withdrawalQueued}
					{#if withdrawalQueued !== undefined && withdrawalQueued !== null}
						<div>
							<dt>withdrawal queued</dt>
							<dd>
								{withdrawalQueued ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							withdrawalCompleted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const withdrawalCompleted = prefetched.withdrawalCompleted}
					{#if withdrawalCompleted !== undefined && withdrawalCompleted !== null}
						<div>
							<dt>withdrawal completed</dt>
							<dd>
								{withdrawalCompleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
