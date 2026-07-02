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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterVerifiedAddress>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterVerifiedAddress>>
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

	const farcasterVerifiedAddress = $derived(selection({
		fields: {
			$user: true,
			$evmAccount: true,
			$solanaAccount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).address) ?? '')].filter(Boolean).join(' ') || 'Farcaster verified address')
	const viewDomId = $derived('farcaster-verified-address-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterVerifiedAddress}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(social)/(farcaster)/farcaster/user/[userId=farcasterFid]/(user)/verified-address/[protocol]/[address]', {
			userId: String(({ ...selection.entitySelector, ...prefetched }).fid),
			protocol: String(({ ...selection.entitySelector, ...prefetched }).protocol),
			address: String(({ ...selection.entitySelector, ...prefetched }).address),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
			{#if address0 !== undefined && address0 !== null}
				<TruncatedValue value={String(address0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={farcasterVerifiedAddress}>
				{#snippet Pending()}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const address0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).address}
					{#if address0 !== undefined && address0 !== null}
						<TruncatedValue value={String(address0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).protocol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).address) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster verified address'}
		{:else}
			<ResourceBoundary resource={farcasterVerifiedAddress}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).protocol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).fid) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).address) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster verified address'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.protocol) ?? ''), String((entity.fid) ?? '')].filter(Boolean).join(' ') || [String((entity.address) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
						resource={selection[EntityProxyField]<EntityType.FarcasterUser, false>('$user')}
					>
						{#snippet children(farcasterUser)}
							<FarcasterUserView
								selection={select(EntityType.FarcasterUser, farcasterUser.entitySelector)}
								prefetched={farcasterUser}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$evmAccount')}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>EVM account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount.entitySelector)}
									prefetched={evmAccount}
									href={
										resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount.entitySelector.address),
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SolanaAccount, false>('$solanaAccount')}
			>
				{#snippet children(solanaAccount)}
					{#if solanaAccount != null}
						<div>
							<dt>Solana account</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaAccount.entitySelector)}
									prefetched={solanaAccount}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
											networkSlug: String(solanaAccount.entitySelector.$network.slug),
											pubkey: String(solanaAccount.entitySelector.pubkey),
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
		</dl>
	{/snippet}
</EntityView>
