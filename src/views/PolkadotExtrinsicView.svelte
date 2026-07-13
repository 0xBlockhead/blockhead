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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotExtrinsic>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotExtrinsic>>
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
	const polkadotExtrinsic = $derived(selection({
		fields: {
			callName: true,
			success: true,
		},
	}))
	const titleFallback = $derived((String((pendingEntity.indexInBlock) ?? '') ? 'Extrinsic #' + String((pendingEntity.indexInBlock) ?? '') : '') || 'Polkadot extrinsic')
	const viewDomId = $derived('polkadot-extrinsic-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$block !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.slug !== undefined && pendingEntity.$block.blockNumber !== undefined && pendingEntity.$block.hash !== undefined && pendingEntity.indexInBlock !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
			network: String(pendingEntity.$block.$network.slug ?? ''),
			blockNumber: String(pendingEntity.$block.blockNumber ?? ''),
			hash: String(pendingEntity.$block.hash ?? ''),
			extrinsicIndex: String(pendingEntity.indexInBlock ?? ''),
		}) : undefined)
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
		<ResourceBoundary resource={polkadotExtrinsic}>
			{#snippet Pending()}
				{[String((pendingEntity.callName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot extrinsic'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.callName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotExtrinsic}>
			{#snippet Pending()}
				{@const success0 = pendingEntity.success}
				{#if success0 !== undefined && success0 !== null}
					<span data-text="muted">
						{success0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in block</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInBlock: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInBlock = pendingEntity.indexInBlock}
							{#if indexInBlock !== undefined && indexInBlock !== null}
								{String((indexInBlock) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hash = pendingEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							callName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const callName = pendingEntity.callName}
					{#if callName !== undefined && callName !== null}
						<div>
							<dt>Call name</dt>
							<dd>
								{String((callName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							success: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const success = pendingEntity.success}
					{#if success !== undefined && success !== null}
						<div>
							<dt>Success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(polkadotAccount)}
					{#if polkadotAccount != null && polkadotAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<PolkadotAccountView
									selection={select(EntityType.PolkadotAccount, polkadotAccount[EntityMetaKey.Selector])}
									prefetched={polkadotAccount}
									href={
										(polkadotAccount[EntityMetaKey.Selector].$network !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.slug !== undefined && polkadotAccount[EntityMetaKey.Selector].accountId !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
											network: String(polkadotAccount[EntityMetaKey.Selector].$network.slug ?? ''),
											accountId: String(polkadotAccount[EntityMetaKey.Selector].accountId ?? ''),
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
				resource={selection.$pallet}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null && polkadotPallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>Pallet</dt>
							<dd>
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet[EntityMetaKey.Selector])}
									prefetched={polkadotPallet}
									href={
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.slug !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/pallet/[palletName=stringSegment]', {
											network: String(polkadotPallet[EntityMetaKey.Selector].$network.slug ?? ''),
											palletName: String(polkadotPallet[EntityMetaKey.Selector].palletName ?? ''),
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

			<div>
				<dt>Block</dt>
				<dd>
					<PolkadotBlockView
						selection={select(EntityType.PolkadotBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined && selection.entitySelector.$block.blockNumber !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
							}) : selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.slug !== undefined && selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								network: String(selection.entitySelector.$block.$network.slug ?? ''),
								blockNumber: String(selection.entitySelector.$block.blockNumber ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
