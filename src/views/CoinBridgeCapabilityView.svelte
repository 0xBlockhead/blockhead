<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.CoinBridgeCapability>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CoinBridgeCapability>
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
	const coinBridgeCapability = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			railId: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			railId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.toolKey) ?? '')].filter(Boolean).join(' ') || 'Coin bridge capability')
	const viewDomId = $derived('coin-bridge-capability-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'toolKey' in selection.entitySelector
			&& selection.entitySelector.toolKey != null
			&& selection.entitySelector != null && '$fromInstance' in selection.entitySelector
			&& selection.entitySelector.$fromInstance != null && '$network' in selection.entitySelector.$fromInstance
			&& selection.entitySelector.$fromInstance.$network != null && 'caip2' in selection.entitySelector.$fromInstance.$network
			&& selection.entitySelector.$fromInstance.$network.caip2 != null && 'reference' in selection.entitySelector.$fromInstance.$network.caip2
			&& selection.entitySelector.$fromInstance.$network.caip2.reference != null
			&& (selection.entitySelector != null && '$fromInstance' in selection.entitySelector && selection.entitySelector.$fromInstance != null && 'type' in selection.entitySelector.$fromInstance && selection.entitySelector.$fromInstance.type != null && (selection.entitySelector.$fromInstance.type === 'NativeCurrency' ? true : selection.entitySelector.$fromInstance.type === 'Erc20Token' ? selection.entitySelector != null && '$fromInstance' in selection.entitySelector && selection.entitySelector.$fromInstance != null && '$contract' in selection.entitySelector.$fromInstance && selection.entitySelector.$fromInstance.$contract != null && 'address' in selection.entitySelector.$fromInstance.$contract && selection.entitySelector.$fromInstance.$contract.address != null : true))
			&& selection.entitySelector != null && '$toInstance' in selection.entitySelector
			&& selection.entitySelector.$toInstance != null && '$network' in selection.entitySelector.$toInstance
			&& selection.entitySelector.$toInstance.$network != null && 'caip2' in selection.entitySelector.$toInstance.$network
			&& selection.entitySelector.$toInstance.$network.caip2 != null && 'reference' in selection.entitySelector.$toInstance.$network.caip2
			&& selection.entitySelector.$toInstance.$network.caip2.reference != null
			&& (selection.entitySelector != null && '$toInstance' in selection.entitySelector && selection.entitySelector.$toInstance != null && 'type' in selection.entitySelector.$toInstance && selection.entitySelector.$toInstance.type != null && (selection.entitySelector.$toInstance.type === 'NativeCurrency' ? true : selection.entitySelector.$toInstance.type === 'Erc20Token' ? selection.entitySelector != null && '$toInstance' in selection.entitySelector && selection.entitySelector.$toInstance != null && '$contract' in selection.entitySelector.$toInstance && selection.entitySelector.$toInstance.$contract != null && 'address' in selection.entitySelector.$toInstance.$contract && selection.entitySelector.$toInstance.$contract.address != null : true)) ?
				resolve('/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', {
			toolKey: String(selection.entitySelector.toolKey ?? ''),
			fromChainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference ?? ''),
			fromCoinInstanceSlug: String((selection.entitySelector.$fromInstance.type === 'NativeCurrency' ? 'native' : selection.entitySelector.$fromInstance.type === 'Erc20Token' ? selection.entitySelector.$fromInstance.$contract.address : '')),
			toChainId: String(selection.entitySelector.$toInstance.$network.caip2.reference ?? ''),
			toCoinInstanceSlug: String((selection.entitySelector.$toInstance.type === 'NativeCurrency' ? 'native' : selection.entitySelector.$toInstance.type === 'Erc20Token' ? selection.entitySelector.$toInstance.$contract.address : '')),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'railId')}
			{[String((pendingEntity.toolKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={coinBridgeCapability}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.toolKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'railId')}
			{[String((pendingEntity.toolKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={coinBridgeCapability}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.toolKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'railId')}
			{@const railId0 = pendingEntity.railId}
			{#if railId0 !== undefined && railId0 !== null}
				<span data-text="muted">
					{String((railId0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={coinBridgeCapability}>
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
				<dt>Tool key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									toolKey: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									railId: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									settlementModel: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									verificationModel: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									assetOutcome: true,
								},
							})
						}
					>
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
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$fromInstance)}
						href={
							(
								selection.entitySelector.$fromInstance.type === 'NativeCurrency' && selection.entitySelector.$fromInstance.type === 'NativeCurrency'
								&& selection.entitySelector.$fromInstance != null && '$network' in selection.entitySelector.$fromInstance
								&& selection.entitySelector.$fromInstance.$network != null && 'caip2' in selection.entitySelector.$fromInstance.$network
								&& selection.entitySelector.$fromInstance.$network.caip2 != null && 'reference' in selection.entitySelector.$fromInstance.$network.caip2
								&& selection.entitySelector.$fromInstance.$network.caip2.reference != null ?
									resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
								chainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference ?? ''),
								coinInstanceSlug: String('native'),
							})
							:
									selection.entitySelector.$fromInstance.type === 'Erc20Token' && selection.entitySelector.$fromInstance.type === 'Erc20Token'
									&& selection.entitySelector.$fromInstance != null && '$contract' in selection.entitySelector.$fromInstance
									&& selection.entitySelector.$fromInstance.$contract != null && 'address' in selection.entitySelector.$fromInstance.$contract
									&& selection.entitySelector.$fromInstance.$contract.address != null
									&& selection.entitySelector.$fromInstance != null && '$network' in selection.entitySelector.$fromInstance
									&& selection.entitySelector.$fromInstance.$network != null && 'caip2' in selection.entitySelector.$fromInstance.$network
									&& selection.entitySelector.$fromInstance.$network.caip2 != null && 'reference' in selection.entitySelector.$fromInstance.$network.caip2
									&& selection.entitySelector.$fromInstance.$network.caip2.reference != null ?
										resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
									coinInstanceSlug: String(selection.entitySelector.$fromInstance.$contract.address ?? ''),
									chainId: String(selection.entitySelector.$fromInstance.$network.caip2.reference ?? ''),
								})
								:
									undefined
							)
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
						selection={select(EntityType.EvmCoinInstance, selection.entitySelector.$toInstance)}
						href={
							(
								selection.entitySelector.$toInstance.type === 'NativeCurrency' && selection.entitySelector.$toInstance.type === 'NativeCurrency'
								&& selection.entitySelector.$toInstance != null && '$network' in selection.entitySelector.$toInstance
								&& selection.entitySelector.$toInstance.$network != null && 'caip2' in selection.entitySelector.$toInstance.$network
								&& selection.entitySelector.$toInstance.$network.caip2 != null && 'reference' in selection.entitySelector.$toInstance.$network.caip2
								&& selection.entitySelector.$toInstance.$network.caip2.reference != null ?
									resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
								chainId: String(selection.entitySelector.$toInstance.$network.caip2.reference ?? ''),
								coinInstanceSlug: String('native'),
							})
							:
									selection.entitySelector.$toInstance.type === 'Erc20Token' && selection.entitySelector.$toInstance.type === 'Erc20Token'
									&& selection.entitySelector.$toInstance != null && '$contract' in selection.entitySelector.$toInstance
									&& selection.entitySelector.$toInstance.$contract != null && 'address' in selection.entitySelector.$toInstance.$contract
									&& selection.entitySelector.$toInstance.$contract.address != null
									&& selection.entitySelector.$toInstance != null && '$network' in selection.entitySelector.$toInstance
									&& selection.entitySelector.$toInstance.$network != null && 'caip2' in selection.entitySelector.$toInstance.$network
									&& selection.entitySelector.$toInstance.$network.caip2 != null && 'reference' in selection.entitySelector.$toInstance.$network.caip2
									&& selection.entitySelector.$toInstance.$network.caip2.reference != null ?
										resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
									coinInstanceSlug: String(selection.entitySelector.$toInstance.$contract.address ?? ''),
									chainId: String(selection.entitySelector.$toInstance.$network.caip2.reference ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
