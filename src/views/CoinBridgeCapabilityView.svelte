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
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
			selection,
			href,
			open = $bindable(true),
			collapsible = true,
			...EntityViewProps
	}: WithRest<
		{
				selection: EntityProxyResource<typeof schema, EntityType.CoinBridgeCapability>
				href?: string
				open?: boolean
				collapsible?: boolean
			},
			Pick<
				ComponentProps<typeof EntityView>,
				| 'layout'
			>
		> = $props()

	const capability = $derived(selection( { sources: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			], fields: { ...(open && ({ railId: true, settlementModel: true, verificationModel: true, assetOutcome: true })) } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
		entityType={EntityType.CoinBridgeCapability}
		entitySelector={selection.entitySelector}
		href={href}
		bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{bridgeToolByKey[selection.entitySelector.toolKey]?.label ?? selection.entitySelector.toolKey}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={capability}
			placeholderText="Loading…"
		>
			{#snippet children(capability)}
				{bridgeToolByKey[selection.entitySelector.toolKey]?.label ?? selection.entitySelector.toolKey}
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
							{capability.railId == null ? '–' : bridgeRailById[capability.railId]?.label ?? capability.railId}
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
							{capability.settlementModel == null ? '–' : bridgeSettlementModelBySettlementModel[capability.settlementModel].label}
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
							{capability.verificationModel == null ? '–' : bridgeVerificationModelByVerificationModel[capability.verificationModel].label}
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
							{capability.assetOutcome == null ? '–' : bridgeAssetOutcomeByAssetOutcome[capability.assetOutcome].label}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>From</dt>
				<dd>
					<EvmCoinInstanceView
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$fromInstance)}
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
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$toInstance)}
						layout={EntityLayout.Value}
						open={true}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
