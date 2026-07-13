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
			selection: EntityProxyResource<typeof schema, EntityType.Account>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Account>>
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
	const account = $derived(selection({}))
	const titleFallback = $derived('account')
	const viewDomId = $derived('account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.Account}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={account}>
			{#snippet Pending()}
				{title || 'account'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A cross-chain account identity expressed with CAIP namespace, reference, and address fields.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>CAIP-10</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									caip10: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const caip10 = pendingEntity.caip10}
							{#if caip10 !== undefined && caip10 !== null}
								<TruncatedValue value={caip10 == null ? '' : String((`${(caip10).namespace}:${(caip10).reference}:${(caip10).accountAddress}`) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const caip10 = resolvedEntity.caip10}
							{#if caip10 !== undefined && caip10 !== null}
								<TruncatedValue value={caip10 == null ? '' : String((`${(caip10).namespace}:${(caip10).reference}:${(caip10).accountAddress}`) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
				<dt>Address</dt>
				<dd>
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
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const address = resolvedEntity.address}
							{#if address !== undefined && address !== null}
								<TruncatedValue value={String((address) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canonicalAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canonicalAddress = pendingEntity.canonicalAddress}
					{#if canonicalAddress !== undefined && canonicalAddress !== null}
						<div>
							<dt>canonical address</dt>
							<dd>
								<TruncatedValue value={String((canonicalAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canonicalAddress = resolvedEntity.canonicalAddress}
					{#if canonicalAddress !== undefined && canonicalAddress !== null}
						<div>
							<dt>canonical address</dt>
							<dd>
								<TruncatedValue value={String((canonicalAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$evmAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmAccount)}
					{#if evmAccount != null && evmAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>EVM account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
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
				resource={selection.$evmNetworkAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmNetworkAccount)}
					{#if evmNetworkAccount != null && evmNetworkAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>EVM network account</dt>
							<dd>
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, evmNetworkAccount[EntityMetaKey.Selector])}
									prefetched={evmNetworkAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
