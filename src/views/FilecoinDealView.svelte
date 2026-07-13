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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinDeal>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinDeal>>
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
		<ResourceBoundary resource={filecoinDeal}>
			{#snippet Pending()}
				{@const dealId0 = pendingEntity.dealId}
				{#if dealId0 !== undefined && dealId0 !== null}
					<NumberValue value={Number(dealId0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const dealId0 = resolvedEntity.dealId}
				{#if dealId0 !== undefined && dealId0 !== null}
					<NumberValue value={Number(dealId0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={filecoinDeal}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$provider}
				>
					{#snippet children(filecoinMiner)}
						{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
							<FilecoinMinerView
								selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
								prefetched={filecoinMiner}
								layout={EntityLayout.Value}
								open={false}
							/>
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
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
								layout={EntityLayout.Value}
								open={false}
							/>
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
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinDeal}>
			{#snippet Pending()}
				{@const verifiedDeal0 = pendingEntity.verifiedDeal}
				{#if verifiedDeal0 !== undefined && verifiedDeal0 !== null}
					<span data-text="muted">
						{verifiedDeal0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

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
								fields: {
									dealId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const dealId = pendingEntity.dealId}
							{#if dealId !== undefined && dealId !== null}
								<NumberValue value={Number(dealId)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dealId = resolvedEntity.dealId}
							{#if dealId !== undefined && dealId !== null}
								<NumberValue value={Number(dealId)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$provider}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinMiner)}
					{#if filecoinMiner != null && filecoinMiner[EntityMetaKey.Selector] != null}
						<div>
							<dt>Provider</dt>
							<dd>
								<FilecoinMinerView
									selection={select(EntityType.FilecoinMiner, filecoinMiner[EntityMetaKey.Selector])}
									prefetched={filecoinMiner}
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
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinActor)}
					{#if filecoinActor != null && filecoinActor[EntityMetaKey.Selector] != null}
						<div>
							<dt>Client</dt>
							<dd>
								<FilecoinActorView
									selection={select(EntityType.FilecoinActor, filecoinActor[EntityMetaKey.Selector])}
									prefetched={filecoinActor}
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
						fields: {
							pieceCid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pieceCid = pendingEntity.pieceCid}
					{#if pieceCid !== undefined && pieceCid !== null}
						<div>
							<dt>Piece CID</dt>
							<dd>
								<TruncatedValue value={String((pieceCid) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							pieceSizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pieceSizeBytes = pendingEntity.pieceSizeBytes}
					{#if pieceSizeBytes !== undefined && pieceSizeBytes !== null}
						<div>
							<dt>Piece size bytes</dt>
							<dd>
								<NumberValue value={Number(pieceSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pieceSizeBytes = resolvedEntity.pieceSizeBytes}
					{#if pieceSizeBytes !== undefined && pieceSizeBytes !== null}
						<div>
							<dt>Piece size bytes</dt>
							<dd>
								<NumberValue value={Number(pieceSizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedDeal: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedDeal = pendingEntity.verifiedDeal}
					{#if verifiedDeal !== undefined && verifiedDeal !== null}
						<div>
							<dt>Verified deal</dt>
							<dd>
								{verifiedDeal ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = pendingEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							startEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startEpoch = pendingEntity.startEpoch}
					{#if startEpoch !== undefined && startEpoch !== null}
						<div>
							<dt>Start epoch</dt>
							<dd>
								<NumberValue value={Number(startEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startEpoch = resolvedEntity.startEpoch}
					{#if startEpoch !== undefined && startEpoch !== null}
						<div>
							<dt>Start epoch</dt>
							<dd>
								<NumberValue value={Number(startEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endEpoch = pendingEntity.endEpoch}
					{#if endEpoch !== undefined && endEpoch !== null}
						<div>
							<dt>End epoch</dt>
							<dd>
								<NumberValue value={Number(endEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endEpoch = resolvedEntity.endEpoch}
					{#if endEpoch !== undefined && endEpoch !== null}
						<div>
							<dt>End epoch</dt>
							<dd>
								<NumberValue value={Number(endEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storagePricePerEpochAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storagePricePerEpochAttoFil = pendingEntity.storagePricePerEpochAttoFil}
					{#if storagePricePerEpochAttoFil !== undefined && storagePricePerEpochAttoFil !== null}
						<div>
							<dt>Storage price per epoch attoFIL</dt>
							<dd>
								<NumberValue value={Number(storagePricePerEpochAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storagePricePerEpochAttoFil = resolvedEntity.storagePricePerEpochAttoFil}
					{#if storagePricePerEpochAttoFil !== undefined && storagePricePerEpochAttoFil !== null}
						<div>
							<dt>Storage price per epoch attoFIL</dt>
							<dd>
								<NumberValue value={Number(storagePricePerEpochAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerCollateralAttoFil = pendingEntity.providerCollateralAttoFil}
					{#if providerCollateralAttoFil !== undefined && providerCollateralAttoFil !== null}
						<div>
							<dt>Provider collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(providerCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerCollateralAttoFil = resolvedEntity.providerCollateralAttoFil}
					{#if providerCollateralAttoFil !== undefined && providerCollateralAttoFil !== null}
						<div>
							<dt>Provider collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(providerCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clientCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientCollateralAttoFil = pendingEntity.clientCollateralAttoFil}
					{#if clientCollateralAttoFil !== undefined && clientCollateralAttoFil !== null}
						<div>
							<dt>Client collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(clientCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientCollateralAttoFil = resolvedEntity.clientCollateralAttoFil}
					{#if clientCollateralAttoFil !== undefined && clientCollateralAttoFil !== null}
						<div>
							<dt>Client collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(clientCollateralAttoFil)} />
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
				selection={selection.$$timestamps}
				title='Observations'
				id='FilecoinDeal_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
