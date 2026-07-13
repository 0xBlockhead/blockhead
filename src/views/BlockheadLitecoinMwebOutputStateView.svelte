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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLitecoinMwebOutputState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLitecoinMwebOutputState>>
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
	const blockheadLitecoinMwebOutputState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
			amountLitoshis: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.commitment) ?? '')].filter(Boolean).join(' ') || 'blockhead litecoin mweb output state')
	const viewDomId = $derived('blockhead-litecoin-mweb-output-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLitecoinMwebOutputState_TimestampsView from '$/views/BlockheadLitecoinMwebOutputState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import LitecoinMwebOutputView from '$/views/LitecoinMwebOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLitecoinMwebOutputState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLitecoinMwebOutputState}>
			{#snippet Pending()}
				{[String((pendingEntity.commitment) ?? '')].filter(Boolean).join(' ') || title || 'blockhead litecoin mweb output state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.commitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLitecoinMwebOutputState}>
			{#snippet Pending()}
				{[String((pendingEntity.walletId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.commitment) ?? '')].filter(Boolean).join(' ') || title || 'blockhead litecoin mweb output state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.walletId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.commitment) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLitecoinMwebOutputState}>
			{#snippet Pending()}
				{@const amountLitoshis0 = pendingEntity.amountLitoshis}
				{#if amountLitoshis0 !== undefined && amountLitoshis0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountLitoshis0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amountLitoshis0 = resolvedEntity.amountLitoshis}
				{#if amountLitoshis0 !== undefined && amountLitoshis0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountLitoshis0)} />
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

			<div>
				<dt>commitment</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commitment: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const commitment = pendingEntity.commitment}
							{#if commitment !== undefined && commitment !== null}
								{String((commitment) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const commitment = resolvedEntity.commitment}
							{#if commitment !== undefined && commitment !== null}
								{String((commitment) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$publicOutput}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(litecoinMwebOutput)}
					{#if litecoinMwebOutput != null && litecoinMwebOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>public output</dt>
							<dd>
								<LitecoinMwebOutputView
									selection={select(EntityType.LitecoinMwebOutput, litecoinMwebOutput[EntityMetaKey.Selector])}
									prefetched={litecoinMwebOutput}
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
						fields: {
							amountLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountLitoshis = pendingEntity.amountLitoshis}
					{#if amountLitoshis !== undefined && amountLitoshis !== null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue value={Number(amountLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountLitoshis = resolvedEntity.amountLitoshis}
					{#if amountLitoshis !== undefined && amountLitoshis !== null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue value={Number(amountLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const address = pendingEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							account: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const account = pendingEntity.account}
					{#if account !== undefined && account !== null}
						<div>
							<dt>account</dt>
							<dd>
								<TruncatedValue value={String((account) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const account = resolvedEntity.account}
					{#if account !== undefined && account !== null}
						<div>
							<dt>account</dt>
							<dd>
								<TruncatedValue value={String((account) ?? '')} />
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
							<dt>label</dt>
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
							<dt>label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadLitecoinMwebOutputState_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No Litecoin MWEB output observations.'
				id='BlockheadLitecoinMwebOutputState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
