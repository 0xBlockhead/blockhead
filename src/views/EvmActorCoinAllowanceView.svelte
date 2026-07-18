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
			selection: RegisteredEntityProxyResource<EntityType.EvmActorCoinAllowance>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmActorCoinAllowance>>
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
	const evmActorCoinAllowance = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('allowance')
	const viewDomId = $derived('evm-actor-coin-allowance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmActorCoinAllowance_BlocksView from '$/views/EvmActorCoinAllowance_BlocksView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmActorCoinAllowance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$actor !== undefined && pendingEntity.$actor.address !== undefined && pendingEntity.$contract !== undefined && pendingEntity.$contract.$network !== undefined && pendingEntity.$contract.$network.caip2 !== undefined && pendingEntity.$contract.$network.caip2.reference !== undefined && pendingEntity.$contract.address !== undefined && pendingEntity.$spender !== undefined && pendingEntity.$spender.address !== undefined ? resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
			owner: String(pendingEntity.$actor.address ?? ''),
			chainId: String(pendingEntity.$contract.$network.caip2.reference ?? ''),
			coin: String(pendingEntity.$contract.address ?? ''),
			spender: String(pendingEntity.$spender.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
						(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(selection.entitySelector.$contract.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
						}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(selection.entitySelector.$contract.address ?? ''),
							network: String(selection.entitySelector.$contract.$network.slug ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
						(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(selection.entitySelector.$contract.address ?? ''),
							network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
						}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							address: String(selection.entitySelector.$contract.address ?? ''),
							network: String(selection.entitySelector.$contract.$network.slug ?? ''),
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
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
						href={
						(selection.entitySelector.$spender.address !== undefined ? resolve('/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$spender.address ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
						href={
						(selection.entitySelector.$spender.address !== undefined ? resolve('/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$spender.address ?? ''),
						}) : undefined)
					}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Owner</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor, {})}
						href={
							(selection.entitySelector.$actor.address !== undefined ? resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Token</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract, {})}
						href={
							(selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								address: String(selection.entitySelector.$contract.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
							}) : selection.entitySelector.$contract.address !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								address: String(selection.entitySelector.$contract.address ?? ''),
								network: String(selection.entitySelector.$contract.$network.slug ?? ''),
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
						resource={selection.$actorCoin}
					>
						{#snippet children(evmNetworkActorCoinBalance)}
							{#if evmNetworkActorCoinBalance != null && evmNetworkActorCoinBalance[EntityMetaKey.Selector] != null}
								<EvmNetworkActorCoinBalanceView
									selection={select(EntityType.EvmNetworkActorCoinBalance, evmNetworkActorCoinBalance[EntityMetaKey.Selector])}
									prefetched={evmNetworkActorCoinBalance}
									href={
										(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor !== undefined && evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor.address !== undefined && evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract !== undefined && evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network !== undefined && evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2 !== undefined && evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2.reference !== undefined && evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.address !== undefined ? resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
											owner: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor.address ?? ''),
											chainId: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2.reference ?? ''),
											coin: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Spender</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender, {})}
						href={
							(selection.entitySelector.$spender.address !== undefined ? resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$spender.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Interop address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									interopAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const interopAddress = resolvedEntity.interopAddress}
							{#if interopAddress !== undefined && interopAddress !== null}
								<TruncatedValue value={String((interopAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$spenderContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Spender contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].address !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : evmContract[EntityMetaKey.Selector].address !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
										}) : undefined)
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmActorCoinAllowance_BlocksView
				selection={
						selection.$$blocks({
							count: true,
						})
					}
				title='Blocks'
				emptyText='No allowance blocks yet.'
				id='EvmActorCoinAllowance_BlocksView-blocks'
			/>
		{/if}
	{/snippet}
</EntityView>
