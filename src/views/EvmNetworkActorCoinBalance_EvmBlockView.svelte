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
			selection: RegisteredEntityProxyResource<EntityType.EvmNetworkActorCoinBalance_EvmBlock>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmNetworkActorCoinBalance_EvmBlock>
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
	const evmNetworkActorCoinBalanceEvmBlock = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
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
	} : {
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
	const titleFallback = 'EVM network actor coin balance EVM block'
	const viewDomId = $derived('evm-network-actor-coin-balance-evm-block-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
			{#snippet children(entity)}
				<EvmBlockView
					selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
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
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						href={
							(
								selection.entitySelector.$actorCoin != null && '$actor' in selection.entitySelector.$actorCoin
								&& selection.entitySelector.$actorCoin.$actor != null && 'address' in selection.entitySelector.$actorCoin.$actor
								&& selection.entitySelector.$actorCoin.$actor.address != null
								&& selection.entitySelector.$actorCoin != null && '$contract' in selection.entitySelector.$actorCoin
								&& selection.entitySelector.$actorCoin.$contract != null && '$network' in selection.entitySelector.$actorCoin.$contract
								&& selection.entitySelector.$actorCoin.$contract.$network != null && 'caip2' in selection.entitySelector.$actorCoin.$contract.$network
								&& selection.entitySelector.$actorCoin.$contract.$network.caip2 != null && 'reference' in selection.entitySelector.$actorCoin.$contract.$network.caip2
								&& selection.entitySelector.$actorCoin.$contract.$network.caip2.reference != null
								&& selection.entitySelector.$actorCoin.$contract != null && 'address' in selection.entitySelector.$actorCoin.$contract
								&& selection.entitySelector.$actorCoin.$contract.address != null ?
									resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
								owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
								chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
								coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
							})
							:
									undefined
							)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
						href={
							(
								selection.entitySelector.$block != null && 'blockNumber' in selection.entitySelector.$block
								&& selection.entitySelector.$block.blockNumber != null
								&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block ?
									selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
									&& selection.entitySelector.$block.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
									blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
										&& selection.entitySelector.$block.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
										blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
										network: String(selection.entitySelector.$block.$network.slug ?? ''),
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
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						href={
							(
								selection.entitySelector.$actorCoin != null && '$actor' in selection.entitySelector.$actorCoin
								&& selection.entitySelector.$actorCoin.$actor != null && 'address' in selection.entitySelector.$actorCoin.$actor
								&& selection.entitySelector.$actorCoin.$actor.address != null
								&& selection.entitySelector.$actorCoin != null && '$contract' in selection.entitySelector.$actorCoin
								&& selection.entitySelector.$actorCoin.$contract != null && '$network' in selection.entitySelector.$actorCoin.$contract
								&& selection.entitySelector.$actorCoin.$contract.$network != null && 'caip2' in selection.entitySelector.$actorCoin.$contract.$network
								&& selection.entitySelector.$actorCoin.$contract.$network.caip2 != null && 'reference' in selection.entitySelector.$actorCoin.$contract.$network.caip2
								&& selection.entitySelector.$actorCoin.$contract.$network.caip2.reference != null
								&& selection.entitySelector.$actorCoin.$contract != null && 'address' in selection.entitySelector.$actorCoin.$contract
								&& selection.entitySelector.$actorCoin.$contract.address != null ?
									resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
								owner: String(selection.entitySelector.$actorCoin.$actor.address ?? ''),
								chainId: String(selection.entitySelector.$actorCoin.$contract.$network.caip2.reference ?? ''),
								coin: String(selection.entitySelector.$actorCoin.$contract.address ?? ''),
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
