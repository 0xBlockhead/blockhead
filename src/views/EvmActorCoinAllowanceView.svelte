<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmActorCoinAllowance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmActorCoinAllowance>>
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

	const evmActorCoinAllowance = $derived(selection({
		sources: [
			Source.Voltaire_JsonRpc,
		],
		fields: {
			$actorCoin: true,
			...(open && {
				interopAddress: true,
				$spenderContract: true,
				$$blocks: true,
			}),
		},
	}))
	const titleFallback = $derived('allowance')
	const viewDomId = $derived('evm-actor-coin-allowance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmActorCoinAllowance}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EvmContractView
				selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
				href={
						resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
							caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
							address: String(selection.entitySelector.$contract.address),
						})
					}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowance}>
				{#snippet Pending()}
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
								address: String(selection.entitySelector.$contract.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
								address: String(selection.entitySelector.$contract.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<EvmAccountView
				selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
				href={
						resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$spender.address),
						})
					}
				layout={EntityLayout.Value}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowance}>
				{#snippet Pending()}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
						href={
							resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$spender.address),
							})
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
						href={
							resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$spender.address),
							})
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
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						href={
							resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmNetworkActorCoinBalance, false>('$actorCoin')}
					>
						{#snippet children(evmNetworkActorCoinBalance)}
							<EvmNetworkActorCoinBalanceView
								selection={select(EntityType.EvmNetworkActorCoinBalance, evmNetworkActorCoinBalance.entitySelector)}
								prefetched={evmNetworkActorCoinBalance}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Interop address</dt>
				<dd>
					<ResourceBoundary resource={evmActorCoinAllowance}>
						{#snippet Pending()}
							{@const interopAddress = prefetched.interopAddress ?? selection.entitySelector.interopAddress}
							{#if interopAddress !== undefined && interopAddress !== null}
								{String((interopAddress) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const interopAddress = entity.interopAddress ?? selection.entitySelector.interopAddress ?? prefetched.interopAddress}
							{#if interopAddress !== undefined && interopAddress !== null}
								{String((interopAddress) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$spenderContract')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Spender contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract.entitySelector)}
									prefetched={evmContract}
									href={
										resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(evmContract.entitySelector.$network.caip2.namespace)}:${String(evmContract.entitySelector.$network.caip2.reference)}`,
											address: String(evmContract.entitySelector.address),
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
	{/snippet}
</EntityView>
