<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BridgeRoute>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
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
			...(open && {
				$fromNetwork: {},
				$toNetwork: {},
				fromAmount: {},
				toAmount: {},
				toAmountMin: {},
				gasCostUsd: {},
				estimatedDurationSeconds: {},
				tags: {},
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
	import BridgeRouteStepsView from '$/views/BridgeRouteStepsView.svelte'
	import CurrencyAmount from '$/views/CurrencyAmount.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRoute}
	bind:open
	{entityId}
	{href}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
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

	{#snippet Title()}
		<span data-text="font-monospace">
			LI.FI quote
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Live executable bridge quote from LI.FI (<code>GET /v1/quote</code>): amounts, gas estimate, and ordered steps.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: routeHref })}
		<ResourceBoundary
			resource={bridgeRoute}
			placeholderText="Loading route…"
		>
			{#snippet children(bridgeRoute)}
				<dl data-column-item="center">
					<div>
						<dt>From chain</dt>
						<dd>
							<NetworkView
								entityId={{ chainId: entityId.fromChainId }}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]',
									{ networkId: String(entityId.fromChainId) },
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					<div>
						<dt>To chain</dt>
						<dd>
							<NetworkView
								entityId={{ chainId: entityId.toChainId }}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]',
									{ networkId: String(entityId.toChainId) },
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					{#if open}
						{#if bridgeRoute.fromAmount !== undefined}
							<div>
								<dt>From amount</dt>
								<dd data-text="font-monospace">{String(bridgeRoute.fromAmount)}</dd>
							</div>
						{/if}

						{#if bridgeRoute.toAmount !== undefined}
							<div>
								<dt>To amount</dt>
								<dd data-text="font-monospace">{String(bridgeRoute.toAmount)}</dd>
							</div>
						{/if}

						{#if bridgeRoute.toAmountMin !== undefined}
							<div>
								<dt>Min received</dt>
								<dd data-text="font-monospace">{String(bridgeRoute.toAmountMin)}</dd>
							</div>
						{/if}

						{#if bridgeRoute.gasCostUsd !== undefined}
							<div>
								<dt>Gas (USD)</dt>
								<dd>
									<CurrencyAmount
										value={bridgeRoute.gasCostUsd}
										scale={1}
									/>
								</dd>
							</div>
						{/if}

						{#if bridgeRoute.estimatedDurationSeconds !== undefined}
							<div>
								<dt>ETA</dt>
								<dd>{String(bridgeRoute.estimatedDurationSeconds)} s</dd>
							</div>
						{/if}

						{#if (bridgeRoute.tags ?? []).length}
							<div>
								<dt>Tags</dt>
								<dd>{(bridgeRoute.tags ?? []).join(', ')}</dd>
							</div>
						{/if}
					{/if}
				</dl>

				{#if open}
					<BridgeRouteStepsView
						entityFieldReference={{
							entityType: EntityType.BridgeRoute,
							entityId,
							fieldName: '$$steps',
						}}
						href={routeHref}
						id={`${stringify(entityId)}:steps`}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.BridgeRoute}
			{entityId}
		/>
	{/snippet}

	{@render children?.()}
</EntityView>
