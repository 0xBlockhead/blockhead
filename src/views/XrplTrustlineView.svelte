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
			selection: RegisteredEntityProxyResource<EntityType.XrplTrustline>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.XrplTrustline>
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
	const xrplTrustline = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'XRPL trustline'
	const viewDomId = $derived('xrpl-trustline-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'account' in selection.entitySelector
			&& selection.entitySelector.account != null
			&& selection.entitySelector != null && 'currency' in selection.entitySelector
			&& selection.entitySelector.currency != null
			&& selection.entitySelector != null && 'issuer' in selection.entitySelector
			&& selection.entitySelector.issuer != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
				account: String(selection.entitySelector.account ?? ''),
				currency: String(selection.entitySelector.currency ?? ''),
				issuer: String(selection.entitySelector.issuer ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
					account: String(selection.entitySelector.account ?? ''),
					currency: String(selection.entitySelector.currency ?? ''),
					issuer: String(selection.entitySelector.issuer ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={xrplTrustline}>
				{#snippet children(entity)}
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
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
										(
											xrplAccount[EntityMetaKey.Selector] != null && 'account' in xrplAccount[EntityMetaKey.Selector]
											&& xrplAccount[EntityMetaKey.Selector].account != null
											&& xrplAccount[EntityMetaKey.Selector] != null && '$network' in xrplAccount[EntityMetaKey.Selector] ?
												xrplAccount[EntityMetaKey.Selector].$network != null && 'caip2' in xrplAccount[EntityMetaKey.Selector].$network
												&& xrplAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
												network: String(caip2StringFromValue(xrplAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													xrplAccount[EntityMetaKey.Selector].$network != null && 'slug' in xrplAccount[EntityMetaKey.Selector].$network
													&& xrplAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
													network: String(xrplAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
										(
											xrplAccount[EntityMetaKey.Selector] != null && 'account' in xrplAccount[EntityMetaKey.Selector]
											&& xrplAccount[EntityMetaKey.Selector].account != null
											&& xrplAccount[EntityMetaKey.Selector] != null && '$network' in xrplAccount[EntityMetaKey.Selector] ?
												xrplAccount[EntityMetaKey.Selector].$network != null && 'caip2' in xrplAccount[EntityMetaKey.Selector].$network
												&& xrplAccount[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
												accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
												network: String(caip2StringFromValue(xrplAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													xrplAccount[EntityMetaKey.Selector].$network != null && 'slug' in xrplAccount[EntityMetaKey.Selector].$network
													&& xrplAccount[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
													accountId: String(xrplAccount[EntityMetaKey.Selector].account ?? ''),
													network: String(xrplAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
	{/snippet}
</EntityView>
