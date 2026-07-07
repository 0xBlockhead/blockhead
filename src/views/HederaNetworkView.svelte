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
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaNetwork>>
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
	const hederaNetwork = $derived(selection({
		fields: {
			shard: true,
			realm: true,
		},
	}))
	const titleFallback = $derived('hedera network')
	const viewDomId = $derived('hedera-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaNetwork_TimestampsView from '$/views/HederaNetwork_TimestampsView.svelte'
	import HederaBlocksView from '$/views/HederaBlocksView.svelte'
	import HederaTransactionsView from '$/views/HederaTransactionsView.svelte'
	import HederaAccountsView from '$/views/HederaAccountsView.svelte'
	import HederaTokensView from '$/views/HederaTokensView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
	import HederaContractsView from '$/views/HederaContractsView.svelte'
	import HederaTopicsView from '$/views/HederaTopicsView.svelte'
	import HederaSchedulesView from '$/views/HederaSchedulesView.svelte'
	import HederaNodesView from '$/views/HederaNodesView.svelte'
	import HederaNetworkFee_TimestampsView from '$/views/HederaNetworkFee_TimestampsView.svelte'
	import HederaNetworkExchangeRate_TimestampsView from '$/views/HederaNetworkExchangeRate_TimestampsView.svelte'
	import HederaNetworkStake_TimestampsView from '$/views/HederaNetworkStake_TimestampsView.svelte'
	import HederaNetworkSupply_TimestampsView from '$/views/HederaNetworkSupply_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={hederaNetwork}>
			{#snippet Pending()}
				{[String((prefetched.shard) ?? ''), String((prefetched.realm) ?? '')].filter(Boolean).join(' ') || title || 'hedera network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.shard) ?? ''), String((resolvedEntity.realm) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							shard: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shard = prefetched.shard}
					{#if shard !== undefined && shard !== null}
						<div>
							<dt>shard</dt>
							<dd>
								<NumberValue value={Number(shard)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shard = resolvedEntity.shard}
					{#if shard !== undefined && shard !== null}
						<div>
							<dt>shard</dt>
							<dd>
								<NumberValue value={Number(shard)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							realm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const realm = prefetched.realm}
					{#if realm !== undefined && realm !== null}
						<div>
							<dt>realm</dt>
							<dd>
								<NumberValue value={Number(realm)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const realm = resolvedEntity.realm}
					{#if realm !== undefined && realm !== null}
						<div>
							<dt>realm</dt>
							<dd>
								<NumberValue value={Number(realm)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<HederaNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.HederaNetwork_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Hedera network observations.'
				id='HederaNetwork_TimestampsView-$$timestamps'
			/>

			<HederaBlocksView
				selection={selection[EntityProxyField]<EntityType.HederaBlock>('$$blocks')}
				title='blocks'
				emptyText='No Hedera blocks.'
				id='HederaBlocksView-$$blocks'
			/>

			<HederaTransactionsView
				selection={selection[EntityProxyField]<EntityType.HederaTransaction>('$$transactions')}
				title='transactions'
				emptyText='No Hedera transactions.'
				id='HederaTransactionsView-$$transactions'
			/>

			<HederaAccountsView
				selection={selection[EntityProxyField]<EntityType.HederaAccount>('$$accounts')}
				title='accounts'
				emptyText='No Hedera accounts.'
				id='HederaAccountsView-$$accounts'
			/>

			<HederaTokensView
				selection={selection[EntityProxyField]<EntityType.HederaToken>('$$tokens')}
				title='tokens'
				emptyText='No Hedera tokens.'
				id='HederaTokensView-$$tokens'
			/>

			<HederaNftsView
				selection={selection[EntityProxyField]<EntityType.HederaNft>('$$nfts')}
				title='NFTs'
				emptyText='No Hedera NFTs.'
				id='HederaNftsView-$$nfts'
			/>

			<HederaContractsView
				selection={selection[EntityProxyField]<EntityType.HederaContract>('$$contracts')}
				title='contracts'
				emptyText='No Hedera contracts.'
				id='HederaContractsView-$$contracts'
			/>

			<HederaTopicsView
				selection={selection[EntityProxyField]<EntityType.HederaTopic>('$$topics')}
				title='topics'
				emptyText='No Hedera topics.'
				id='HederaTopicsView-$$topics'
			/>

			<HederaSchedulesView
				selection={selection[EntityProxyField]<EntityType.HederaSchedule>('$$schedules')}
				title='schedules'
				emptyText='No Hedera schedules.'
				id='HederaSchedulesView-$$schedules'
			/>

			<HederaNodesView
				selection={selection[EntityProxyField]<EntityType.HederaNode>('$$nodes')}
				title='nodes'
				emptyText='No Hedera nodes.'
				id='HederaNodesView-$$nodes'
			/>

			<HederaNetworkFee_TimestampsView
				selection={selection[EntityProxyField]<EntityType.HederaNetworkFee_Timestamp>('$$feeTimestamps')}
				title='fee timestamps'
				emptyText='No Hedera fee observations.'
				id='HederaNetworkFee_TimestampsView-$$feeTimestamps'
			/>

			<HederaNetworkExchangeRate_TimestampsView
				selection={selection[EntityProxyField]<EntityType.HederaNetworkExchangeRate_Timestamp>('$$exchangeRateTimestamps')}
				title='exchange rate timestamps'
				emptyText='No Hedera exchange-rate observations.'
				id='HederaNetworkExchangeRate_TimestampsView-$$exchangeRateTimestamps'
			/>

			<HederaNetworkStake_TimestampsView
				selection={selection[EntityProxyField]<EntityType.HederaNetworkStake_Timestamp>('$$stakeTimestamps')}
				title='stake timestamps'
				emptyText='No Hedera stake observations.'
				id='HederaNetworkStake_TimestampsView-$$stakeTimestamps'
			/>

			<HederaNetworkSupply_TimestampsView
				selection={selection[EntityProxyField]<EntityType.HederaNetworkSupply_Timestamp>('$$supplyTimestamps')}
				title='supply timestamps'
				emptyText='No Hedera supply observations.'
				id='HederaNetworkSupply_TimestampsView-$$supplyTimestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
