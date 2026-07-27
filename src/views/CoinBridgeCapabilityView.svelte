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

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const coinBridgeCapability = $derived(selection({
		fields: {
			railId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.toolKey ?? '') || 'Coin bridge capability')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinBridgeCapability}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'caip2' in selection.entitySelector.$fromInstance.$network
			&& (selection.entitySelector.$fromInstance.type === 'NativeCurrency' ? true : '$contract' in selection.entitySelector.$fromInstance)
			&& 'caip2' in selection.entitySelector.$toInstance.$network
			&& (selection.entitySelector.$toInstance.type === 'NativeCurrency' ? true : '$contract' in selection.entitySelector.$toInstance) ?
				resolve(
					'/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
					{
						fromChainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference),
						fromCoinInstanceSlug: String((selection.entitySelector.$fromInstance.type === 'NativeCurrency' ? 'native' : selection.entitySelector.$fromInstance.$contract.address)),
						toChainId: String(selection.entitySelector.$toInstance.$network.caip2.reference),
						toCoinInstanceSlug: String((selection.entitySelector.$toInstance.type === 'NativeCurrency' ? 'native' : selection.entitySelector.$toInstance.$contract.address)),
						toolKey: String(selection.entitySelector.toolKey),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.toolKey ?? '') || 'Coin bridge capability'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.toolKey ?? '') || titleFallback}
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
					{pendingEntity.toolKey}
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
