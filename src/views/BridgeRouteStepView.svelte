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
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
		selection,
		href = resolve(`/bridge/route/${encodeURIComponent(stringify(selection.entitySelector.$route))}/step/${String(selection.entitySelector.index)}`),
		open = $bindable(false),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteStep>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const step = $derived(selection({
		sources: [
			Source.Lifi_Rest,
		],
		fields: (
			open ?
				{
					$fromNetwork: true,
					$toNetwork: true,
					$fromToken: true,
					$toToken: true,
					stepType: true,
					tool: true,
					railId: true,
					settlementModel: true,
					verificationModel: true,
					assetOutcome: true,
				}
			:
				{}
		),
	}))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.index}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if open}
			<ResourceBoundary
				resource={step}
				placeholderText="Loading…"
			>
				{#snippet children(step)}
					{
						step.tool != null && step.tool !== '' ?
							(bridgeToolByKey[step.tool]?.label ?? step.tool)
						:
							`Step ${selection.entitySelector.index + 1}`
					}
				{/snippet}
			</ResourceBoundary>
		{:else}
			Step {selection.entitySelector.index + 1}
		{/if}
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
								{
									step.tool !== '' ?
										(bridgeToolByKey[step.tool]?.label ?? step.tool)
									:
										step.tool
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
									selection={select(EntityType.EvmNetwork, step.$fromNetwork[EntityMetaKey.Selector])}
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
							{#if step.$toNetwork}
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, step.$toNetwork[EntityMetaKey.Selector])}
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
								{#if step.$fromToken}
									<EvmCoinInstanceView
										selection={select(EntityType.EvmCoinInstance, step.$fromToken[EntityMetaKey.Selector])}
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
								{#if step.$toToken}
									<EvmCoinInstanceView
										selection={select(EntityType.EvmCoinInstance, step.$toToken[EntityMetaKey.Selector])}
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
