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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmActorCoinAllowance = $derived(selection({
		sources: [
			Source.Voltaire_JsonRpc,
		],
		fields: {
			$actorCoin: true,
		},
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
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmActorCoinAllowance}>
			{#snippet Pending()}
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href={
						(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							network: String(selection.entitySelector.$contract.$network.slug ?? ''),
							address: String(selection.entitySelector.$contract.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href={
						(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
							network: String(selection.entitySelector.$contract.$network.slug ?? ''),
							address: String(selection.entitySelector.$contract.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmActorCoinAllowance}>
			{#snippet Pending()}
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
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.slug !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
								network: String(selection.entitySelector.$contract.$network.slug ?? ''),
								address: String(selection.entitySelector.$contract.address ?? ''),
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
								fields: {
									interopAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const interopAddress = pendingEntity.interopAddress}
							{#if interopAddress !== undefined && interopAddress !== null}
								<TruncatedValue value={String((interopAddress) ?? '')} />
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Spender contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
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
