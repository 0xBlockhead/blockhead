<script lang="ts">
	// Types/constants
	import {
		bridgeAssetOutcomes,
		bridgeRailById,
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


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(coins)/coin/[coinId]/bridge-capability/[capabilityId]',
			{
				coinId: entityId.$coin.coinId,
				capabilityId: entityId.capabilityId,
			},
		),
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
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
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
			{#snippet children(loadedCapability)}
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
						{#snippet children(loadedCapability)}
							{bridgeRailById[loadedCapability.railId]?.label ?? loadedCapability.railId}
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
						{#snippet children(loadedCapability)}
							{bridgeSettlementModels[loadedCapability.settlementModel].label}
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
						{#snippet children(loadedCapability)}
							{bridgeVerificationModels[loadedCapability.verificationModel].label}
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
						{#snippet children(loadedCapability)}
							{bridgeAssetOutcomes[loadedCapability.assetOutcome].label}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>From</dt>
				<dd>
					<CoinInstanceView
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
					<CoinInstanceView
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
		<EntityDetails
			entityType={EntityType.CoinBridgeCapability}
			{entityId}
		/>
	{/snippet}
</EntityView>
