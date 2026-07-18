<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.XrplTrustline>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.XrplTrustline>>
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
	const xrplTrustline = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('XRPL trustline')
	const viewDomId = $derived('xrpl-trustline-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import XrplAccountView from '$/views/XrplAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplTrustline}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.account !== undefined && pendingEntity.currency !== undefined && pendingEntity.issuer !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
			account: String(pendingEntity.account ?? ''),
			currency: String(pendingEntity.currency ?? ''),
			issuer: String(pendingEntity.issuer ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.account !== undefined && pendingEntity.currency !== undefined && pendingEntity.issuer !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
			account: String(pendingEntity.account ?? ''),
			currency: String(pendingEntity.currency ?? ''),
			issuer: String(pendingEntity.issuer ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={xrplTrustline}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									account: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const account = resolvedEntity.account}
							{#if account !== undefined && account !== null}
								<TruncatedValue value={String((account) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>currency</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									currency: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const currency = resolvedEntity.currency}
							{#if currency !== undefined && currency !== null}
								{String((currency) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>issuer</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									issuer: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const issuer = resolvedEntity.issuer}
							{#if issuer !== undefined && issuer !== null}
								<TruncatedValue value={String((issuer) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(xrplAccount)}
					{#if xrplAccount != null && xrplAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<XrplAccountView
									selection={select(EntityType.XrplAccount, xrplAccount[EntityMetaKey.Selector])}
									prefetched={xrplAccount}
									href={
										(xrplAccount[EntityMetaKey.Selector].account !== undefined && xrplAccount[EntityMetaKey.Selector].$network !== undefined && xrplAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
											network: String(caip2StringFromValue(xrplAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : xrplAccount[EntityMetaKey.Selector].account !== undefined && xrplAccount[EntityMetaKey.Selector].$network !== undefined && xrplAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
											network: String(xrplAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
				resource={selection.$issuerAccount}
			>
				{#snippet children(xrplAccount)}
					{#if xrplAccount != null && xrplAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>issuer account</dt>
							<dd>
								<XrplAccountView
									selection={select(EntityType.XrplAccount, xrplAccount[EntityMetaKey.Selector])}
									prefetched={xrplAccount}
									href={
										(xrplAccount[EntityMetaKey.Selector].account !== undefined && xrplAccount[EntityMetaKey.Selector].$network !== undefined && xrplAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
											network: String(caip2StringFromValue(xrplAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : xrplAccount[EntityMetaKey.Selector].account !== undefined && xrplAccount[EntityMetaKey.Selector].$network !== undefined && xrplAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
											network: String(xrplAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
		</dl>
	{/snippet}
</EntityView>
