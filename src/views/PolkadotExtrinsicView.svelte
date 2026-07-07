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
	const titleFallback = $derived((String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') ? 'Extrinsic #' + String((selection.entitySelector.indexInBlock ?? prefetched.indexInBlock) ?? '') : '') || 'Polkadot extrinsic')
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
	idDragPlainText={String(selection.entitySelector.indexInBlock ?? prefetched.indexInBlock ?? '')}
	href={
		href ?? (pendingEntity.$block !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.caip2 !== undefined && pendingEntity.$block.$network.caip2.namespace !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.$network !== undefined && pendingEntity.$block.$network.caip2 !== undefined && pendingEntity.$block.$network.caip2.reference !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.blockNumber !== undefined && pendingEntity.$block !== undefined && pendingEntity.$block.hash !== undefined && pendingEntity.indexInBlock !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$block.$network.caip2.namespace) + ':' + String(pendingEntity.$block.$network.caip2.reference))].slug ?? ''),
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
		{@const serialValue = selection.entitySelector.indexInBlock ?? prefetched.indexInBlock}
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
				{[String((prefetched.callName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot extrinsic'}
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
				{@const success0 = prefetched.success}
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
							{@const indexInBlock = selection.entitySelector.indexInBlock ?? prefetched.indexInBlock}
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
					{@const hash = prefetched.hash}
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
					{@const callName = prefetched.callName}
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
					{@const success = prefetched.success}
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
				resource={selection[EntityProxyField]<EntityType.PolkadotAccount, false>('$signer')}
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
										(polkadotAccount[EntityMetaKey.Selector].$network !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && polkadotAccount[EntityMetaKey.Selector].$network !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotAccount[EntityMetaKey.Selector].$network.caip2.reference !== undefined && polkadotAccount[EntityMetaKey.Selector].accountId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
											networkSlug: String(networkByCaip2[String(String(polkadotAccount[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(polkadotAccount[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
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
				resource={selection[EntityProxyField]<EntityType.PolkadotPallet, false>('$pallet')}
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
										(polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && polkadotPallet[EntityMetaKey.Selector].$network !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2 !== undefined && polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference !== undefined && polkadotPallet[EntityMetaKey.Selector].palletName !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
											networkSlug: String(networkByCaip2[String(String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(polkadotPallet[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
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
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.blockNumber !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
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
