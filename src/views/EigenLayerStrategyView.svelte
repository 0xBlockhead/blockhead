<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EigenLayerStrategy>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EigenLayerStrategy>>
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
	const eigenLayerStrategy = $derived(selection({
		sources: [
			Source.EigenExplorer_Rest,
			Source.EigenLayerContracts_Evm,
			Source.EigenLayerSubgraph_Graphql,
			Source.Etherscan_Rest,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			underlyingToken: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.strategyAddress ?? prefetched.strategyAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer strategy')
	const viewDomId = $derived('eigen-layer-strategy-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EigenLayerStrategy_TimestampsView from '$/views/EigenLayerStrategy_TimestampsView.svelte'
	import EigenLayerDelegation_TimestampsView from '$/views/EigenLayerDelegation_TimestampsView.svelte'
	import EigenLayerAllocation_TimestampsView from '$/views/EigenLayerAllocation_TimestampsView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EigenLayerStrategy}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={eigenLayerStrategy}>
			{#snippet Pending()}
				{[String((selection.entitySelector.strategyAddress ?? prefetched.strategyAddress) ?? '')].filter(Boolean).join(' ') || title || 'eigen layer strategy'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.strategyAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={eigenLayerStrategy}>
			{#snippet Pending()}
				{[String((prefetched.underlyingToken) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.strategyAddress ?? prefetched.strategyAddress) ?? '')].filter(Boolean).join(' ') || title || 'eigen layer strategy'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.underlyingToken) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.strategyAddress) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={eigenLayerStrategy}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : undefined)
						}
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
				<dt>strategy address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									strategyAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const strategyAddress = selection.entitySelector.strategyAddress ?? prefetched.strategyAddress}
							{#if strategyAddress !== undefined && strategyAddress !== null}
								<TruncatedValue value={String((strategyAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const strategyAddress = resolvedEntity.strategyAddress}
							{#if strategyAddress !== undefined && strategyAddress !== null}
								<TruncatedValue value={String((strategyAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							underlyingToken: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const underlyingToken = prefetched.underlyingToken}
					{#if underlyingToken !== undefined && underlyingToken !== null}
						<div>
							<dt>underlying token</dt>
							<dd>
								{String((underlyingToken) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const underlyingToken = resolvedEntity.underlyingToken}
					{#if underlyingToken !== undefined && underlyingToken !== null}
						<div>
							<dt>underlying token</dt>
							<dd>
								{String((underlyingToken) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$underlyingCoin')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>underlying coin</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2 !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2.reference !== undefined && (({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type !== undefined && (({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type === 'NativeCurrency' ? true : ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract !== undefined && ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$network.caip2.reference ?? ''),
											coinInstanceSlug: String((({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).type === 'NativeCurrency' ? 'native' : ({ ...evmCoinInstance[EntityMetaKey.Selector], ...evmCoinInstance }).$contract.address)),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
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
							strategyKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const strategyKind = prefetched.strategyKind}
					{#if strategyKind !== undefined && strategyKind !== null}
						<div>
							<dt>strategy kind</dt>
							<dd>
								{String((strategyKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const strategyKind = resolvedEntity.strategyKind}
					{#if strategyKind !== undefined && strategyKind !== null}
						<div>
							<dt>strategy kind</dt>
							<dd>
								{String((strategyKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$strategyContract')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>strategy contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2 !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference !== undefined && ({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.namespace ?? '')}:${String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).$network.caip2.reference ?? '')}`,
											address: String(({ ...evmContract[EntityMetaKey.Selector], ...evmContract }).address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EigenLayerStrategy_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EigenLayerStrategy_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No EigenLayer strategy observations.'
				id='EigenLayerStrategy_TimestampsView-$$timestamps'
			/>

			<EigenLayerDelegation_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EigenLayerDelegation_Timestamp>('$$delegations')}
				title='delegations'
				emptyText='No EigenLayer delegation observations.'
				id='EigenLayerDelegation_TimestampsView-$$delegations'
			/>

			<EigenLayerAllocation_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EigenLayerAllocation_Timestamp>('$$allocations')}
				title='allocations'
				emptyText='No EigenLayer allocation observations.'
				id='EigenLayerAllocation_TimestampsView-$$allocations'
			/>
		{/if}
	{/snippet}
</EntityView>
