<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BalancerPoolEvent> = $props()

	const pool = $derived(selection.entitySelector.$pool)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Balancer_Rest,
		],
	}))
	const balancerPoolEvent = $derived(viewSelection({
		fields: {
			eventType: true,
			valueUsd: true,
		},
	}))
	const titleFallback = $derived((prefetched.eventType ?? '') || 'Balancer pool event')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BalancerPoolEvent}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/event/[eventId=stringSegment]',
				{
					network: (
						'caip2' in pool.$network ?
							caip2StringFromValue(pool.$network.caip2)
						:
							pool.$network.slug
					),
					poolId: pool.poolId,
					eventId: encodeURIComponent(selection.entitySelector.eventId),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={balancerPoolEvent}>
			{#snippet children(entity)}
				{entity.eventType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={balancerPoolEvent}>
			{#snippet children(entity)}
				{String(entity.valueUsd)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<BalancerPoolView
				selection={select(EntityType.BalancerPool, selection.entitySelector.$pool)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<BalancerPoolView
						selection={select(EntityType.BalancerPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Event type</dt>
				<dd>
					<ResourceBoundary
						resource={balancerPoolEvent}
					>
						{#snippet children(entity)}
							{entity.eventType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.eventId} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$transaction}
					>
						{#snippet children(evmTransaction)}
							{@const evmTransactionInitial = untrack(() => evmTransaction)}
							<EvmTransactionView
								selection={select(EntityType.EvmTransaction, (evmTransaction ?? evmTransactionInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>User</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$user}
					>
						{#snippet children(evmNetworkAccount)}
							{@const evmNetworkAccountInitial = untrack(() => evmNetworkAccount)}
							<EvmNetworkAccountView
								selection={select(EntityType.EvmNetworkAccount, (evmNetworkAccount ?? evmNetworkAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(evmBlock)}
							{@const evmBlockInitial = untrack(() => evmBlock)}
							<EvmBlockView
								selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
								prefetched={evmBlock ?? evmBlockInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Occurred at</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									occurredAtMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.occurredAtMs} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Value (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={balancerPoolEvent}
					>
						{#snippet children(entity)}
							{entity.valueUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
