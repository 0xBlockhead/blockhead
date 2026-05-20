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


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BridgeRouteStep>
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


	const step = useEntity(
		EntityType.BridgeRouteStep,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
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
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
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

	{#snippet Title()}
		<span data-text="font-monospace">
			#{entityId.index}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One leg of a live bridge quote: tool, chains, and catalog mechanics when the provider names a LI.FI tool key.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={step}
			placeholderText="Loading step…"
		>
			{#snippet children(step)}
				<dl data-column-item="center">
					{#if step.stepType !== undefined}
						<div>
							<dt>Type</dt>
							<dd>{step.stepType}</dd>
						</div>
					{/if}

					{#if step.tool !== undefined}
						<div>
							<dt>Tool</dt>
							<dd>{step.tool}</dd>
						</div>
					{/if}

					{#if open}
						{#if step.railId !== undefined}
							<div>
								<dt>Rail</dt>
								<dd>{bridgeRailById[step.railId]?.label ?? step.railId}</dd>
							</div>
						{/if}

						{#if step.settlementModel !== undefined}
							<div>
								<dt>Settlement</dt>
								<dd>{step.settlementModel}</dd>
							</div>
						{/if}

						{#if step.verificationModel !== undefined}
							<div>
								<dt>Verification</dt>
								<dd>{step.verificationModel}</dd>
							</div>
						{/if}

						{#if step.assetOutcome !== undefined}
							<div>
								<dt>Asset outcome</dt>
								<dd>{step.assetOutcome}</dd>
							</div>
						{/if}
					{/if}

					<div>
						<dt>From chain</dt>
						<dd>
							<NetworkView
								entityId={{ chainId: entityId.$route.fromChainId }}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]',
									{ networkId: String(entityId.$route.fromChainId) },
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
								entityId={{ chainId: entityId.$route.toChainId }}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]',
									{ networkId: String(entityId.$route.toChainId) },
								)}
								layout={EntityLayout.Title}
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
			entityType={EntityType.BridgeRouteStep}
			{entityId}
		/>
	{/snippet}
</EntityView>
