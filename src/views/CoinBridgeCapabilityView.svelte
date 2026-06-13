<script lang="ts">
	// Types/constants
	import {
		bridgeAssetOutcomeByAssetOutcome,
		bridgeRailById,
		bridgeSettlementModelBySettlementModel,
		bridgeToolByKey,
		bridgeVerificationModelByVerificationModel,
	} from '$/constants/Bridge.ts'

	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.CoinBridgeCapability>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const capability = subscribe(EntityType.CoinBridgeCapability,
		entityId,
		({ sources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			], fields: { ...(open && ({ railId: true, settlementModel: true, verificationModel: true, assetOutcome: true })) } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinBridgeCapability}
	{entityId}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{bridgeToolByKey[entityId.toolKey]?.label ?? entityId.toolKey}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={capability}
			placeholderText="Loading…"
		>
			{#snippet children(capability)}
				{bridgeToolByKey[entityId.toolKey]?.label ?? entityId.toolKey}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A directed <strong>bridge capability</strong>
			from one coin deployment to another via a specific LI.FI tool / rail.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Rail</dt>
				<dd>
					<ResourceBoundary
						resource={capability}
						placeholderText="Loading capability…"
					>
						{#snippet children(capability)}
							{capability.fields.railId == null ? '–' : bridgeRailById[capability.fields.railId]?.label ?? capability.fields.railId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Settlement</dt>
				<dd>
					<ResourceBoundary
						resource={capability}
						placeholderText="Loading capability…"
					>
						{#snippet children(capability)}
							{capability.fields.settlementModel == null ? '–' : bridgeSettlementModelBySettlementModel[capability.fields.settlementModel].label}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Verification</dt>
				<dd>
					<ResourceBoundary
						resource={capability}
						placeholderText="Loading capability…"
					>
						{#snippet children(capability)}
							{capability.fields.verificationModel == null ? '–' : bridgeVerificationModelByVerificationModel[capability.fields.verificationModel].label}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Asset outcome</dt>
				<dd>
					<ResourceBoundary
						resource={capability}
						placeholderText="Loading capability…"
					>
						{#snippet children(capability)}
							{capability.fields.assetOutcome == null ? '–' : bridgeAssetOutcomeByAssetOutcome[capability.fields.assetOutcome].label}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>From</dt>
				<dd>
					<EvmCoinInstanceView
						entityId={entityId.$fromInstance}
						layout={EntityLayout.Value}
						open={true}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
			<div>
				<dt>To</dt>
				<dd>
					<EvmCoinInstanceView
						entityId={entityId.$toInstance}
						layout={EntityLayout.Value}
						open={true}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
