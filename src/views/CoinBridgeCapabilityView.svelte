<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const coinBridgeCapability = $derived(selection({
		fields: {
			railId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.toolKey) ?? '')].filter(Boolean).join(' ') || 'Coin bridge capability')
	const viewDomId = $derived('coin-bridge-capability-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinBridgeCapability}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.toolKey !== undefined && pendingEntity.$fromInstance !== undefined && pendingEntity.$fromInstance.$network !== undefined && pendingEntity.$fromInstance.$network.caip2 !== undefined && pendingEntity.$fromInstance.$network.caip2.reference !== undefined && (pendingEntity.$fromInstance !== undefined && pendingEntity.$fromInstance.type !== undefined && (pendingEntity.$fromInstance.type === 'NativeCurrency' ? true : pendingEntity.$fromInstance !== undefined && pendingEntity.$fromInstance.$contract !== undefined && pendingEntity.$fromInstance.$contract.address !== undefined)) && pendingEntity.$toInstance !== undefined && pendingEntity.$toInstance.$network !== undefined && pendingEntity.$toInstance.$network.caip2 !== undefined && pendingEntity.$toInstance.$network.caip2.reference !== undefined && (pendingEntity.$toInstance !== undefined && pendingEntity.$toInstance.type !== undefined && (pendingEntity.$toInstance.type === 'NativeCurrency' ? true : pendingEntity.$toInstance !== undefined && pendingEntity.$toInstance.$contract !== undefined && pendingEntity.$toInstance.$contract.address !== undefined)) ? resolve('/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', {
			toolKey: String(pendingEntity.toolKey ?? ''),
			fromChainId: String(pendingEntity.$fromInstance.$network.caip2.reference ?? ''),
			fromCoinInstanceSlug: String((pendingEntity.$fromInstance.type === 'NativeCurrency' ? 'native' : pendingEntity.$fromInstance.$contract.address)),
			toChainId: String(pendingEntity.$toInstance.$network.caip2.reference ?? ''),
			toCoinInstanceSlug: String((pendingEntity.$toInstance.type === 'NativeCurrency' ? 'native' : pendingEntity.$toInstance.$contract.address)),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={coinBridgeCapability}>
			{#snippet Pending()}
				{[String((pendingEntity.toolKey) ?? '')].filter(Boolean).join(' ') || title || 'Coin bridge capability'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.toolKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={coinBridgeCapability}>
			{#snippet Pending()}
				{[String((pendingEntity.toolKey) ?? '')].filter(Boolean).join(' ') || title || 'Coin bridge capability'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.toolKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={coinBridgeCapability}>
			{#snippet Pending()}
				{@const railId0 = pendingEntity.railId}
				{#if railId0 !== undefined && railId0 !== null}
					<span data-text="muted">
						{String((railId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const railId0 = resolvedEntity.railId}
				{#if railId0 !== undefined && railId0 !== null}
					<span data-text="muted">
						{String((railId0) ?? '')}
					</span>
				{/if}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									toolKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const toolKey = pendingEntity.toolKey}
							{#if toolKey !== undefined && toolKey !== null}
								{String((toolKey) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const toolKey = resolvedEntity.toolKey}
							{#if toolKey !== undefined && toolKey !== null}
								{String((toolKey) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Rail ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									railId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const railId = pendingEntity.railId}
							{#if railId !== undefined && railId !== null}
								{String((railId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const railId = resolvedEntity.railId}
							{#if railId !== undefined && railId !== null}
								{String((railId) ?? '')}
							{/if}
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
						{#snippet Pending()}
							{@const settlementModel = pendingEntity.settlementModel}
							{#if settlementModel !== undefined && settlementModel !== null}
								{String((settlementModel) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const settlementModel = resolvedEntity.settlementModel}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									verificationModel: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const verificationModel = pendingEntity.verificationModel}
							{#if verificationModel !== undefined && verificationModel !== null}
								{String((verificationModel) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const verificationModel = resolvedEntity.verificationModel}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									assetOutcome: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const assetOutcome = pendingEntity.assetOutcome}
							{#if assetOutcome !== undefined && assetOutcome !== null}
								{String((assetOutcome) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const assetOutcome = resolvedEntity.assetOutcome}
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
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$fromInstance, {})}
						href={
							(selection.entitySelector.$fromInstance.type !== undefined && selection.entitySelector.$fromInstance.type === 'NativeCurrency' && selection.entitySelector.$fromInstance.$network !== undefined && selection.entitySelector.$fromInstance.$network.caip2 !== undefined && selection.entitySelector.$fromInstance.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
								chainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference ?? ''),
								coinInstanceSlug: String('native' ?? ''),
							}) : selection.entitySelector.$fromInstance.type !== undefined && selection.entitySelector.$fromInstance.type === 'Erc20Token' && selection.entitySelector.$fromInstance.$contract !== undefined && selection.entitySelector.$fromInstance.$contract.address !== undefined && selection.entitySelector.$fromInstance.$network !== undefined && selection.entitySelector.$fromInstance.$network.caip2 !== undefined && selection.entitySelector.$fromInstance.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
								coinInstanceSlug: String(selection.entitySelector.$fromInstance.$contract.address ?? ''),
								chainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>To instance</dt>
				<dd>
					<EvmCoinInstanceView
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$toInstance, {})}
						href={
							(selection.entitySelector.$toInstance.type !== undefined && selection.entitySelector.$toInstance.type === 'NativeCurrency' && selection.entitySelector.$toInstance.$network !== undefined && selection.entitySelector.$toInstance.$network.caip2 !== undefined && selection.entitySelector.$toInstance.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
								chainId: String(selection.entitySelector.$toInstance.$network.caip2.reference ?? ''),
								coinInstanceSlug: String('native' ?? ''),
							}) : selection.entitySelector.$toInstance.type !== undefined && selection.entitySelector.$toInstance.type === 'Erc20Token' && selection.entitySelector.$toInstance.$contract !== undefined && selection.entitySelector.$toInstance.$contract.address !== undefined && selection.entitySelector.$toInstance.$network !== undefined && selection.entitySelector.$toInstance.$network.caip2 !== undefined && selection.entitySelector.$toInstance.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
								coinInstanceSlug: String(selection.entitySelector.$toInstance.$contract.address ?? ''),
								chainId: String(selection.entitySelector.$toInstance.$network.caip2.reference ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
