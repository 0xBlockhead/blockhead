<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Network_GasFee_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	const gasFeeLive = useEntity(
		EntityType.Network_GasFee_Timestamp,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			baseFeePerGas: {},
			legacyGasPrice: {},
			maxPriorityFeePerGas: {},
			gasUsedRatioLastBlock: {},
			priorityFeeRewardAt50thPercentile: {},
		},
	)


	const defaultHref = resolve(
		'/(explore)/(networks)/network/[networkId]',
		{ networkId: String(entityId.$network.chainId) },
	)
</script>


<EntityView
	entityType={EntityType.Network_GasFee_Timestamp}
	{entityId}
	href={href ?? defaultHref}
	{layout}
	{open}
	title="Gas fee snapshot"
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{String(entityId.timestampNs)}
		</span>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			placeholderText="Loading gas snapshot…"
			resource={gasFeeLive}
		>
			{#snippet children(g)}
				{@const timestampMs = Number(entityId.timestampNs / 1_000_000n)}
				<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

					<div>
						<dt>As of</dt>
						<dd>
							<Timestamp
								format={TimestampFormat.Both}
								timestamp={timestampMs}
							/>
						</dd>
					</div>
					{#if open}
						{#if g.baseFeePerGas !== undefined}
							<div>
								<dt>Base fee</dt>
								<dd>
									<NumberValue value={g.baseFeePerGas} /> wei
								</dd>
							</div>
						{/if}

						{#if g.legacyGasPrice !== undefined}
							<div>
								<dt>Legacy gas price</dt>
								<dd>
									<NumberValue value={g.legacyGasPrice} /> wei
								</dd>
							</div>
						{/if}

						{#if g.maxPriorityFeePerGas !== undefined}
							<div>
								<dt>Max priority fee</dt>
								<dd>
									<NumberValue value={g.maxPriorityFeePerGas} /> wei
								</dd>
							</div>
						{/if}

						{#if g.gasUsedRatioLastBlock !== undefined}
							<div>
								<dt>Gas used ratio (last fee-history block)</dt>
								<dd>{String(g.gasUsedRatioLastBlock)}</dd>
							</div>
						{/if}

						{#if g.priorityFeeRewardAt50thPercentile !== undefined}
							<div>
								<dt>Priority fee at 50th percentile</dt>
								<dd>
									<NumberValue value={g.priorityFeeRewardAt50thPercentile} /> wei
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Network_GasFee_Timestamp}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
