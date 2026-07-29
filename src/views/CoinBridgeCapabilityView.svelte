<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.CoinBridgeCapability> = $props()

	const fromInstance = $derived(selection.entitySelector.$fromInstance)
	const toInstance = $derived(selection.entitySelector.$toInstance)
	const coinBridgeCapability = $derived(selection({
		fields: {
			railId: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.toolKey || 'Coin bridge capability')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinBridgeCapability}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'caip2' in fromInstance.$network
				&& (selection.entitySelector.$fromInstance.type === 'NativeCurrency' || '$contract' in fromInstance)
				&& 'caip2' in toInstance.$network
				&& (selection.entitySelector.$toInstance.type === 'NativeCurrency' || '$contract' in toInstance) ?
					resolve(
						'/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
						{
							fromChainId: fromInstance.$network.caip2.reference,
							fromCoinInstanceSlug: fromInstance.type === 'NativeCurrency' ? 'native' : fromInstance.$contract.address,
							toChainId: toInstance.$network.caip2.reference,
							toCoinInstanceSlug: toInstance.type === 'NativeCurrency' ? 'native' : toInstance.$contract.address,
							toolKey: selection.entitySelector.toolKey,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.toolKey || 'Coin bridge capability'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.toolKey || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={coinBridgeCapability}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.railId}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A supported bridge path between two EVM coin instances through a specific bridge tool.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Tool key</dt>
				<dd>
					{selection.entitySelector.toolKey}
				</dd>
			</div>

			<div>
				<dt>Rail ID</dt>
				<dd>
					<ResourceBoundary
						resource={coinBridgeCapability}
					>
						{#snippet children(entity)}
							{entity.railId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Settlement model</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									settlementModel: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.settlementModel}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Verification model</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									verificationModel: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.verificationModel}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset outcome</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetOutcome: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.assetOutcome}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>From instance</dt>
				<dd>
					<EvmCoinInstanceView
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$fromInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>To instance</dt>
				<dd>
					<EvmCoinInstanceView
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$toInstance)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
