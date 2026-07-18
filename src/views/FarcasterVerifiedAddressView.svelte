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
			selection: RegisteredEntityProxyResource<EntityType.FarcasterVerifiedAddress>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.FarcasterVerifiedAddress>>
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
	const farcasterVerifiedAddress = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || 'Farcaster verified address')
	const viewDomId = $derived('farcaster-verified-address-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterVerifiedAddress}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.fid !== undefined && pendingEntity.protocol !== undefined && pendingEntity.address !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]/verified-address/[protocol=stringSegment]/[address=stringSegment]', {
			userId: String(pendingEntity.fid ?? ''),
			protocol: String(pendingEntity.protocol ?? ''),
			address: String(pendingEntity.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const address0 = pendingEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={farcasterVerifiedAddress}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address0 = resolvedEntity.address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String((address0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.protocol) ?? ''), String((pendingEntity.fid) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={farcasterVerifiedAddress}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.protocol) ?? ''), String((resolvedEntity.fid) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>User</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$user}
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser != null && farcasterUser[EntityMetaKey.Selector] != null}
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, farcasterUser[EntityMetaKey.Selector])}
									prefetched={farcasterUser}
									href={
										(farcasterUser[EntityMetaKey.Selector].fid !== undefined ? resolve('/farcaster/user/[userId=farcasterFid]', {
											userId: String(farcasterUser[EntityMetaKey.Selector].fid ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									protocol: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocol = resolvedEntity.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									address: true,
								},
							})
						}
					>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$evmAccount}
			>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$solanaAccount}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null && solanaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>Solana account</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount[EntityMetaKey.Selector])}
									prefetched={solanaAccount}
									href={
										(solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(caip2StringFromValue(solanaAccount[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : solanaAccount[EntityMetaKey.Selector].pubkey !== undefined && solanaAccount[EntityMetaKey.Selector].$network !== undefined && solanaAccount[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
											accountId: String(solanaAccount[EntityMetaKey.Selector].pubkey ?? ''),
											network: String(solanaAccount[EntityMetaKey.Selector].$network.slug ?? ''),
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
