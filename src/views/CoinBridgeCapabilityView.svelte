<script lang="ts">
	// Types/constants
	import {
		bridgeRailById,
		bridgeToolByKey,
	} from '$/constants/Bridge.ts'
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.CoinBridgeCapability>
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
			| 'Heading'
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
	{href}
	bind:open
	{...entityViewRest}
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

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.toolKey}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A directed <strong>bridge capability</strong>
			from one coin deployment to another via a specific LI.FI tool / rail.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: capabilityHref })}
		<ResourceBoundary
			resource={capability}
			placeholderText="Loading capability…"
		>
			{#snippet children(capability)}
				<dl data-column-item="center">
					<div>
						<dt>Rail</dt>
						<dd>{bridgeRailById[capability.railId]?.label ?? capability.railId}</dd>
					</div>
					<div>
						<dt>Settlement</dt>
						<dd>{capability.settlementModel}</dd>
					</div>
					<div>
						<dt>Verification</dt>
						<dd>{capability.verificationModel}</dd>
					</div>
					<div>
						<dt>Asset outcome</dt>
						<dd>{capability.assetOutcome}</dd>
					</div>
					<div>
						<dt>From</dt>
						<dd>
							<CoinInstanceView
								entityId={entityId.$fromInstance}
								href={capabilityHref}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
					<div>
						<dt>To</dt>
						<dd>
							<CoinInstanceView
								entityId={entityId.$toInstance}
								href={capabilityHref}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.CoinBridgeCapability}
			{entityId}
		/>
	{/snippet}
</EntityView>
