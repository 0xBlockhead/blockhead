<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
			caip2: ,
		}),
		layout,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmNetwork_Txpool_Timestamp>
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
	import { proxy } from '$/routes/+layout.svelte'

	const networkTxpoolTimestamp = $derived(proxy(
		EntityType.EvmNetwork_Txpool_Timestamp,
		selector,
		{
			sources: [
				Source.Voltaire_JsonRpc,
			],
		},
	))
	const pendingCount = $derived(networkTxpoolTimestamp.pendingCount)
	const queuedCount = $derived(networkTxpoolTimestamp.queuedCount)



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_Txpool_Timestamp}
	entitySelector={selector}
	href={href}
	{layout}
	{open}
	title="Mempool"
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={pendingCount}
			placeholderText="Loading mempool…"
		>
			{#snippet children(pendingCount)}
				{#if pendingCount !== undefined}
					<NumberValue value={pendingCount} />
					pending
				{:else if queuedCount !== undefined}
					<NumberValue value={queuedCount} />
					queued
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`))}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={pendingCount}
			placeholderText="Loading mempool…"
		>
			{#snippet children(pendingCount)}
				{#if pendingCount !== undefined}
					<NumberValue value={pendingCount} />
					pending
				{:else if queuedCount !== undefined}
					<NumberValue value={queuedCount} />
					queued
				{:else}
					<span>
						chain {String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`))}
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
						timestamp={selector.timestampMs}
					/>
				</dd>
				</div>
				{#if open}
					<div>
						<dt>Pending</dt>
						<dd>
							<ResourceBoundary
								placeholderText="Loading mempool snapshot…"
								resource={pendingCount}
							>
								{#snippet children(networkTxpoolTimestamp)}
									<NumberValue value={pendingCount} />
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
								resource={pendingCount}
							>
								{#snippet children(networkTxpoolTimestamp)}
									<NumberValue value={queuedCount} />
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
		</dl>
	{/snippet}
</EntityView>
