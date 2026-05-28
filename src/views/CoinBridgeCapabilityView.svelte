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
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


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
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const capability = useEntity(
		EntityType.CoinBridgeCapability,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
			...(open && {
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
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinBridgeCapability}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={capability}
			placeholderText="Loading…"
		>
			{#snippet children(capability)}
				{bridgeToolByKey[entityId.toolKey]?.label ?? entityId.toolKey}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{bridgeToolByKey[entityId.toolKey]?.label ?? entityId.toolKey}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A directed <strong>bridge capability</strong>
			from one coin deployment to another via a specific LI.FI tool / rail.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: capabilityHref })}
		<dl data-column-item="center">
			<div>
				<dt>Rail</dt>
				<dd>
					<ResourceBoundary
						resource={capability}
						placeholderText="Loading capability…"
					>
						{#snippet children(capability)}
							{bridgeRailById[capability.railId]?.label ?? capability.railId}
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
							{bridgeSettlementModelBySettlementModel[capability.settlementModel].label}
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
							{bridgeVerificationModelByVerificationModel[capability.verificationModel].label}
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
							{bridgeAssetOutcomeByAssetOutcome[capability.assetOutcome].label}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>From</dt>
				<dd>
					<EvmCoinInstanceView
						entityId={entityId.$fromInstance}
						layout={EntityLayout.SummaryDetails}
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
						layout={EntityLayout.SummaryDetails}
						open={true}
						showTypeAnnotation={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
	{/snippet}
</EntityView>
