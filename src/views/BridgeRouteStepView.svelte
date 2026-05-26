<script lang="ts">
	// Types/constants
	import {
		bridgeAssetOutcomes,
		bridgeRailById,
		bridgeRouteStepTypeByWire,
		bridgeSettlementModels,
		bridgeToolByKey,
		bridgeVerificationModels,
	} from '$/constants/Bridge.ts'

	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/bridge/route/[routeId]/step/[stepIndex]',
			{
				routeId: encodeURIComponent(stringify(entityId.$route)),
				stepIndex: String(entityId.index),
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BridgeRouteStep>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={step}
			placeholderText="Loading…"
		>
			{#snippet children(loadedStep)}
				{(
					step.tool != null && loadedStep.tool !== '' ?
						(bridgeToolByKey[loadedStep.tool]?.label ?? loadedStep.tool)
					:
						`Step ${entityId.index + 1}`
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			#{entityId.index}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One leg of a live bridge quote: tool, chains, and catalog mechanics when the provider names a LI.FI tool key.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary
						resource={step}
						placeholderText="Loading step…"
					>
						{#snippet children(loadedStep)}
							{#if loadedStep.stepType !== undefined}
								{bridgeRouteStepTypeByWire[loadedStep.stepType]?.label ?? loadedStep.stepType}
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
						{#snippet children(loadedStep)}
							{#if loadedStep.tool !== undefined}
								{(
									step.tool !== '' ?
										(bridgeToolByKey[loadedStep.tool]?.label ?? loadedStep.tool)
									:
										loadedStep.tool
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
							{#snippet children(loadedStep)}
								{#if loadedStep.railId !== undefined}
									{bridgeRailById[loadedStep.railId]?.label ?? loadedStep.railId}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Settlement</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(loadedStep)}
								{#if loadedStep.settlementModel !== undefined}
									{bridgeSettlementModels[loadedStep.settlementModel].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Verification</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(loadedStep)}
								{#if loadedStep.verificationModel !== undefined}
									{bridgeVerificationModels[loadedStep.verificationModel].label}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Asset outcome</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(loadedStep)}
								{#if loadedStep.assetOutcome !== undefined}
									{bridgeAssetOutcomes[loadedStep.assetOutcome].label}
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
						{#snippet children(loadedStep)}
							{#if loadedStep.$fromNetwork}
								<NetworkView
									entityId={loadedStep.$fromNetwork[EntityMetaKey.Id]}
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
						{#snippet children(loadedStep)}
							{#if loadedStep.$toNetwork}
								<NetworkView
									entityId={loadedStep.$toNetwork[EntityMetaKey.Id]}
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
							{#snippet children(loadedStep)}
								{#if loadedStep.$fromToken}
									<CoinInstanceView
										entityId={loadedStep.$fromToken[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryDetails}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>To token</dt>
					<dd>
						<ResourceBoundary
							resource={step}
							placeholderText="Loading step…"
						>
							{#snippet children(loadedStep)}
								{#if loadedStep.$toToken}
									<CoinInstanceView
										entityId={loadedStep.$toToken[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryDetails}
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

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.BridgeRouteStep}
			{entityId}
		/>
	{/snippet}
</EntityView>
