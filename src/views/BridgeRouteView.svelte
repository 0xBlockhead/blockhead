<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { bridgeRouteTagByTag } from '$/constants/Bridge.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BridgeRoute>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lifi_Rest,
		],
	}))
	const bridgeRoute = $derived(viewSelection({
		fields: {
			estimatedCostUsd: true,
			estimatedDurationSeconds: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BridgeRouteStepsView from '$/views/BridgeRouteStepsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRoute}
	entitySelector={selection.entitySelector}
	title={title ?? ([String(selection.entitySelector.fromChainId), 'to', String(selection.entitySelector.toChainId)].filter(Boolean).join(' ') || 'bridge route')}
	href={
		href === undefined ?
			resolve(
				'/~/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
				{
					fromChainId: String(selection.entitySelector.fromChainId),
					toChainId: String(selection.entitySelector.toChainId),
					fromToken: selection.entitySelector.fromToken,
					toToken: selection.entitySelector.toToken,
					fromAmount: String(selection.entitySelector.fromAmount),
					fromAddress: selection.entitySelector.fromAddress,
					slippage: String(selection.entitySelector.slippage),
					toAddress: selection.entitySelector.toAddress,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		LI.FI quote
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bridgeRoute}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.estimatedCostUsd}
				</span>

				<span data-text="muted">
					{entity.estimatedDurationSeconds}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>From network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$fromNetwork}
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
				<dt>To network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$toNetwork}
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>From token</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.fromToken} />
				</dd>
			</div>

			<div>
				<dt>To token</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.toToken} />
				</dd>
			</div>

			<div>
				<dt>From address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.fromAddress} />
				</dd>
			</div>

			<div>
				<dt>To address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.toAddress} />
				</dd>
			</div>

			<div>
				<dt>From amount</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.fromAmount}
					/>
				</dd>
			</div>

			<div>
				<dt>To amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									toAmount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.toAmount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To amount min</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									toAmountMin: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.toAmountMin}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slippage</dt>
				<dd>
					{selection.entitySelector.slippage}
				</dd>
			</div>

			<div>
				<dt>Estimated cost USD</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeRoute}
					>
						{#snippet children(entity)}
							{entity.estimatedCostUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Estimated duration seconds</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeRoute}
					>
						{#snippet children(entity)}
							{entity.estimatedDurationSeconds}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tags</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									tags: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.tags.map((tag) => bridgeRouteTagByTag[tag].label).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const stepsResource = selection.$$steps}
		<ResourceBoundary
			resource={stepsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BridgeRouteStepsView
						selection={stepsResource}
						countResource={stepsResource.count}
						title='Steps'
						id='steps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
