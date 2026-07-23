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
			selection: RegisteredEntityProxyResource<EntityType.UtxoTransaction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.UtxoTransaction>
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
	const utxoTransaction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			feeSats: true,
			isCoinbase: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			feeSats: true,
			isCoinbase: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txId) ?? '')].filter(Boolean).join(' ') || 'UTXO transaction')
	const viewDomId = $derived('utxo-transaction-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'txId' in selection.entitySelector
			&& selection.entitySelector.txId != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
				transactionId: String(selection.entitySelector.txId ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
					transactionId: String(selection.entitySelector.txId ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'feeSats') && Object.hasOwn(prefetched, 'isCoinbase')}
			{@const txId0 = pendingEntity.txId}
			{#if txId0 !== undefined && txId0 !== null}
				<TruncatedValue value={String((txId0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txId0 = resolvedEntity.txId}
					{#if txId0 !== undefined && txId0 !== null}
						<TruncatedValue value={String((txId0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'feeSats') && Object.hasOwn(prefetched, 'isCoinbase')}
			{@const txId0 = pendingEntity.txId}
			{#if txId0 !== undefined && txId0 !== null}
				<TruncatedValue value={String((txId0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txId0 = resolvedEntity.txId}
					{#if txId0 !== undefined && txId0 !== null}
						<TruncatedValue value={String((txId0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'feeSats') && Object.hasOwn(prefetched, 'isCoinbase')}
			{@const feeSats0 = pendingEntity.feeSats}
			{#if feeSats0 !== undefined && feeSats0 !== null}
				<span data-text="muted">
					{String((feeSats0) ?? '')}
				</span>
			{/if}
			{@const isCoinbase1 = pendingEntity.isCoinbase}
			{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
				<span data-text="muted">
					{isCoinbase1 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeSats0 = resolvedEntity.feeSats}
					{#if feeSats0 !== undefined && feeSats0 !== null}
						<span data-text="muted">
							{String((feeSats0) ?? '')}
						</span>
					{/if}
					{@const isCoinbase1 = resolvedEntity.isCoinbase}
					{#if isCoinbase1 !== undefined && isCoinbase1 !== null}
						<span data-text="muted">
							{isCoinbase1 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
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
							lockTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lockTime = resolvedEntity.lockTime}
					{#if lockTime !== undefined && lockTime !== null}
						<div>
							<dt>Lock time</dt>
							<dd>
								{String((lockTime) ?? '')}
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
							isCoinbase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isCoinbase = resolvedEntity.isCoinbase}
					{#if isCoinbase !== undefined && isCoinbase !== null}
						<div>
							<dt>Coinbase</dt>
							<dd>
								{isCoinbase ? 'Yes' : 'No'}
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
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>Size</dt>
							<dd>
								{String((sizeBytes) ?? '')}
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
							virtualSizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const virtualSizeBytes = resolvedEntity.virtualSizeBytes}
					{#if virtualSizeBytes !== undefined && virtualSizeBytes !== null}
						<div>
							<dt>Virtual size</dt>
							<dd>
								{String((virtualSizeBytes) ?? '')}
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
							weightUnits: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const weightUnits = resolvedEntity.weightUnits}
					{#if weightUnits !== undefined && weightUnits !== null}
						<div>
							<dt>Weight</dt>
							<dd>
								{String((weightUnits) ?? '')}
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
							feeSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeSats = resolvedEntity.feeSats}
					{#if feeSats !== undefined && feeSats !== null}
						<div>
							<dt>Fee</dt>
							<dd>
								<NumberValue
									value={feeSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(utxoBlock)}
					{#if utxoBlock != null && utxoBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<UtxoBlockView
									selection={select(EntityType.UtxoBlock, utxoBlock[EntityMetaKey.Selector])}
									prefetched={utxoBlock}
									href={
										(
											utxoBlock[EntityMetaKey.Selector] != null && 'height' in utxoBlock[EntityMetaKey.Selector]
											&& utxoBlock[EntityMetaKey.Selector].height != null
											&& utxoBlock[EntityMetaKey.Selector] != null && 'hash' in utxoBlock[EntityMetaKey.Selector]
											&& utxoBlock[EntityMetaKey.Selector].hash != null
											&& utxoBlock[EntityMetaKey.Selector] != null && '$network' in utxoBlock[EntityMetaKey.Selector] ?
												utxoBlock[EntityMetaKey.Selector].$network != null && 'caip2' in utxoBlock[EntityMetaKey.Selector].$network
												&& utxoBlock[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
												blockNumber: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
												hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
												network: String(caip2StringFromValue(utxoBlock[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													utxoBlock[EntityMetaKey.Selector].$network != null && 'slug' in utxoBlock[EntityMetaKey.Selector].$network
													&& utxoBlock[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
													blockNumber: String(utxoBlock[EntityMetaKey.Selector].height ?? ''),
													hash: String(utxoBlock[EntityMetaKey.Selector].hash ?? ''),
													network: String(utxoBlock[EntityMetaKey.Selector].$network.slug ?? ''),
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

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-utxo-transaction-activity-a'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'utxo-transaction-inputs',
						label: 'Inputs',
						ownsSection: true,
					},
					{
						id: 'utxo-transaction-outputs',
						label: 'Outputs',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-activity-a'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerUtxoTransactionInputs(_context, Content)}
				{@const utxoTransactionActivityAUtxoTransactionInputsResource = selection.$$inputs}
				<ResourceBoundary
					resource={utxoTransactionActivityAUtxoTransactionInputsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionUtxoTransactionInputs({ id, label, open, active })}
				{@const utxoTransactionActivityAUtxoTransactionInputsResource = selection.$$inputs}
				<ResourceBoundary
					resource={utxoTransactionActivityAUtxoTransactionInputsResource}
				>
					{#snippet children(utxoInput)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<UtxoInputsView
								selection={utxoTransactionActivityAUtxoTransactionInputsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No inputs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerUtxoTransactionOutputs(_context, Content)}
				{@const utxoTransactionActivityAUtxoTransactionOutputsResource = selection.$$outputs}
				<ResourceBoundary
					resource={utxoTransactionActivityAUtxoTransactionOutputsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionUtxoTransactionOutputs({ id, label, open, active })}
				{@const utxoTransactionActivityAUtxoTransactionOutputsResource = selection.$$outputs}
				<ResourceBoundary
					resource={utxoTransactionActivityAUtxoTransactionOutputsResource}
				>
					{#snippet children(utxoOutput)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<UtxoOutputsView
								selection={utxoTransactionActivityAUtxoTransactionOutputsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No outputs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
