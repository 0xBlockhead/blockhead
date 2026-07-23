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
			selection: RegisteredEntityProxyResource<EntityType.CardanoTxOutputAsset>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoTxOutputAsset>
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
	const cardanoTxOutputAsset = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			quantity: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			quantity: true,
		},
	}))
	const titleFallback = 'Cardano transaction output asset'
	const viewDomId = $derived('cardano-tx-output-asset-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
	import CardanoNativeAssetView from '$/views/CardanoNativeAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxOutputAsset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$asset') && prefetched.$asset != null && Object.hasOwn(prefetched.$asset, 'fingerprint') && Object.hasOwn(prefetched, 'quantity')}
			{@const cardanoNativeAsset0 = pendingEntity.$asset}
			{#if cardanoNativeAsset0 != null && selection.entitySelector.$asset != null}
				<CardanoNativeAssetView
					selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset, { sources: selection.sources })}
					prefetched={cardanoNativeAsset0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoTxOutputAsset}>
				{#snippet children(entity)}
					<CardanoNativeAssetView
						selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$asset') && prefetched.$asset != null && Object.hasOwn(prefetched.$asset, 'fingerprint') && Object.hasOwn(prefetched, 'quantity')}
			{@const quantity0 = pendingEntity.quantity}
			{#if quantity0 !== undefined && quantity0 !== null}
				<NumberValue
					value={quantity0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoTxOutputAsset}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quantity0 = resolvedEntity.quantity}
					{#if quantity0 !== undefined && quantity0 !== null}
						<NumberValue
							value={quantity0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>output</dt>
				<dd>
					<CardanoTxOutputView
						selection={select(EntityType.CardanoTxOutput, selection.entitySelector.$output)}
						href={
							(
								selection.entitySelector.$output != null && 'outputIndex' in selection.entitySelector.$output
								&& selection.entitySelector.$output.outputIndex != null
								&& selection.entitySelector.$output != null && '$transaction' in selection.entitySelector.$output
								&& selection.entitySelector.$output.$transaction != null && 'hash' in selection.entitySelector.$output.$transaction
								&& selection.entitySelector.$output.$transaction.hash != null
								&& selection.entitySelector.$output.$transaction != null && '$network' in selection.entitySelector.$output.$transaction ?
									selection.entitySelector.$output.$transaction.$network != null && 'caip2' in selection.entitySelector.$output.$transaction.$network
									&& selection.entitySelector.$output.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
									outputIndex: String(selection.entitySelector.$output.outputIndex ?? ''),
									transactionId: String(selection.entitySelector.$output.$transaction.hash ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$output.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$output.$transaction.$network != null && 'slug' in selection.entitySelector.$output.$transaction.$network
										&& selection.entitySelector.$output.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
										outputIndex: String(selection.entitySelector.$output.outputIndex ?? ''),
										transactionId: String(selection.entitySelector.$output.$transaction.hash ?? ''),
										network: String(selection.entitySelector.$output.$transaction.$network.slug ?? ''),
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

			<div>
				<dt>asset</dt>
				<dd>
					<CardanoNativeAssetView
						selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>quantity</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									quantity: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quantity = resolvedEntity.quantity}
							{#if quantity !== undefined && quantity !== null}
								<NumberValue
									value={quantity}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
