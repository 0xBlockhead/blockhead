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
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(`/bridge/route/${encodeURIComponent(stringify(selector.$route))}/step/${String(selector.index)}`),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BridgeRouteStep>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const step = $derived(select(EntityType.BridgeRouteStep, selector, ({ sources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			], fields: { $fromNetwork: true, $toNetwork: true, $fromToken: true, $toToken: true, ...(open && ({ stepType: true, tool: true, railId: true, settlementModel: true, verificationModel: true, assetOutcome: true })) } })))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selector.index}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={step}
			placeholderText="Loading…"
		>
			{#snippet children(step)}
				{
					step.fields.tool != null && step.fields.tool !== '' ?
						(bridgeToolByKey[step.fields.tool]?.label ?? step.fields.tool)
					:
						`Step ${selector.index + 1}`
				}
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
							{#if step.fields.stepType !== undefined}
								{bridgeRouteStepTypeByWire[step.fields.stepType]?.label ?? step.fields.stepType}
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
							{#if step.fields.tool !== undefined}
								{
									step.fields.tool !== '' ?
										(bridgeToolByKey[step.fields.tool]?.label ?? step.fields.tool)
									:
										step.fields.tool
								}
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
								{#if step.fields.railId !== undefined}
									{bridgeRailById[step.fields.railId]?.label ?? step.fields.railId}
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
								{#if step.fields.settlementModel !== undefined}
									{bridgeSettlementModelBySettlementModel[step.fields.settlementModel].label}
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
								{#if step.fields.verificationModel !== undefined}
									{bridgeVerificationModelByVerificationModel[step.fields.verificationModel].label}
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
								{#if step.fields.assetOutcome !== undefined}
									{bridgeAssetOutcomeByAssetOutcome[step.fields.assetOutcome].label}
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
							{#if step.fields.$fromNetwork}
								<EvmNetworkView
									selector={step.fields.$fromNetwork[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

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
							{#if step.fields.$toNetwork}
								<EvmNetworkView
									selector={step.fields.$toNetwork[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

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
								{#if step.fields.$fromToken}
									<EvmCoinInstanceView
										selector={step.fields.$fromToken[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}

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
								{#if step.fields.$toToken}
									<EvmCoinInstanceView
										selector={step.fields.$toToken[EntityMetaKey.Selector]}
										layout={EntityLayout.Title}

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
