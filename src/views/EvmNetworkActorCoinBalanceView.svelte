<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetworkActorCoinBalance>>
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
	const evmNetworkActorCoinBalance = $derived(selection({
		sources: [
			Source.Allium_Rest,
		],
		fields: {
			$coinInstance: true,
			symbol: true,
			decimals: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.symbol) ?? '')].filter(Boolean).join(' ') || 'balance')
	const viewDomId = $derived('evm-network-actor-coin-balance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkActorCoinBalance_TimestampsView from '$/views/EvmNetworkActorCoinBalance_TimestampsView.svelte'
	import EvmNetworkActorCoinBalance_EvmBlocksView from '$/views/EvmNetworkActorCoinBalance_EvmBlocksView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkActorCoinBalance}>
			{#snippet Pending()}
				{[String((prefetched.symbol) ?? '')].filter(Boolean).join(' ') || title || 'balance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkActorCoinBalance}>
			{#snippet Pending()}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
					href={
						(selection.entitySelector.$actor.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
					href={
						(selection.entitySelector.$actor.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
							address: String(selection.entitySelector.$actor.address ?? ''),
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
				<dt>Actor</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor, {})}
						href={
							(selection.entitySelector.$actor.address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
								address: String(selection.entitySelector.$actor.address ?? ''),
							}) : undefined)
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
						resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$network')}
					>
						{#snippet children(evmNetwork)}
							{#if evmNetwork[EntityMetaKey.Selector] != null}
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContract, false>('$contract')}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2.reference !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
											caip2: `${String(evmContract[EntityMetaKey.Selector].$network.caip2.namespace ?? '')}:${String(evmContract[EntityMetaKey.Selector].$network.caip2.reference ?? '')}`,
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

			<div>
				<dt>Coin</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$coinInstance')}
					>
						{#snippet children(evmCoinInstance)}
							{#if evmCoinInstance[EntityMetaKey.Selector] != null}
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type !== undefined && (evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? true : evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined)) ? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String((evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' ? 'native' : evmCoinInstance[EntityMetaKey.Selector].$contract.address)),
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const symbol = prefetched.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const symbol = resolvedEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									decimals: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const decimals = prefetched.decimals}
							{#if decimals !== undefined && decimals !== null}
								<NumberValue value={Number(decimals)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const decimals = resolvedEntity.decimals}
							{#if decimals !== undefined && decimals !== null}
								<NumberValue value={Number(decimals)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmNetworkActorCoinBalance_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EvmNetworkActorCoinBalance_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No balance observations yet.'
				id='EvmNetworkActorCoinBalance_TimestampsView-$$timestamps'
			/>

			<EvmNetworkActorCoinBalance_EvmBlocksView
				selection={selection[EntityProxyField]<EntityType.EvmNetworkActorCoinBalance_EvmBlock>('$$blocks')}
				title='Blocks'
				emptyText='No balance blocks yet.'
				id='EvmNetworkActorCoinBalance_EvmBlocksView-$$blocks'
			/>
		{/if}
	{/snippet}
</EntityView>
