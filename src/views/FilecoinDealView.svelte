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
			selection: RegisteredEntityProxyResource<EntityType.FilecoinDeal>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FilecoinDeal>>
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
	const filecoinDeal = $derived(selection({
		sources: selection.sources,
		fields: {
			verifiedDeal: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.dealId) ?? '')].filter(Boolean).join(' ') || 'filecoin deal')
	const viewDomId = $derived('filecoin-deal-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FilecoinDeal_TimestampsView from '$/views/FilecoinDeal_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinDeal}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const dealId0 = pendingEntity.dealId}
					{#if dealId0 !== undefined && dealId0 !== null}
						<NumberValue
							value={dealId0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={filecoinDeal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dealId0 = resolvedEntity.dealId}
					{#if dealId0 !== undefined && dealId0 !== null}
						<NumberValue
							value={dealId0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$provider}
					>
						{#snippet children(filecoinMiner)}
							{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									prefetched={filecoinMiner}
									href={
									(filecoinMiner[EntityMetaKey.Selector].minerAddress !== undefined && filecoinMiner[EntityMetaKey.Selector].$network !== undefined && filecoinMiner[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
										minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
										network: String(caip2StringFromValue(filecoinMiner[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinMiner[EntityMetaKey.Selector].minerAddress !== undefined && filecoinMiner[EntityMetaKey.Selector].$network !== undefined && filecoinMiner[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
										minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
										network: String(filecoinMiner[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={selection.$client}
					>
						{#snippet children(filecoinActor)}
							{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
									(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={filecoinDeal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$provider}
					>
						{#snippet children(filecoinMiner)}
							{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									prefetched={filecoinMiner}
									href={
									(filecoinMiner[EntityMetaKey.Selector].minerAddress !== undefined && filecoinMiner[EntityMetaKey.Selector].$network !== undefined && filecoinMiner[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
										minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
										network: String(caip2StringFromValue(filecoinMiner[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinMiner[EntityMetaKey.Selector].minerAddress !== undefined && filecoinMiner[EntityMetaKey.Selector].$network !== undefined && filecoinMiner[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
										minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
										network: String(filecoinMiner[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<ResourceBoundary
						resource={selection.$client}
					>
						{#snippet children(filecoinActor)}
							{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
									(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
									}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
										address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
										network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
									}) : undefined)
								}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const verifiedDeal0 = pendingEntity.verifiedDeal}
			{#if verifiedDeal0 !== undefined && verifiedDeal0 !== null}
				<span data-text="muted">
					{verifiedDeal0 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={filecoinDeal}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedDeal0 = resolvedEntity.verifiedDeal}
					{#if verifiedDeal0 !== undefined && verifiedDeal0 !== null}
						<span data-text="muted">
							{verifiedDeal0 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Deal ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									dealId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dealId = resolvedEntity.dealId}
							{#if dealId !== undefined && dealId !== null}
								<NumberValue
									value={dealId}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$provider}
			>
				{#snippet children(filecoinMiner)}
					{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
						<div>
							<dt>Provider</dt>
							<dd>
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									prefetched={filecoinMiner}
									href={
										(filecoinMiner[EntityMetaKey.Selector].minerAddress !== undefined && filecoinMiner[EntityMetaKey.Selector].$network !== undefined && filecoinMiner[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
											minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
											network: String(caip2StringFromValue(filecoinMiner[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : filecoinMiner[EntityMetaKey.Selector].minerAddress !== undefined && filecoinMiner[EntityMetaKey.Selector].$network !== undefined && filecoinMiner[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
											minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
											network: String(filecoinMiner[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$client}
			>
				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Client</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
									href={
										(filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
											address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(filecoinActor[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : filecoinActor[EntityMetaKey.Selector].address !== undefined && filecoinActor[EntityMetaKey.Selector].$network !== undefined && filecoinActor[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
											address: String(filecoinActor[EntityMetaKey.Selector].address ?? ''),
											network: String(filecoinActor[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							pieceCid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceCid = resolvedEntity.pieceCid}
					{#if pieceCid !== undefined && pieceCid !== null}
						<div>
							<dt>Piece CID</dt>
							<dd>
								<TruncatedValue value={String((pieceCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							pieceSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceSizeBytes = resolvedEntity.pieceSizeBytes}
					{#if pieceSizeBytes !== undefined && pieceSizeBytes !== null}
						<div>
							<dt>Piece size bytes</dt>
							<dd>
								<NumberValue
									value={pieceSizeBytes}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							verifiedDeal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedDeal = resolvedEntity.verifiedDeal}
					{#if verifiedDeal !== undefined && verifiedDeal !== null}
						<div>
							<dt>Verified deal</dt>
							<dd>
								{verifiedDeal ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
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
						sources: selection.sources,
						fields: {
							startEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startEpoch = resolvedEntity.startEpoch}
					{#if startEpoch !== undefined && startEpoch !== null}
						<div>
							<dt>Start epoch</dt>
							<dd>
								<NumberValue
									value={startEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							endEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endEpoch = resolvedEntity.endEpoch}
					{#if endEpoch !== undefined && endEpoch !== null}
						<div>
							<dt>End epoch</dt>
							<dd>
								<NumberValue
									value={endEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							storagePricePerEpochAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storagePricePerEpochAttoFil = resolvedEntity.storagePricePerEpochAttoFil}
					{#if storagePricePerEpochAttoFil !== undefined && storagePricePerEpochAttoFil !== null}
						<div>
							<dt>Storage price per epoch attoFIL</dt>
							<dd>
								<NumberValue
									value={storagePricePerEpochAttoFil}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerCollateralAttoFil = resolvedEntity.providerCollateralAttoFil}
					{#if providerCollateralAttoFil !== undefined && providerCollateralAttoFil !== null}
						<div>
							<dt>Provider collateral attoFIL</dt>
							<dd>
								<NumberValue
									value={providerCollateralAttoFil}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							clientCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientCollateralAttoFil = resolvedEntity.clientCollateralAttoFil}
					{#if clientCollateralAttoFil !== undefined && clientCollateralAttoFil !== null}
						<div>
							<dt>Client collateral attoFIL</dt>
							<dd>
								<NumberValue
									value={clientCollateralAttoFil}
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
			<FilecoinDeal_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				id='FilecoinDeal_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
