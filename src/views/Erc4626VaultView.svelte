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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.Erc4626Vault>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.Erc4626Vault>
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
	const erc4626Vault = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			name: true,
			symbol: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			name: true,
			symbol: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? ''), String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || 'erc4626 vault')
	const viewDomId = $derived('erc4626vault-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Erc4626Vault_BlocksView from '$/views/Erc4626Vault_BlocksView.svelte'
	import Erc4626Vault_TimestampsView from '$/views/Erc4626Vault_TimestampsView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4626Vault}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={erc4626Vault}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={erc4626Vault}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$asset}
				>
					{#snippet children(evmCoinInstance)}
						{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
								prefetched={evmCoinInstance}
								href=""
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(
								selection.entitySelector.$contract != null && 'address' in selection.entitySelector.$contract
								&& selection.entitySelector.$contract.address != null
								&& selection.entitySelector.$contract != null && '$network' in selection.entitySelector.$contract ?
									selection.entitySelector.$contract.$network != null && 'caip2' in selection.entitySelector.$contract.$network
									&& selection.entitySelector.$contract.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
									address: String(selection.entitySelector.$contract.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$contract.$network != null && 'slug' in selection.entitySelector.$contract.$network
										&& selection.entitySelector.$contract.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
										address: String(selection.entitySelector.$contract.address ?? ''),
										network: String(selection.entitySelector.$contract.$network.slug ?? ''),
									})
									:
										undefined
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
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{#if network != null && network[EntityMetaKey.Selector] != null}
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(
											network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
											&& network[EntityMetaKey.Selector].caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										})
										:
												network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
												&& network[EntityMetaKey.Selector].slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]', {
												network: String(network[EntityMetaKey.Selector].slug ?? ''),
											})
											:
												undefined
										)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$asset}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>Asset</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(
											evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
											&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
											&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
											&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
											&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
												resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native'),
										})
										:
												evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
												&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
												&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
												&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
												&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
												&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
												&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
												&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
													resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
												coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
												chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$shareToken}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>Share token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(
											evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency'
											&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
											&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
											&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
											&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
												resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native'),
										})
										:
												evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token'
												&& evmCoinInstance[EntityMetaKey.Selector] != null && '$contract' in evmCoinInstance[EntityMetaKey.Selector]
												&& evmCoinInstance[EntityMetaKey.Selector].$contract != null && 'address' in evmCoinInstance[EntityMetaKey.Selector].$contract
												&& evmCoinInstance[EntityMetaKey.Selector].$contract.address != null
												&& evmCoinInstance[EntityMetaKey.Selector] != null && '$network' in evmCoinInstance[EntityMetaKey.Selector]
												&& evmCoinInstance[EntityMetaKey.Selector].$network != null && 'caip2' in evmCoinInstance[EntityMetaKey.Selector].$network
												&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2 != null && 'reference' in evmCoinInstance[EntityMetaKey.Selector].$network.caip2
												&& evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference != null ?
													resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
												coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
												chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const symbol = resolvedEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decimals = resolvedEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								<NumberValue
									value={decimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const erc4626VaultErc4626VaultBlocksViewBlocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={erc4626VaultErc4626VaultBlocksViewBlocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<Erc4626Vault_BlocksView
					selection={erc4626VaultErc4626VaultBlocksViewBlocksResource}
					countResource={erc4626VaultErc4626VaultBlocksViewBlocksResource.count}
					title='Blocks'
					id='Erc4626Vault_BlocksView-blocks'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const erc4626VaultErc4626VaultTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={erc4626VaultErc4626VaultTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<Erc4626Vault_TimestampsView
					selection={erc4626VaultErc4626VaultTimestampsViewTimestampsResource}
					countResource={erc4626VaultErc4626VaultTimestampsViewTimestampsResource.count}
					title='Observations'
					id='Erc4626Vault_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
