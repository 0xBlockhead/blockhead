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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashWalletState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZcashWalletState>>
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
	const blockheadZcashWalletState = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
		fields: {
			$network: true,
			unifiedAddress: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash wallet state')
	const viewDomId = $derived('blockhead-zcash-wallet-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadZcashViewingKeysView from '$/views/BlockheadZcashViewingKeysView.svelte'
	import BlockheadZcashNoteStatesView from '$/views/BlockheadZcashNoteStatesView.svelte'
	import BlockheadZcashWalletState_TimestampsView from '$/views/BlockheadZcashWalletState_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashWalletState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZcashWalletState}>
			{#snippet Pending()}
				{[String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zcash wallet state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.walletId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashWalletState}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$network}
				>
					{#snippet children(network)}
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
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$network}
				>
					{#snippet children(network)}
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
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashWalletState}>
			{#snippet Pending()}
				{@const unifiedAddress0 = pendingEntity.unifiedAddress}
				{#if unifiedAddress0 !== undefined && unifiedAddress0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((unifiedAddress0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const unifiedAddress0 = resolvedEntity.unifiedAddress}
				{#if unifiedAddress0 !== undefined && unifiedAddress0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((unifiedAddress0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = pendingEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{#if network != null && network[EntityMetaKey.Selector] != null}
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
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountIndex = pendingEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountIndex = resolvedEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
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
							unifiedAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unifiedAddress = pendingEntity.unifiedAddress}
					{#if unifiedAddress !== undefined && unifiedAddress !== null}
						<div>
							<dt>unified address</dt>
							<dd>
								<TruncatedValue value={String((unifiedAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unifiedAddress = resolvedEntity.unifiedAddress}
					{#if unifiedAddress !== undefined && unifiedAddress !== null}
						<div>
							<dt>unified address</dt>
							<dd>
								<TruncatedValue value={String((unifiedAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transparentAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transparentAddress = pendingEntity.transparentAddress}
					{#if transparentAddress !== undefined && transparentAddress !== null}
						<div>
							<dt>transparent address</dt>
							<dd>
								<TruncatedValue value={String((transparentAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transparentAddress = resolvedEntity.transparentAddress}
					{#if transparentAddress !== undefined && transparentAddress !== null}
						<div>
							<dt>transparent address</dt>
							<dd>
								<TruncatedValue value={String((transparentAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							saplingAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const saplingAddress = pendingEntity.saplingAddress}
					{#if saplingAddress !== undefined && saplingAddress !== null}
						<div>
							<dt>sapling address</dt>
							<dd>
								<TruncatedValue value={String((saplingAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const saplingAddress = resolvedEntity.saplingAddress}
					{#if saplingAddress !== undefined && saplingAddress !== null}
						<div>
							<dt>sapling address</dt>
							<dd>
								<TruncatedValue value={String((saplingAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							orchardAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const orchardAddress = pendingEntity.orchardAddress}
					{#if orchardAddress !== undefined && orchardAddress !== null}
						<div>
							<dt>orchard address</dt>
							<dd>
								<TruncatedValue value={String((orchardAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orchardAddress = resolvedEntity.orchardAddress}
					{#if orchardAddress !== undefined && orchardAddress !== null}
						<div>
							<dt>orchard address</dt>
							<dd>
								<TruncatedValue value={String((orchardAddress) ?? '')} />
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
							birthdayHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const birthdayHeight = pendingEntity.birthdayHeight}
					{#if birthdayHeight !== undefined && birthdayHeight !== null}
						<div>
							<dt>birthday height</dt>
							<dd>
								<NumberValue value={Number(birthdayHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const birthdayHeight = resolvedEntity.birthdayHeight}
					{#if birthdayHeight !== undefined && birthdayHeight !== null}
						<div>
							<dt>birthday height</dt>
							<dd>
								<NumberValue value={Number(birthdayHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-zcash-wallet-keys-notes'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'zcash-viewing-keys',
							label: 'Viewing keys',
						},
						{
							id: 'zcash-notes',
							label: 'Notes',
						},
					]
				}
				data-card
				class='network-view-collapsible-keys-notes'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Keys and notes</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionZcashViewingKeys({ id, label, open })}
					<BlockheadZcashViewingKeysView
						selection={selection.$$viewingKeys}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Zcash viewing keys.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionZcashNotes({ id, label, open })}
					<BlockheadZcashNoteStatesView
						selection={selection.$$notes}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Zcash notes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-zcash-wallet-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'zcash-wallet-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionZcashWalletTimestamps({ id, label, open })}
					<BlockheadZcashWalletState_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Zcash wallet observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
