<script lang="ts">
	// Types/constants
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
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]', {
			caip2Namespace: entityId.$network.caip2.namespace,
			caip2Reference: entityId.$network.caip2.reference,
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkTxpoolTimestamp = useEntity(
		EntityType.EvmNetwork_Txpool_Timestamp,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			pendingCount: {},
			queuedCount: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
	{entityId}
	href={href}
	{layout}
	{open}
	title="Mempool"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={networkTxpoolTimestamp}
			placeholderText="Loading mempool…"
		>
			{#snippet children(networkTxpoolTimestamp)}
				{#if networkTxpoolTimestamp.pendingCount !== undefined}
					<NumberValue value={networkTxpoolTimestamp.pendingCount} />
					pending
				{:else if networkTxpoolTimestamp.queuedCount !== undefined}
					<NumberValue value={networkTxpoolTimestamp.queuedCount} />
					queued
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={networkTxpoolTimestamp}
			placeholderText="Loading mempool…"
		>
			{#snippet children(networkTxpoolTimestamp)}
				{#if networkTxpoolTimestamp.pendingCount !== undefined}
					<NumberValue value={networkTxpoolTimestamp.pendingCount} />
					pending
				{:else if networkTxpoolTimestamp.queuedCount !== undefined}
					<NumberValue value={networkTxpoolTimestamp.queuedCount} />
					queued
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}
					</span>
				{/if}
	{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Txpool snapshots count pending and queued transactions from one execution node at one instant—mempool shape differs per client and peer view.
		</p>
		<p>
			Pending transactions are executable under current chain rules; queued ones wait on nonces, balances, or gas bounds before they can enter a block.
		</p>
	{/snippet}

	{#snippet Content({})}
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
						<dt>Pending</dt>
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
				{/if}

				{#if open}
					<div>
						<dt>Queued</dt>
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
</EntityView>
