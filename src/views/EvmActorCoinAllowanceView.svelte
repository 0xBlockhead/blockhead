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
			selection: RegisteredEntityProxyResource<EntityType.EvmActorCoinAllowance>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmActorCoinAllowance>
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
	const evmActorCoinAllowance = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'allowance'
	const viewDomId = $derived('evm-actor-coin-allowance-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && '$actor' in selection.entitySelector
			&& selection.entitySelector.$actor != null && 'address' in selection.entitySelector.$actor
			&& selection.entitySelector.$actor.address != null
			&& selection.entitySelector != null && '$contract' in selection.entitySelector
			&& selection.entitySelector.$contract != null && '$network' in selection.entitySelector.$contract
			&& selection.entitySelector.$contract.$network != null && 'caip2' in selection.entitySelector.$contract.$network
			&& selection.entitySelector.$contract.$network.caip2 != null && 'reference' in selection.entitySelector.$contract.$network.caip2
			&& selection.entitySelector.$contract.$network.caip2.reference != null
			&& selection.entitySelector.$contract != null && 'address' in selection.entitySelector.$contract
			&& selection.entitySelector.$contract.address != null
			&& selection.entitySelector != null && '$spender' in selection.entitySelector
			&& selection.entitySelector.$spender != null && 'address' in selection.entitySelector.$spender
			&& selection.entitySelector.$spender.address != null ?
				resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
			owner: String(selection.entitySelector.$actor.address ?? ''),
			chainId: String(selection.entitySelector.$contract.$network.caip2.reference ?? ''),
			coin: String(selection.entitySelector.$contract.address ?? ''),
			spender: String(selection.entitySelector.$spender.address ?? ''),
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
		<ResourceBoundary resource={evmActorCoinAllowance}>
			{#snippet children(entity)}
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmActorCoinAllowance}>
			{#snippet children(entity)}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Owner</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						href={
							(
								selection.entitySelector.$actor != null && 'address' in selection.entitySelector.$actor
								&& selection.entitySelector.$actor.address != null ?
									resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
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
				<dt>Token</dt>
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
										(
											evmNetworkActorCoinBalance[EntityMetaKey.Selector] != null && '$actor' in evmNetworkActorCoinBalance[EntityMetaKey.Selector]
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor != null && 'address' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor.address != null
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector] != null && '$contract' in evmNetworkActorCoinBalance[EntityMetaKey.Selector]
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract != null && '$network' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network != null && 'caip2' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2 != null && 'reference' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2.reference != null
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract != null && 'address' in evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract
											&& evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.address != null ?
												resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
											owner: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$actor.address ?? ''),
											chainId: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.$network.caip2.reference ?? ''),
											coin: String(evmNetworkActorCoinBalance[EntityMetaKey.Selector].$contract.address ?? ''),
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

			<div>
				<dt>Spender</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
						href={
							(
								selection.entitySelector.$spender != null && 'address' in selection.entitySelector.$spender
								&& selection.entitySelector.$spender.address != null ?
									resolve('/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$spender.address ?? ''),
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
										(
											evmContract[EntityMetaKey.Selector] != null && 'address' in evmContract[EntityMetaKey.Selector]
											&& evmContract[EntityMetaKey.Selector].address != null
											&& evmContract[EntityMetaKey.Selector] != null && '$network' in evmContract[EntityMetaKey.Selector] ?
												evmContract[EntityMetaKey.Selector].$network != null && 'caip2' in evmContract[EntityMetaKey.Selector].$network
												&& evmContract[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
												address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
												network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													evmContract[EntityMetaKey.Selector].$network != null && 'slug' in evmContract[EntityMetaKey.Selector].$network
													&& evmContract[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
													address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
													network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
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
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const evmActorCoinAllowanceEvmActorCoinAllowanceBlocksViewBlocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={evmActorCoinAllowanceEvmActorCoinAllowanceBlocksViewBlocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<EvmActorCoinAllowance_BlocksView
					selection={evmActorCoinAllowanceEvmActorCoinAllowanceBlocksViewBlocksResource}
					countResource={evmActorCoinAllowanceEvmActorCoinAllowanceBlocksViewBlocksResource.count}
					title='Blocks'
					id='EvmActorCoinAllowance_BlocksView-blocks'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
