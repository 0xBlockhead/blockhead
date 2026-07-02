<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteStep>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BridgeRouteStep>>
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

	const bridgeRouteStep = $derived(selection({
		sources: [
			Source.Lifi_Rest,
		],
		fields: {
			tool: true,
			stepType: true,
			...(open && {
				$fromNetwork: true,
				$toNetwork: true,
				$fromToken: true,
				$toToken: true,
				stepType: true,
				tool: true,
				railId: true,
				settlementModel: true,
				verificationModel: true,
				assetOutcome: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInRoute) ?? '') ? 'Step #' + String((({ ...selection.entitySelector, ...prefetched }).indexInRoute) ?? '') : '') || 'bridge route step')
	const viewDomId = $derived('bridge-route-step-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<EntityView
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInRoute ?? '')}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInRoute}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Step </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInRoute}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const tool0 = prefetched.tool}
			{#if tool0 !== undefined && tool0 !== null}
				<span data-text="muted">
					{String((tool0) ?? '')}
				</span>
			{/if}
			{@const stepType1 = prefetched.stepType}
			{#if stepType1 !== undefined && stepType1 !== null}
				<span data-text="muted">
					{String((stepType1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={bridgeRouteStep}>
				{#snippet Pending()}
					{@const tool0 = prefetched.tool}
					{#if tool0 !== undefined && tool0 !== null}
						<span data-text="muted">
							{String((tool0) ?? '')}
						</span>
					{/if}
					{@const stepType1 = prefetched.stepType}
					{#if stepType1 !== undefined && stepType1 !== null}
						<span data-text="muted">
							{String((stepType1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const tool0 = entity.tool}
					{#if tool0 !== undefined && tool0 !== null}
						<span data-text="muted">
							{String((tool0) ?? '')}
						</span>
					{/if}
					{@const stepType1 = entity.stepType}
					{#if stepType1 !== undefined && stepType1 !== null}
						<span data-text="muted">
							{String((stepType1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in route</dt>
				<dd>
					<ResourceBoundary resource={bridgeRouteStep}>
						{#snippet Pending()}
							{@const indexInRoute = prefetched.indexInRoute ?? selection.entitySelector.indexInRoute}
							{#if indexInRoute !== undefined && indexInRoute !== null}
								{String((indexInRoute) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInRoute = entity.indexInRoute ?? selection.entitySelector.indexInRoute ?? prefetched.indexInRoute}
							{#if indexInRoute !== undefined && indexInRoute !== null}
								{String((indexInRoute) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$fromNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null}
						<div>
							<dt>From network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork.entitySelector)}
									prefetched={evmNetwork}
									href={
										(evmNetwork.entitySelector?.caip2 != null && evmNetwork.entitySelector?.caip2?.namespace != null && evmNetwork.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(evmNetwork.entitySelector.caip2.namespace)}:${String(evmNetwork.entitySelector.caip2.reference)}`,
										}) : evmNetwork.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
											networkSlug: String(evmNetwork.entitySelector.slug),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$toNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null}
						<div>
							<dt>To network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork.entitySelector)}
									prefetched={evmNetwork}
									href={
										(evmNetwork.entitySelector?.caip2 != null && evmNetwork.entitySelector?.caip2?.namespace != null && evmNetwork.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(evmNetwork.entitySelector.caip2.namespace)}:${String(evmNetwork.entitySelector.caip2.reference)}`,
										}) : evmNetwork.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
											networkSlug: String(evmNetwork.entitySelector.slug),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$fromToken')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>From token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
									prefetched={evmCoinInstance}
									href={
										resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
											coinInstanceSlug: String(
												(
													evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
														'native'
													:
														evmCoinInstance.entitySelector.$contract.address
												)
											),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$toToken')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>To token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
									prefetched={evmCoinInstance}
									href={
										resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
											coinInstanceSlug: String(
												(
													evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
														'native'
													:
														evmCoinInstance.entitySelector.$contract.address
												)
											),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={bridgeRouteStep}>
				{#snippet Pending()}
					{@const railId = prefetched.railId ?? selection.entitySelector.railId}
					{#if railId !== undefined && railId !== null}
						<div>
							<dt>Rail ID</dt>
							<dd>
								{String((railId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const railId = entity.railId ?? selection.entitySelector.railId ?? prefetched.railId}
					{#if railId !== undefined && railId !== null}
						<div>
							<dt>Rail ID</dt>
							<dd>
								{String((railId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={bridgeRouteStep}>
				{#snippet Pending()}
					{@const settlementModel = prefetched.settlementModel ?? selection.entitySelector.settlementModel}
					{#if settlementModel !== undefined && settlementModel !== null}
						<div>
							<dt>Settlement model</dt>
							<dd>
								{String((settlementModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const settlementModel = entity.settlementModel ?? selection.entitySelector.settlementModel ?? prefetched.settlementModel}
					{#if settlementModel !== undefined && settlementModel !== null}
						<div>
							<dt>Settlement model</dt>
							<dd>
								{String((settlementModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={bridgeRouteStep}>
				{#snippet Pending()}
					{@const verificationModel = prefetched.verificationModel ?? selection.entitySelector.verificationModel}
					{#if verificationModel !== undefined && verificationModel !== null}
						<div>
							<dt>Verification model</dt>
							<dd>
								{String((verificationModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const verificationModel = entity.verificationModel ?? selection.entitySelector.verificationModel ?? prefetched.verificationModel}
					{#if verificationModel !== undefined && verificationModel !== null}
						<div>
							<dt>Verification model</dt>
							<dd>
								{String((verificationModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={bridgeRouteStep}>
				{#snippet Pending()}
					{@const assetOutcome = prefetched.assetOutcome ?? selection.entitySelector.assetOutcome}
					{#if assetOutcome !== undefined && assetOutcome !== null}
						<div>
							<dt>Asset outcome</dt>
							<dd>
								{String((assetOutcome) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const assetOutcome = entity.assetOutcome ?? selection.entitySelector.assetOutcome ?? prefetched.assetOutcome}
					{#if assetOutcome !== undefined && assetOutcome !== null}
						<div>
							<dt>Asset outcome</dt>
							<dd>
								{String((assetOutcome) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Route</dt>
				<dd>
					<BridgeRouteView
						selection={select(EntityType.BridgeRoute, selection.entitySelector.$route)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
