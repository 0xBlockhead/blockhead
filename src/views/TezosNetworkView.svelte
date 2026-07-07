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
			selection: EntityProxyResource<typeof schema, EntityType.TezosNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TezosNetwork>>
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
	const tezosNetwork = $derived(selection({
		fields: {
			$$timestamps: true,
		},
	}))
	const titleFallback = $derived('tezos network')
	const viewDomId = $derived('tezos-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosNetwork_TimestampsView from '$/views/TezosNetwork_TimestampsView.svelte'
	import TezosBlocksView from '$/views/TezosBlocksView.svelte'
	import TezosOperationGroupsView from '$/views/TezosOperationGroupsView.svelte'
	import TezosOperationsView from '$/views/TezosOperationsView.svelte'
	import TezosAccountsView from '$/views/TezosAccountsView.svelte'
	import TezosContractsView from '$/views/TezosContractsView.svelte'
	import TezosBakersView from '$/views/TezosBakersView.svelte'
	import TezosCyclesView from '$/views/TezosCyclesView.svelte'
	import TezosBakingRightsView from '$/views/TezosBakingRightsView.svelte'
	import TezosTokensView from '$/views/TezosTokensView.svelte'
	import TezosTokenTransfersView from '$/views/TezosTokenTransfersView.svelte'
	import TezosBigMapsView from '$/views/TezosBigMapsView.svelte'
	import TezosBigMapKeysView from '$/views/TezosBigMapKeysView.svelte'
	import TezosBigMap_TimestampsView from '$/views/TezosBigMap_TimestampsView.svelte'
	import TezosBigMapKey_TimestampsView from '$/views/TezosBigMapKey_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tezosNetwork}>
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
		<ResourceBoundary resource={tezosNetwork}>
			{#snippet Pending()}
				{[prefetched.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || title || 'tezos network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[resolvedEntity.$$timestamps.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')].filter(Boolean).join(' ') || titleFallback}
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<TezosNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.TezosNetwork_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Tezos network observations.'
				id='TezosNetwork_TimestampsView-$$timestamps'
			/>

			<TezosBlocksView
				selection={selection[EntityProxyField]<EntityType.TezosBlock>('$$blocks')}
				title='blocks'
				emptyText='No Tezos blocks.'
				id='TezosBlocksView-$$blocks'
			/>

			<TezosOperationGroupsView
				selection={selection[EntityProxyField]<EntityType.TezosOperationGroup>('$$operationGroups')}
				title='operation groups'
				emptyText='No Tezos operation groups.'
				id='TezosOperationGroupsView-$$operationGroups'
			/>

			<TezosOperationsView
				selection={selection[EntityProxyField]<EntityType.TezosOperation>('$$operations')}
				title='operations'
				emptyText='No Tezos operations.'
				id='TezosOperationsView-$$operations'
			/>

			<TezosAccountsView
				selection={selection[EntityProxyField]<EntityType.TezosAccount>('$$accounts')}
				title='accounts'
				emptyText='No Tezos accounts.'
				id='TezosAccountsView-$$accounts'
			/>

			<TezosContractsView
				selection={selection[EntityProxyField]<EntityType.TezosContract>('$$contracts')}
				title='contracts'
				emptyText='No Tezos contracts.'
				id='TezosContractsView-$$contracts'
			/>

			<TezosBakersView
				selection={selection[EntityProxyField]<EntityType.TezosBaker>('$$bakers')}
				title='bakers'
				emptyText='No Tezos bakers.'
				id='TezosBakersView-$$bakers'
			/>

			<TezosCyclesView
				selection={selection[EntityProxyField]<EntityType.TezosCycle>('$$cycles')}
				title='cycles'
				emptyText='No Tezos cycles.'
				id='TezosCyclesView-$$cycles'
			/>

			<TezosBakingRightsView
				selection={selection[EntityProxyField]<EntityType.TezosBakingRight>('$$bakingRights')}
				title='baking rights'
				emptyText='No Tezos baking rights.'
				id='TezosBakingRightsView-$$bakingRights'
			/>

			<TezosTokensView
				selection={selection[EntityProxyField]<EntityType.TezosToken>('$$tokens')}
				title='tokens'
				emptyText='No Tezos tokens.'
				id='TezosTokensView-$$tokens'
			/>

			<TezosTokenTransfersView
				selection={selection[EntityProxyField]<EntityType.TezosTokenTransfer>('$$tokenTransfers')}
				title='token transfers'
				emptyText='No Tezos token transfers.'
				id='TezosTokenTransfersView-$$tokenTransfers'
			/>

			<TezosBigMapsView
				selection={selection[EntityProxyField]<EntityType.TezosBigMap>('$$bigMaps')}
				title='big maps'
				emptyText='No Tezos big maps.'
				id='TezosBigMapsView-$$bigMaps'
			/>

			<TezosBigMapKeysView
				selection={selection[EntityProxyField]<EntityType.TezosBigMapKey>('$$bigMapKeys')}
				title='big map keys'
				emptyText='No Tezos big map keys.'
				id='TezosBigMapKeysView-$$bigMapKeys'
			/>

			<TezosBigMap_TimestampsView
				selection={selection[EntityProxyField]<EntityType.TezosBigMap_Timestamp>('$$bigMapTimestamps')}
				title='big map timestamps'
				emptyText='No Tezos big map observations.'
				id='TezosBigMap_TimestampsView-$$bigMapTimestamps'
			/>

			<TezosBigMapKey_TimestampsView
				selection={selection[EntityProxyField]<EntityType.TezosBigMapKey_Timestamp>('$$bigMapKeyTimestamps')}
				title='big map key timestamps'
				emptyText='No Tezos big map key observations.'
				id='TezosBigMapKey_TimestampsView-$$bigMapKeyTimestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
