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
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.Payout>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Payout>>
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
	const payout = $derived(selection({}))
	const titleFallback = $derived('payout')
	const viewDomId = $derived('payout-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import PayoutClaim_TimestampsView from '$/views/PayoutClaim_TimestampsView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Payout}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={payout}>
			{#snippet Pending()}
				{title || 'payout'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>payout ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									payoutId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const payoutId = pendingEntity.payoutId}
							{#if payoutId !== undefined && payoutId !== null}
								{String((payoutId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const payoutId = resolvedEntity.payoutId}
							{#if payoutId !== undefined && payoutId !== null}
								{String((payoutId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$assetInstance}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(assetInstance)}
					{#if assetInstance != null && assetInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>asset instance</dt>
							<dd>
								<AssetInstanceView
									selection={select(EntityType.AssetInstance, assetInstance[EntityMetaKey.Selector])}
									prefetched={assetInstance}
									href={
										(assetInstance[EntityMetaKey.Selector].$network !== undefined && assetInstance[EntityMetaKey.Selector].$network.slug !== undefined && assetInstance[EntityMetaKey.Selector].kind !== undefined && assetInstance[EntityMetaKey.Selector].assetKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
											network: String(assetInstance[EntityMetaKey.Selector].$network.slug ?? ''),
											kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
											assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
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

			<ResourceBoundary
				resource={selection.$assetClass}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(assetClass)}
					{#if assetClass != null && assetClass[EntityMetaKey.Selector] != null}
						<div>
							<dt>asset class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(network[EntityMetaKey.Selector].slug ?? ''),
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

			<ResourceBoundary
				resource={selection.$distributorContract}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>distributor contract</dt>
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							snapshotCoordinate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const snapshotCoordinate = pendingEntity.snapshotCoordinate}
					{#if snapshotCoordinate !== undefined && snapshotCoordinate !== null}
						<div>
							<dt>snapshot coordinate</dt>
							<dd>
								{String((snapshotCoordinate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const snapshotCoordinate = resolvedEntity.snapshotCoordinate}
					{#if snapshotCoordinate !== undefined && snapshotCoordinate !== null}
						<div>
							<dt>snapshot coordinate</dt>
							<dd>
								{String((snapshotCoordinate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							merkleRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const merkleRoot = pendingEntity.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const merkleRoot = resolvedEntity.merkleRoot}
					{#if merkleRoot !== undefined && merkleRoot !== null}
						<div>
							<dt>merkle root</dt>
							<dd>
								{String((merkleRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalAmount = pendingEntity.totalAmount}
					{#if totalAmount !== undefined && totalAmount !== null}
						<div>
							<dt>total amount</dt>
							<dd>
								{String((totalAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalAmount = resolvedEntity.totalAmount}
					{#if totalAmount !== undefined && totalAmount !== null}
						<div>
							<dt>total amount</dt>
							<dd>
								{String((totalAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							recipientCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const recipientCount = pendingEntity.recipientCount}
					{#if recipientCount !== undefined && recipientCount !== null}
						<div>
							<dt>recipient count</dt>
							<dd>
								{String((recipientCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recipientCount = resolvedEntity.recipientCount}
					{#if recipientCount !== undefined && recipientCount !== null}
						<div>
							<dt>recipient count</dt>
							<dd>
								{String((recipientCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							openedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const openedAt = pendingEntity.openedAt}
					{#if openedAt !== undefined && openedAt !== null}
						<div>
							<dt>opened AT</dt>
							<dd>
								<Timestamp timestamp={Number(openedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const openedAt = resolvedEntity.openedAt}
					{#if openedAt !== undefined && openedAt !== null}
						<div>
							<dt>opened AT</dt>
							<dd>
								<Timestamp timestamp={Number(openedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closedAt = pendingEntity.closedAt}
					{#if closedAt !== undefined && closedAt !== null}
						<div>
							<dt>closed AT</dt>
							<dd>
								<Timestamp timestamp={Number(closedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closedAt = resolvedEntity.closedAt}
					{#if closedAt !== undefined && closedAt !== null}
						<div>
							<dt>closed AT</dt>
							<dd>
								<Timestamp timestamp={Number(closedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<PayoutClaim_TimestampsView
				selection={selection.$$claims}
				title='claims'
				emptyText='No payout claim observations.'
				id='PayoutClaim_TimestampsView-claims'
			/>
		{/if}
	{/snippet}
</EntityView>
