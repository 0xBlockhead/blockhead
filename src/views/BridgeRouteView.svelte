<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/bridge/route/[routeId]',
			{ routeId: encodeURIComponent(stringify(entityId)) },
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BridgeRoute>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const bridgeRoute = useEntity(
		EntityType.BridgeRoute,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
			$fromNetwork: {},
			$toNetwork: {},
			...(open && {
				fromAmount: {},
				toAmount: {},
				toAmountMin: {},
				estimatedCostUsd: {},
				estimatedDurationSeconds: {},
				$$steps: {
					$: [
						Source.Constants_Internal,
						Source.Lifi_Rest,
					],
				},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BridgeRouteStepsView from '$/views/BridgeRouteStepsView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRoute}
	bind:open
	{entityId}
	href={href}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			LI.FI quote
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={bridgeRoute}
			placeholderText="Loading…"
		>
			{#snippet children(bridgeRoute)}
				{entityId.fromChainId}
				→
				{entityId.toChainId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Live executable bridge quote from LI.FI (<code>GET /v1/quote</code>): amounts, gas estimate, and ordered steps.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>From chain</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeRoute}
						placeholderText="Loading route…"
					>
						{#snippet children(bridgeRoute)}
							<EvmNetworkView
								entityId={
									bridgeRoute.$fromNetwork?.[EntityMetaKey.Id]
									?? { chainId: entityId.fromChainId }
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>To chain</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeRoute}
						placeholderText="Loading route…"
					>
						{#snippet children(bridgeRoute)}
							<EvmNetworkView
								entityId={
									bridgeRoute.$toNetwork?.[EntityMetaKey.Id]
									?? { chainId: entityId.toChainId }
								}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
				{#if open}
					<div>
						<dt>From token</dt>
					<dd>
						<TruncatedValue
							value={entityId.fromToken}
							format={TruncatedValueFormat.Visual}
						/>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>To token</dt>
					<dd>
						<TruncatedValue
							value={entityId.toToken}
							format={TruncatedValueFormat.Visual}
						/>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>From address</dt>
					<dd>
						<EvmNetworkAccountView
							entityId={{
								$network: { chainId: entityId.fromChainId },
								$actor: { address: entityId.fromAddress },
							}}
							layout={EntityLayout.Value}
							open={false}
						/>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Slippage</dt>
						<dd>{String(entityId.slippage)}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Request amount</dt>
					<dd data-text="font-monospace">
						{entityId.fromAmount}
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>From amount</dt>
					<dd data-text="font-monospace">
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.fromAmount !== undefined}
									{String(bridgeRoute.fromAmount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>To amount</dt>
					<dd data-text="font-monospace">
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.toAmount !== undefined}
									{String(bridgeRoute.toAmount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Min received</dt>
					<dd data-text="font-monospace">
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.toAmountMin !== undefined}
									{String(bridgeRoute.toAmountMin)}
								{/if}
							{/snippet}
						</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Estimated cost</dt>
					<dd>
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.estimatedCostUsd !== undefined}
									<CurrencyAmount
										value={bridgeRoute.estimatedCostUsd}
										scale={1}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>ETA</dt>
					<dd>
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.estimatedDurationSeconds !== undefined}
									{String(bridgeRoute.estimatedDurationSeconds)} s
								{/if}
							{/snippet}
						</ResourceBoundary>
						</dd>
					</div>
				{/if}
		</dl>

		{#if open}
			<BridgeRouteStepsView
				href={resolve('/bridge')}
				entityFieldReference={{
					entityType: EntityType.BridgeRoute,
					entityId,
					fieldName: '$$steps',
				}}
				id={`${stringify(entityId)}:steps`}
			/>
		{/if}
	{/snippet}

	{#snippet Details({ open })}
	{/snippet}

	{@render children?.()}
</EntityView>
