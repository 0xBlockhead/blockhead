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
			selection: RegisteredEntityProxyResource<EntityType.PolkadotExtrinsic>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.PolkadotExtrinsic>
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
	const polkadotExtrinsic = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			callName: true,
			success: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			callName: true,
			success: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInBlock) ?? '') ? 'Extrinsic #' + String((pendingEntity.indexInBlock) ?? '') : '') || 'Polkadot extrinsic')
	const viewDomId = $derived('polkadot-extrinsic-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotExtrinsic}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInBlock ?? '')}
	href={
		href ?? (
			selection.entitySelector != null && 'indexInBlock' in selection.entitySelector
			&& selection.entitySelector.indexInBlock != null
			&& selection.entitySelector != null && '$block' in selection.entitySelector
			&& selection.entitySelector.$block != null && 'blockNumber' in selection.entitySelector.$block
			&& selection.entitySelector.$block.blockNumber != null
			&& selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
			&& selection.entitySelector.$block.hash != null
			&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block ?
				selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
				&& selection.entitySelector.$block.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
				extrinsicIndex: String(selection.entitySelector.indexInBlock ?? ''),
				blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
				hash: String(selection.entitySelector.$block.hash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
					&& selection.entitySelector.$block.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
					extrinsicIndex: String(selection.entitySelector.indexInBlock ?? ''),
					blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
					hash: String(selection.entitySelector.$block.hash ?? ''),
					network: String(selection.entitySelector.$block.$network.slug ?? ''),
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
		{@const serialValue = pendingEntity.indexInBlock}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Extrinsic </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'callName') && Object.hasOwn(prefetched, 'success')}
			{[String((pendingEntity.callName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotExtrinsic}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.callName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'callName') && Object.hasOwn(prefetched, 'success')}
			{@const success0 = pendingEntity.success}
			{#if success0 !== undefined && success0 !== null}
				<span data-text="muted">
					{success0 ? 'Yes' : 'No'}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotExtrinsic}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const success0 = resolvedEntity.success}
					{#if success0 !== undefined && success0 !== null}
						<span data-text="muted">
							{success0 ? 'Yes' : 'No'}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in block</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInBlock: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInBlock = resolvedEntity.indexInBlock}
							{#if indexInBlock !== undefined && indexInBlock !== null}
								{String((indexInBlock) ?? '')}
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
							hash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash = resolvedEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
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
							callName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const callName = resolvedEntity.callName}
					{#if callName !== undefined && callName !== null}
						<div>
							<dt>Call name</dt>
							<dd>
								{String((callName) ?? '')}
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
							success: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const success = resolvedEntity.success}
					{#if success !== undefined && success !== null}
						<div>
							<dt>Success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$signer}
			>
				{#snippet children(polkadotAccount)}
					{#if polkadotAccount != null && polkadotAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<PolkadotAccountView
									selection={select(EntityType.PolkadotAccount, polkadotAccount[EntityMetaKey.Selector])}
									prefetched={polkadotAccount}
									href={
										(
											polkadotAccount[EntityMetaKey.Selector] != null && 'accountId' in polkadotAccount[EntityMetaKey.Selector]
											&& polkadotAccount[EntityMetaKey.Selector].accountId != null
											&& polkadotAccount[EntityMetaKey.Selector] != null && '$network' in polkadotAccount[EntityMetaKey.Selector] ?
												polkadotAccount[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotAccount[EntityMetaKey.Selector].$network
												&& polkadotAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
												network: String(caip2StringFromValue(polkadotAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													polkadotAccount[EntityMetaKey.Selector].$network != null && 'slug' in polkadotAccount[EntityMetaKey.Selector].$network
													&& polkadotAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
													network: String(polkadotAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$pallet}
			>
				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>Pallet</dt>
							<dd>
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									href={
										(
											polkadotPallet[EntityMetaKey.Selector] != null && 'palletName' in polkadotPallet[EntityMetaKey.Selector]
											&& polkadotPallet[EntityMetaKey.Selector].palletName != null
											&& polkadotPallet[EntityMetaKey.Selector] != null && '$network' in polkadotPallet[EntityMetaKey.Selector] ?
												polkadotPallet[EntityMetaKey.Selector].$network != null && 'caip2' in polkadotPallet[EntityMetaKey.Selector].$network
												&& polkadotPallet[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
												palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
												network: String(caip2StringFromValue(polkadotPallet[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													polkadotPallet[EntityMetaKey.Selector].$network != null && 'slug' in polkadotPallet[EntityMetaKey.Selector].$network
													&& polkadotPallet[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
													palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
													network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
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
				<dt>Block</dt>
				<dd>
					<PolkadotBlockView
						selection={select(EntityType.PolkadotBlock, selection.entitySelector.$block)}
						href={
							(
								selection.entitySelector.$block != null && 'blockNumber' in selection.entitySelector.$block
								&& selection.entitySelector.$block.blockNumber != null ?
									selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
									&& selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
									&& selection.entitySelector.$block.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
									blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
										&& selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
										&& selection.entitySelector.$block.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
										blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
										network: String(selection.entitySelector.$block.$network.slug ?? ''),
									})
									:
											selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
											&& selection.entitySelector.$block.hash != null
											&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
											&& selection.entitySelector.$block.$network != null && 'caip2' in selection.entitySelector.$block.$network
											&& selection.entitySelector.$block.$network.caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
											blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
											hash: String(selection.entitySelector.$block.hash ?? ''),
											network: String(caip2StringFromValue(selection.entitySelector.$block.$network.caip2) ?? ''),
										})
										:
												selection.entitySelector.$block != null && 'hash' in selection.entitySelector.$block
												&& selection.entitySelector.$block.hash != null
												&& selection.entitySelector.$block != null && '$network' in selection.entitySelector.$block
												&& selection.entitySelector.$block.$network != null && 'slug' in selection.entitySelector.$block.$network
												&& selection.entitySelector.$block.$network.slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
												blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
												hash: String(selection.entitySelector.$block.hash ?? ''),
												network: String(selection.entitySelector.$block.$network.slug ?? ''),
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
		</dl>
	{/snippet}
</EntityView>
