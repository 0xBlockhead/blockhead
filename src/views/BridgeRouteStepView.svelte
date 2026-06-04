<script lang="ts">
	// Types/constants
	import {
		bridgeAssetOutcomeByAssetOutcome,
		bridgeRailById,
		bridgeRouteStepTypeByWire,
		bridgeSettlementModelBySettlementModel,
		bridgeToolByKey,
		bridgeVerificationModelByVerificationModel,
	} from '$/constants/Bridge.ts'

	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(`/bridge/route/${encodeURIComponent(stringify(entityId.$route))}/step/${String(entityId.index)}`),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BridgeRouteStep>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const step = useEntity(
		EntityType.BridgeRouteStep,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
			$fromNetwork: {},
			$toNetwork: {},
			$fromToken: {},
			$toToken: {},
			...(open && {
				stepType: {},
				tool: {},
				railId: {},
				settlementModel: {},
				verificationModel: {},
				assetOutcome: {},
			}),
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{entityId.index}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={step}
			placeholderText="Loading…"
		>
			{#snippet children(step)}
				{(
					step.tool != null && step.tool !== '' ?
						(bridgeToolByKey[step.tool]?.label ?? step.tool)
					:
						`Step ${entityId.index + 1}`
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One leg of a live bridge quote: tool, chains, and catalog mechanics when the provider names a LI.FI tool key.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary
						resource={step}
						placeholderText="Loading step…"
					>
						{#snippet children(step)}
							{#if step.stepType !== undefined}
								{bridgeRouteStepTypeByWire[step.stepType]?.label ?? step.stepType}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tool</dt>
				<dd>
					<ResourceBoundary
						resource={step}
						placeholderText="Loading step…"
					>
						{#snippet children(step)}
							{#if step.tool !== undefined}
								{(
									step.tool !== '' ?
										(bridgeToolByKey[step.tool]?.label ?? step.tool)
									:
										step.tool
								)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Rail</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(step)}
								{#if step.railId !== undefined}
									{bridgeRailById[step.railId]?.label ?? step.railId}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Settlement</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(step)}
								{#if step.settlementModel !== undefined}
									{bridgeSettlementModelBySettlementModel[step.settlementModel].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Verification</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(step)}
								{#if step.verificationModel !== undefined}
									{bridgeVerificationModelByVerificationModel[step.verificationModel].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Asset outcome</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(step)}
								{#if step.assetOutcome !== undefined}
									{bridgeAssetOutcomeByAssetOutcome[step.assetOutcome].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>From chain</dt>
				<dd>
					<ResourceBoundary
						resource={step}
						placeholderText="Loading step…"
					>
						{#snippet children(step)}
							{#if step.$fromNetwork}
								<EvmNetworkView
									entityId={step.$fromNetwork[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>To chain</dt>
				<dd>
					<ResourceBoundary
						resource={step}
						placeholderText="Loading step…"
					>
						{#snippet children(step)}
							{#if step.$toNetwork}
								<EvmNetworkView
									entityId={step.$toNetwork[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>From token</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(step)}
								{#if step.$fromToken}
									<EvmCoinInstanceView
										entityId={step.$fromToken[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>To token</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(step)}
								{#if step.$toToken}
									<EvmCoinInstanceView
										entityId={step.$toToken[EntityMetaKey.Id]}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}
</EntityView>
