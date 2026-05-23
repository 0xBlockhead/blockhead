<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityId: EntityId<typeof schema, EntityType.Network_Txpool_Timestamp>
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


	// State
	const networkTxpoolTimestamp = useEntity(
		EntityType.Network_Txpool_Timestamp,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			pendingCount: {},
			queuedCount: {},
		},
	)

	const defaultHref = resolve(
		'/(explore)/(networks)/network/[networkId]',
		{ networkId: String(entityId.$network.chainId) },
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.Network_Txpool_Timestamp}
	{entityId}
	href={href ?? defaultHref}
	{layout}
	{open}
	title="Mempool"
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Heading()}
		<Timestamp
			timestamp={entityId.timestampMs}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Txpool snapshots count pending and queued transactions from one execution node at one instant—mempool shape differs per client and peer view.
		</p>
		<p>
			Pending transactions are executable under current chain rules; queued ones wait on nonces, balances, or gas bounds before they can enter a block.
		</p>
	{/snippet}

	{#snippet Title()}
		<span>
			chain {String(entityId.$network.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">

			<div>
				<dt>As of</dt>
				<dd>
					<Timestamp
						timestamp={entityId.timestampMs}
					/>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Pending (executable)</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading mempool snapshot…"
							resource={networkTxpoolTimestamp}
						>
							{#snippet children(networkTxpoolTimestamp)}
								<NumberValue value={networkTxpoolTimestamp.pendingCount} />
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Queued (non-executable)</dt>
					<dd>
						<ResourceBoundary
							placeholderText="Loading mempool snapshot…"
							resource={networkTxpoolTimestamp}
						>
							{#snippet children(networkTxpoolTimestamp)}
								<NumberValue value={networkTxpoolTimestamp.queuedCount} />
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.Network_Txpool_Timestamp}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
