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
			selection: RegisteredEntityProxyResource<EntityType.ElementsPeg>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ElementsPeg>
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
	const elementsPeg = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			amountSats: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			amountSats: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.direction) ?? ''), String((pendingEntity.pegTransactionId) ?? '')].filter(Boolean).join(' ') || 'Elements peg')
	const viewDomId = $derived('elements-peg-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ElementsPeg_TimestampsView from '$/views/ElementsPeg_TimestampsView.svelte'
	import ElementsNetworkView from '$/views/ElementsNetworkView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsPeg}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'amountSats')}
			{[String((pendingEntity.direction) ?? ''), String((pendingEntity.pegTransactionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={elementsPeg}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.direction) ?? ''), String((resolvedEntity.pegTransactionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'amountSats')}
			{@const amountSats0 = pendingEntity.amountSats}
			{#if amountSats0 !== undefined && amountSats0 !== null}
				<NumberValue
					value={amountSats0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={elementsPeg}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSats0 = resolvedEntity.amountSats}
					{#if amountSats0 !== undefined && amountSats0 !== null}
						<NumberValue
							value={amountSats0}
						/>
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
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Direction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									direction: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const direction = resolvedEntity.direction}
							{#if direction !== undefined && direction !== null}
								{String((direction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Peg transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									pegTransactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pegTransactionId = resolvedEntity.pegTransactionId}
							{#if pegTransactionId !== undefined && pegTransactionId !== null}
								<TruncatedValue value={String((pegTransactionId) ?? '')} />
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
							amountSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSats = resolvedEntity.amountSats}
					{#if amountSats !== undefined && amountSats !== null}
						<div>
							<dt>Amount sats</dt>
							<dd>
								<NumberValue
									value={amountSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null && utxoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Bitcoin transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									href={
										(
											utxoTransaction[EntityMetaKey.Selector] != null && 'txId' in utxoTransaction[EntityMetaKey.Selector]
											&& utxoTransaction[EntityMetaKey.Selector].txId != null
											&& utxoTransaction[EntityMetaKey.Selector] != null && '$network' in utxoTransaction[EntityMetaKey.Selector] ?
												utxoTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in utxoTransaction[EntityMetaKey.Selector].$network
												&& utxoTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
												transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
												network: String(caip2StringFromValue(utxoTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													utxoTransaction[EntityMetaKey.Selector].$network != null && 'slug' in utxoTransaction[EntityMetaKey.Selector].$network
													&& utxoTransaction[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
													transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
													network: String(utxoTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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

			<ResourceBoundary
				resource={selection.$elementsTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null && utxoTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>Elements transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									href={
										(
											utxoTransaction[EntityMetaKey.Selector] != null && 'txId' in utxoTransaction[EntityMetaKey.Selector]
											&& utxoTransaction[EntityMetaKey.Selector].txId != null
											&& utxoTransaction[EntityMetaKey.Selector] != null && '$network' in utxoTransaction[EntityMetaKey.Selector] ?
												utxoTransaction[EntityMetaKey.Selector].$network != null && 'caip2' in utxoTransaction[EntityMetaKey.Selector].$network
												&& utxoTransaction[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
												transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
												network: String(caip2StringFromValue(utxoTransaction[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													utxoTransaction[EntityMetaKey.Selector].$network != null && 'slug' in utxoTransaction[EntityMetaKey.Selector].$network
													&& utxoTransaction[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
													transactionId: String(utxoTransaction[EntityMetaKey.Selector].txId ?? ''),
													network: String(utxoTransaction[EntityMetaKey.Selector].$network.slug ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							claimScript: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const claimScript = resolvedEntity.claimScript}
					{#if claimScript !== undefined && claimScript !== null}
						<div>
							<dt>Claim script</dt>
							<dd>
								<TruncatedValue value={String((claimScript) ?? '')} />
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
							pakProof: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pakProof = resolvedEntity.pakProof}
					{#if pakProof !== undefined && pakProof !== null}
						<div>
							<dt>PAK proof</dt>
							<dd>
								<TruncatedValue value={String((pakProof) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const elementsPegElementsPegTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={elementsPegElementsPegTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<ElementsPeg_TimestampsView
					selection={elementsPegElementsPegTimestampsViewTimestampsResource}
					countResource={elementsPegElementsPegTimestampsViewTimestampsResource.count}
					title='Observations'
					id='ElementsPeg_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
