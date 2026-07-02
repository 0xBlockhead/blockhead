<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CoinBridgeCapability>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CoinBridgeCapability>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const coinBridgeCapability = $derived(selection({
		fields: {
			railId: true,
			settlementModel: true,
			verificationModel: true,
			assetOutcome: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || 'Coin bridge capability')
	const viewDomId = $derived('coin-bridge-capability-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinBridgeCapability}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug]/[toChainId=eip155ChainId]/[toCoinInstanceSlug]/[toolKey]', {
			fromChainId: String(({ ...selection.entitySelector, ...prefetched }).$fromInstance.$network.chainId),
			fromCoinInstanceSlug: String(({ ...selection.entitySelector, ...prefetched }).$fromInstance.slug),
			toChainId: String(({ ...selection.entitySelector, ...prefetched }).$toInstance.$network.chainId),
			toCoinInstanceSlug: String(({ ...selection.entitySelector, ...prefetched }).$toInstance.slug),
			toolKey: String(({ ...selection.entitySelector, ...prefetched }).toolKey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || title || 'Coin bridge capability'}
		{:else}
			<ResourceBoundary resource={coinBridgeCapability}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || title || 'Coin bridge capability'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.toolKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || title || 'Coin bridge capability'}
		{:else}
			<ResourceBoundary resource={coinBridgeCapability}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).toolKey) ?? '')].filter(Boolean).join(' ') || title || 'Coin bridge capability'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.toolKey) ?? '')].filter(Boolean).join(' ') || [String((entity.toolKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const railId0 = prefetched.railId}
			{#if railId0 !== undefined && railId0 !== null}
				<span data-text="muted">
					{String((railId0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={coinBridgeCapability}>
				{#snippet Pending()}
					{@const railId0 = prefetched.railId}
					{#if railId0 !== undefined && railId0 !== null}
						<span data-text="muted">
							{String((railId0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const railId0 = entity.railId}
					{#if railId0 !== undefined && railId0 !== null}
						<span data-text="muted">
							{String((railId0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A supported bridge path between two EVM coin instances through a specific bridge tool.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Settlement model</dt>
				<dd>
					<ResourceBoundary resource={coinBridgeCapability}>
						{#snippet Pending()}
							{@const settlementModel = prefetched.settlementModel ?? selection.entitySelector.settlementModel}
							{#if settlementModel !== undefined && settlementModel !== null}
								{String((settlementModel) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const settlementModel = entity.settlementModel ?? selection.entitySelector.settlementModel ?? prefetched.settlementModel}
							{#if settlementModel !== undefined && settlementModel !== null}
								{String((settlementModel) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Verification model</dt>
				<dd>
					<ResourceBoundary resource={coinBridgeCapability}>
						{#snippet Pending()}
							{@const verificationModel = prefetched.verificationModel ?? selection.entitySelector.verificationModel}
							{#if verificationModel !== undefined && verificationModel !== null}
								{String((verificationModel) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const verificationModel = entity.verificationModel ?? selection.entitySelector.verificationModel ?? prefetched.verificationModel}
							{#if verificationModel !== undefined && verificationModel !== null}
								{String((verificationModel) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Asset outcome</dt>
				<dd>
					<ResourceBoundary resource={coinBridgeCapability}>
						{#snippet Pending()}
							{@const assetOutcome = prefetched.assetOutcome ?? selection.entitySelector.assetOutcome}
							{#if assetOutcome !== undefined && assetOutcome !== null}
								{String((assetOutcome) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const assetOutcome = entity.assetOutcome ?? selection.entitySelector.assetOutcome ?? prefetched.assetOutcome}
							{#if assetOutcome !== undefined && assetOutcome !== null}
								{String((assetOutcome) ?? '')}
							{/if}
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
						href={
							resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
								chainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference),
								coinInstanceSlug: String(
									(
										selection.entitySelector.$fromInstance.type === 'NativeCurrency' ?
											'native'
										:
											selection.entitySelector.$fromInstance.$contract.address
									)
								),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>To instance</dt>
				<dd>
					<EvmCoinInstanceView
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$toInstance)}
						href={
							resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
								chainId: String(selection.entitySelector.$toInstance.$network.caip2.reference),
								coinInstanceSlug: String(
									(
										selection.entitySelector.$toInstance.type === 'NativeCurrency' ?
											'native'
										:
											selection.entitySelector.$toInstance.$contract.address
									)
								),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
