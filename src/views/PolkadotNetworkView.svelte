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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotNetwork>>
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
	const polkadotNetwork = $derived(selection({}))
	const titleFallback = $derived('Polkadot network')
	const viewDomId = $derived('polkadot-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotNetwork_TimestampsView from '$/views/PolkadotNetwork_TimestampsView.svelte'
	import PolkadotBlocksView from '$/views/PolkadotBlocksView.svelte'
	import PolkadotAssetsView from '$/views/PolkadotAssetsView.svelte'
	import PolkadotAssetBalance_TimestampsView from '$/views/PolkadotAssetBalance_TimestampsView.svelte'
	import PolkadotReferendumsView from '$/views/PolkadotReferendumsView.svelte'
	import PolkadotValidatorsView from '$/views/PolkadotValidatorsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$network.caip2.namespace) + ':' + String(pendingEntity.$network.caip2.reference))].slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={polkadotNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
		<ResourceBoundary resource={polkadotNetwork}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
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
			<PolkadotNetwork_TimestampsView
				selection={selection[EntityProxyField]<EntityType.PolkadotNetwork_Timestamp>('$$timestamps')}
				title='Runtime snapshots'
				emptyText='No Polkadot runtime snapshots.'
				id='PolkadotNetwork_TimestampsView-$$timestamps'
			/>

			<PolkadotBlocksView
				selection={selection[EntityProxyField]<EntityType.PolkadotBlock>('$$blocks')}
				title='Blocks'
				emptyText='No Polkadot blocks.'
				id='PolkadotBlocksView-$$blocks'
			/>

			<PolkadotAssetsView
				selection={selection[EntityProxyField]<EntityType.PolkadotAsset>('$$assets')}
				title='Assets'
				emptyText='No Polkadot assets.'
				id='PolkadotAssetsView-$$assets'
			/>

			<PolkadotAssetBalance_TimestampsView
				selection={selection[EntityProxyField]<EntityType.PolkadotAssetBalance_Timestamp>('$$assetBalanceTimestamps')}
				title='Asset balances'
				emptyText='No Polkadot asset balance observations.'
				id='PolkadotAssetBalance_TimestampsView-$$assetBalanceTimestamps'
			/>

			<PolkadotReferendumsView
				selection={selection[EntityProxyField]<EntityType.PolkadotReferendum>('$$referendums')}
				title='Referendums'
				emptyText='No Polkadot referendums.'
				id='PolkadotReferendumsView-$$referendums'
			/>

			<PolkadotValidatorsView
				selection={selection[EntityProxyField]<EntityType.PolkadotValidator>('$$validators')}
				title='Validators'
				emptyText='No Polkadot validators.'
				id='PolkadotValidatorsView-$$validators'
			/>

			<CollapsibleTabs
				id={viewDomId + '-carousel-rpc-endpoints'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'rpc-endpoints',
							label: 'RPC endpoints',
						},
					]
				}
				data-card
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>RPC endpoints</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionRpcEndpoints({ id, label, open })}
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const rpcEndpoints = entity.rpcEndpoints}
							{#if rpcEndpoints.length > 0}
								<ul data-column="gap-2">
									{#each rpcEndpoints as rPCEndpoint, rPCEndpointIndex (rPCEndpointIndex)}
										{@const providerNameValue = rPCEndpoint.providerName}
										{@const transportTypeValue = rPCEndpoint.transportType}
										{@const urlValue = rPCEndpoint.url}
										<li>
											<dl data-column-item="center">
												<div>
													<dt>Provider</dt>
													<dd>
														{#if providerNameValue !== undefined && providerNameValue !== null}
															{String((providerNameValue) ?? '')}
														{/if}
													</dd>
												</div>

												<div>
													<dt>Transport</dt>
													<dd>
														{#if transportTypeValue !== undefined && transportTypeValue !== null}
															{String((transportTypeValue) ?? '')}
														{/if}
													</dd>
												</div>

												<div>
													<dt>URL</dt>
													<dd>
														{#if urlValue !== undefined && urlValue !== null}
															<svelte:element
																this={'a'}
																href={String(urlValue)}
																target="_blank"
																rel="noreferrer noopener"
															>
																<TruncatedValue value={String(urlValue)} />
															</svelte:element>
														{/if}
													</dd>
												</div>
											</dl>
										</li>
									{/each}
								</ul>
							{:else}
								<p data-text="muted">No RPC endpoints.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
