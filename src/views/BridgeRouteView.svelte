<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(`/bridge/route/${encodeURIComponent(stringify(selection.entitySelector))}`),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRoute>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	const bridgeRoute = $derived(selection( { sources: [
				Source.Lifi_Rest,
			], fields: { $fromNetwork: true, $toNetwork: true, ...(open && ({ fromAmount: true, toAmount: true, toAmountMin: true, estimatedCostUsd: true, estimatedDurationSeconds: true, $$steps: ({ sources: [
						Source.Lifi_Rest,
					] }) })) } }))


	// Components
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
	entitySelector={selection.entitySelector}
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
				{selection.entitySelector.fromChainId}
				→
				{selection.entitySelector.toChainId}
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
								selection={select(EntityType.EvmNetwork, bridgeRoute.fields.$fromNetwork?.[EntityMetaKey.Selector]
									?? {
										caip2: {
											namespace: 'eip155',
											reference: String(selection.entitySelector.fromChainId),
										},
									})}
								layout={EntityLayout.Title}

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
								selection={select(EntityType.EvmNetwork, bridgeRoute.fields.$toNetwork?.[EntityMetaKey.Selector]
									?? {
										caip2: {
											namespace: 'eip155',
											reference: String(selection.entitySelector.toChainId),
										},
									})}
								layout={EntityLayout.Title}

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
							value={selection.entitySelector.fromToken}
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
							value={selection.entitySelector.toToken}
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
							selection={select(EntityType.EvmNetworkAccount, {
								$network: {
									caip2: {
										namespace: 'eip155',
										reference: String(selection.entitySelector.fromChainId),
									},
								},
								$actor: { address: selection.entitySelector.fromAddress },
							})}
							layout={EntityLayout.Value}

						/>
						</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Slippage</dt>
						<dd>{String(selection.entitySelector.slippage)}</dd>
					</div>
				{/if}

				{#if open}
					<div>
						<dt>Request amount</dt>
					<dd data-text="font-monospace">
						{selection.entitySelector.fromAmount}
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
								{#if bridgeRoute.fields.fromAmount !== undefined}
									{String(bridgeRoute.fields.fromAmount)}
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
								{#if bridgeRoute.fields.toAmount !== undefined}
									{String(bridgeRoute.fields.toAmount)}
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
								{#if bridgeRoute.fields.toAmountMin !== undefined}
									{String(bridgeRoute.fields.toAmountMin)}
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
								{#if bridgeRoute.fields.estimatedCostUsd !== undefined}
									<CurrencyAmount
										value={bridgeRoute.fields.estimatedCostUsd}
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
								{#if bridgeRoute.fields.estimatedDurationSeconds !== undefined}
									{String(bridgeRoute.fields.estimatedDurationSeconds)} s
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
				selection={selection.$$steps}
				id={`${stringify(selection.entitySelector)}:steps`}
			/>
		{/if}
	{/snippet}
</EntityView>
