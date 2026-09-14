<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.LiquidityPool>, 'prefetched'> = $props()

	const viewDomId = $derived('liquidity-pool-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import LiquidityPool_TimestampsView from '$/views/LiquidityPool_TimestampsView.svelte'
	import LiquidityPoolFeeSchedulesView from '$/views/LiquidityPoolFeeSchedulesView.svelte'
</script>


<EntityView
	entityType={EntityType.LiquidityPool}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.id || 'liquidity pool')}
	href={
		href === undefined ?
			(
				selection.entitySelector.$network.caip2 !== undefined ?
					resolve(
						'/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]',
						{
							chainId: selection.entitySelector.$network.caip2.reference,
							poolId: selection.entitySelector.id,
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
		<TruncatedValue value={selection.entitySelector.id} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.id} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.id} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$baseToken}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Base token</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$quoteToken}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Quote token</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$hooks}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Hooks</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
									layout={EntityLayout.Value}
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
			id={viewDomId + '-carousel-liquidity-pool-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'liquidity-pool-timestamps',
						label: 'Observations',
					},
					{
						id: 'liquidity-pool-fee-schedules',
						label: 'Fee schedules',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLiquidityPoolTimestamps({ id, label })}
				<LiquidityPool_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No liquidity pool observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionLiquidityPoolFeeSchedules({ id, label })}
				<LiquidityPoolFeeSchedulesView
					selection={selection.$$feeSchedules}
					collapsible={false}
					title={label}
					emptyText='No fee schedules.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
