<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.UniswapV3Pool> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Voltaire_JsonRpc,
			Source.UniswapContracts_Evm,
		],
	}))
	const uniswapV3Pool = $derived(viewSelection({
		fields: {
			poolAddress: true,
			fee: true,
		},
	}))
	const viewDomId = $derived('uniswap-v3pool-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import UniswapV3Pool_BlocksView from '$/views/UniswapV3Pool_BlocksView.svelte'
</script>


<EntityView
	entityType={EntityType.UniswapV3Pool}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? ((prefetched.poolAddress ?? '') || 'Uniswap V3 pool')}
	href={
		href === undefined ?
			(
				'poolAddress' in selection.entitySelector
				&& '$network' in selection.entitySelector
				&& 'caip2' in selection.entitySelector.$network ?
					resolve(
						'/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]',
						{
							chainId: selection.entitySelector.$network.caip2.reference,
							poolAddress: selection.entitySelector.poolAddress,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={uniswapV3Pool}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.poolAddress} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={uniswapV3Pool}>
			{#snippet children(entity)}
				{@const fee = entity.fee}
				{#if fee != null}
					<NumberValue
						value={fee}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
						prefetched={network}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Pool address</dt>
				<dd>
					<ResourceBoundary
						resource={uniswapV3Pool}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.poolAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$poolContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Pool contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$factory}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Factory</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token0}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Token 0</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token1}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Token 1</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={uniswapV3Pool}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>Fee</dt>
							<dd>
								<NumberValue
									value={fee}
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
							tickSpacing: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tickSpacing = entity.tickSpacing}
					{#if tickSpacing != null}
						<div>
							<dt>Tick spacing</dt>
							<dd>
								<NumberValue
									value={tickSpacing}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-uniswap-v3-pool-state'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'uniswap-v3-pool-blocks',
						label: 'Blocks',
					},
				]
			}
			data-card
			class='network-view-collapsible-state'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>State</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionUniswapV3PoolBlocks({ id, label })}
				<UniswapV3Pool_BlocksView
					selection={selection.$$blocks}
					collapsible={false}
					title={label}
					emptyText='No Uniswap V3 pool blocks yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
