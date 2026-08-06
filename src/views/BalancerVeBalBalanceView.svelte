<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BalancerVeBalBalance> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Balancer_Rest,
		],
	}))
	const balancerVeBalBalance = $derived(viewSelection({
		fields: {
			balance: true,
			locked: true,
			lockedUsd: true,
		},
	}))
	const titleFallback = $derived((prefetched.balance ?? '') || 'Balancer veBAL balance')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BalancerVeBalBalance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={balancerVeBalBalance}>
			{#snippet children(entity)}
				{entity.balance || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={balancerVeBalBalance}>
			{#snippet children(entity)}
				{[entity.locked, entity.lockedUsd].filter(Boolean).join(' ') || entity.balance || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmNetworkAccountView
				selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={balancerVeBalBalance}
					>
						{#snippet children(entity)}
							{entity.balance}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Locked</dt>
				<dd>
					<ResourceBoundary
						resource={balancerVeBalBalance}
					>
						{#snippet children(entity)}
							{entity.locked}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Locked (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={balancerVeBalBalance}
					>
						{#snippet children(entity)}
							{entity.lockedUsd}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rank: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rank = entity.rank}
					{#if rank != null}
						<div>
							<dt>Rank</dt>
							<dd>
								<NumberValue
									value={rank}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
