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


	// Props
	let {
		entityId,
		href = resolve(
			'/bridge/route/[routeId]',
			{ routeId: entityId.routeId },
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
				gasCostUsd: {},
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
	import Address from '$/views/Address.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRoute}
	bind:open
	{entityId}
	href={href}
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={bridgeRoute}
			placeholderText="Loading…"
		>
			{#snippet children(loadedBridgeRoute)}
				{entityId.fromChainId}
				→
				{entityId.toChainId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			LI.FI quote
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Live executable bridge quote from LI.FI (<code>GET /v1/quote</code>): amounts, gas estimate, and ordered steps.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: routeHref })}
		<dl data-column-item="center">
			<div>
				<dt>From chain</dt>
				<dd>
					<ResourceBoundary
						resource={bridgeRoute}
						placeholderText="Loading route…"
					>
						{#snippet children(loadedBridgeRoute)}
							<NetworkView
								entityId={
									loadedBridgeRoute.$fromNetwork?.[EntityMetaKey.Id]
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
						{#snippet children(loadedBridgeRoute)}
							<NetworkView
								entityId={
									loadedBridgeRoute.$toNetwork?.[EntityMetaKey.Id]
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

				<div>
					<dt>To token</dt>
					<dd>
						<TruncatedValue
							value={entityId.toToken}
							format={TruncatedValueFormat.Visual}
						/>
					</dd>
				</div>

				<div>
					<dt>From address</dt>
					<dd>
						<Address
							address={entityId.fromAddress}
						/>
					</dd>
				</div>

				<div>
					<dt>Slippage</dt>
					<dd>{String(entityId.slippage)}</dd>
				</div>

				<div>
					<dt>Request amount</dt>
					<dd data-text="font-monospace">
						{entityId.fromAmount}
					</dd>
				</div>

				<div>
					<dt>From amount (base units)</dt>
					<dd data-text="font-monospace">
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(loadedBridgeRoute)}
								{#if loadedBridgeRoute.fromAmount !== undefined}
									{String(bridgeRoute.fromAmount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>To amount (base units)</dt>
					<dd data-text="font-monospace">
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(loadedBridgeRoute)}
								{#if loadedBridgeRoute.toAmount !== undefined}
									{String(bridgeRoute.toAmount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Min received (base units)</dt>
					<dd data-text="font-monospace">
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(loadedBridgeRoute)}
								{#if loadedBridgeRoute.toAmountMin !== undefined}
									{String(bridgeRoute.toAmountMin)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Est. fees (USD)</dt>
					<dd>
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(loadedBridgeRoute)}
								{#if loadedBridgeRoute.gasCostUsd !== undefined}
									<CurrencyAmount
										value={loadedBridgeRoute.gasCostUsd}
										scale={1}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>ETA</dt>
					<dd>
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(loadedBridgeRoute)}
								{#if loadedBridgeRoute.estimatedDurationSeconds !== undefined}
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

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.BridgeRoute}
			{entityId}
		/>
	{/snippet}

	{@render children?.()}
</EntityView>

