<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EvmNetworkActorCoinBalance_EvmBlock>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmNetworkActorCoinBalance_EvmBlock>>
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
	const evmNetworkActorCoinBalanceEvmBlock = $derived(selection({
		sources: selection.sources,
		fields: {
			balance: true,
			$actorCoin: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
			usdValue: true,
		},
	}))
	const titleFallback = $derived('EVM network actor coin balance EVM block')
	const viewDomId = $derived('evm-network-actor-coin-balance-evm-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
						href={
						(selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
						}) : selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
							network: String(selection.entitySelector.$block.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
						href={
						(selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
						}) : selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
							blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
							network: String(selection.entitySelector.$block.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const balance0 = pendingEntity.balance}
					{#if balance0 !== undefined && balance0 !== null}
						<NumberValue
							value={balance0}
							decimalPlaces={pendingEntity.$actorCoin.decimals}
						/>

						<span>{pendingEntity.$actorCoin.symbol == null ? '' : ` ${String(pendingEntity.$actorCoin.symbol)}`}</span>
					{/if}
					{@const usdValue1 = pendingEntity.usdValue}
					{#if usdValue1 !== undefined && usdValue1 !== null}
						{String((usdValue1) ?? '')}
					{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance0 = resolvedEntity.balance}
					{#if balance0 !== undefined && balance0 !== null}
						<NumberValue
							value={balance0}
							decimalPlaces={resolvedEntity.$actorCoin.decimals}
						/>

						<span>{resolvedEntity.$actorCoin.symbol == null ? '' : ` ${String(resolvedEntity.$actorCoin.symbol)}`}</span>
					{/if}
					{@const usdValue1 = resolvedEntity.usdValue}
					{#if usdValue1 !== undefined && usdValue1 !== null}
						{String((usdValue1) ?? '')}
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<span data-text="muted">
				<EvmNetworkActorCoinBalanceView
					selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
					href={
						(selection.entitySelector.$actorCoin.$actor !== undefined && selection.entitySelector.$actorCoin.$actor.address !== undefined && selection.entitySelector.$actorCoin.$contract !== undefined && selection.entitySelector.$actorCoin.$contract.$network !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2 !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$actorCoin.$contract.address !== undefined ? resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
							owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
							chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
							coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<EvmNetworkActorCoinBalanceView
							selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
							href={
								(selection.entitySelector.$actorCoin.$actor !== undefined && selection.entitySelector.$actorCoin.$actor.address !== undefined && selection.entitySelector.$actorCoin.$contract !== undefined && selection.entitySelector.$actorCoin.$contract.$network !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2 !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$actorCoin.$contract.address !== undefined ? resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
									owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
									chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
									coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
							}) : selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin, {})}
						href={
							(selection.entitySelector.$actorCoin.$actor !== undefined && selection.entitySelector.$actorCoin.$actor.address !== undefined && selection.entitySelector.$actorCoin.$contract !== undefined && selection.entitySelector.$actorCoin.$contract.$network !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2 !== undefined && selection.entitySelector.$actorCoin.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$actorCoin.$contract.address !== undefined ? resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
								owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
								chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
								coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									balance: true,
									$actorCoin: {
										fields: {
											decimals: true,
											symbol: true,
										},
									},
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const balance = resolvedEntity.balance}
							{#if balance !== undefined && balance !== null}
								<NumberValue
									value={balance}
									decimalPlaces={({ value: balance, ...resolvedEntity }).$actorCoin.decimals}
								/>

								<span>{({ value: balance, ...resolvedEntity }).$actorCoin.symbol == null ? '' : ` ${String(({ value: balance, ...resolvedEntity }).$actorCoin.symbol)}`}</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							usdValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const usdValue = resolvedEntity.usdValue}
					{#if usdValue !== undefined && usdValue !== null}
						<div>
							<dt>USD value</dt>
							<dd>
								{String((usdValue) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
