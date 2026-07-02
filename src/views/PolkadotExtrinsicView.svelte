<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const polkadotExtrinsic = $derived(selection({
		fields: {
			callName: true,
			success: true,
			hash: true,
			$signer: true,
			$pallet: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '') ? 'Extrinsic #' + String((({ ...selection.entitySelector, ...prefetched }).indexInBlock) ?? '') : '') || 'Polkadot extrinsic')
	const viewDomId = $derived('polkadot-extrinsic-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
	import PolkadotPalletView from '$/views/PolkadotPalletView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotExtrinsic}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInBlock ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$block.$network.caip2)].slug),
			blockNumber: String(({ ...selection.entitySelector, ...prefetched }).$block.blockNumber),
			hash: String(({ ...selection.entitySelector, ...prefetched }).$block.hash),
			extrinsicIndex: String(({ ...selection.entitySelector, ...prefetched }).indexInBlock),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInBlock}
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).callName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot extrinsic'}
		{:else}
			<ResourceBoundary resource={polkadotExtrinsic}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).callName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot extrinsic'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.callName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const success0 = prefetched.success}
			{#if success0 !== undefined && success0 !== null}
				<span data-text="muted">
					{String((success0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotExtrinsic}>
				{#snippet Pending()}
					{@const success0 = prefetched.success}
					{#if success0 !== undefined && success0 !== null}
						<span data-text="muted">
							{String((success0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const success0 = entity.success}
					{#if success0 !== undefined && success0 !== null}
						<span data-text="muted">
							{String((success0) ?? '')}
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
					<ResourceBoundary resource={polkadotExtrinsic}>
						{#snippet Pending()}
							{@const indexInBlock = prefetched.indexInBlock ?? selection.entitySelector.indexInBlock}
							{#if indexInBlock !== undefined && indexInBlock !== null}
								{String((indexInBlock) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInBlock = entity.indexInBlock ?? selection.entitySelector.indexInBlock ?? prefetched.indexInBlock}
							{#if indexInBlock !== undefined && indexInBlock !== null}
								{String((indexInBlock) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={polkadotExtrinsic}>
				{#snippet Pending()}
					{@const hash = prefetched.hash ?? selection.entitySelector.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String(hash)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hash = entity.hash ?? selection.entitySelector.hash ?? prefetched.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String(hash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PolkadotAccount, false>('$signer')}
			>
				{#snippet children(polkadotAccount)}
					{#if polkadotAccount != null}
						<div>
							<dt>Signer</dt>
							<dd>
								<PolkadotAccountView
									selection={select(EntityType.PolkadotAccount, polkadotAccount.entitySelector)}
									prefetched={polkadotAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
											networkSlug: String(polkadotAccount.entitySelector.$network.slug),
											accountId: String(polkadotAccount.entitySelector.accountId),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
			>
				{#snippet children(polkadotPallet)}
					{#if polkadotPallet != null}
						<div>
							<dt>Pallet</dt>
							<dd>
								<PolkadotPalletView
									selection={select(EntityType.PolkadotPallet, polkadotPallet.entitySelector)}
									prefetched={polkadotPallet}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
											networkSlug: String(polkadotPallet.entitySelector.$network.slug),
											palletName: String(polkadotPallet.entitySelector.palletName),
										})
									}
									layout={EntityLayout.Title}
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
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
								networkSlug: String(selection.entitySelector.$block.$network.slug),
								blockNumber: String(selection.entitySelector.$block.blockNumber),
								hash: String(selection.entitySelector.$block.hash),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
