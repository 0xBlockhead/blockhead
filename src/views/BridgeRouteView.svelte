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

				<div>
					<dt>Gas (USD)</dt>
					<dd>
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.gasCostUsd !== undefined}
									<CurrencyAmount
										value={bridgeRoute.gasCostUsd}
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
							{#snippet children(bridgeRoute)}
								{#if bridgeRoute.estimatedDurationSeconds !== undefined}
									{String(bridgeRoute.estimatedDurationSeconds)} s
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Tags</dt>
					<dd>
						<ResourceBoundary
							resource={bridgeRoute}
							placeholderText="Loading route…"
						>
							{#snippet children(bridgeRoute)}
								{#if (bridgeRoute.tags ?? []).length}
									{(bridgeRoute.tags ?? []).join(', ')}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
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

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.BridgeRoute}
			{entityId}
		/>
	{/snippet}

	{@render children?.()}
</EntityView>
