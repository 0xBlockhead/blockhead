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
			selection: RegisteredEntityProxyResource<EntityType.PolkadotAccount_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.PolkadotAccount_Timestamp>>
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
	const polkadotAccountTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			freeBalancePlancks: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || 'Polkadot account timestamp')
	const viewDomId = $derived('polkadot-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$account !== undefined && pendingEntity.$account.accountId !== undefined && pendingEntity.$account.$network !== undefined && pendingEntity.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			accountId: String(pendingEntity.$account.accountId ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$account.$network.caip2) ?? ''),
		}) : pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$account !== undefined && pendingEntity.$account.accountId !== undefined && pendingEntity.$account.$network !== undefined && pendingEntity.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			accountId: String(pendingEntity.$account.accountId ?? ''),
			network: String(pendingEntity.$account.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotAccountTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={polkadotAccountTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const nonce0 = pendingEntity.nonce}
			{#if nonce0 !== undefined && nonce0 !== null}
				<span data-text="muted">
					{String((nonce0) ?? '')}
				</span>
			{/if}
			{@const timestampMs1 = pendingEntity.timestampMs}
			{#if timestampMs1 !== undefined && timestampMs1 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs1)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotAccountTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce0 = resolvedEntity.nonce}
					{#if nonce0 !== undefined && nonce0 !== null}
						<span data-text="muted">
							{String((nonce0) ?? '')}
						</span>
					{/if}
					{@const timestampMs1 = resolvedEntity.timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs1)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							nonce: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nonce = resolvedEntity.nonce}
					{#if nonce !== undefined && nonce !== null}
						<div>
							<dt>Nonce</dt>
							<dd>
								{String((nonce) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							freeBalancePlancks: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeBalancePlancks = resolvedEntity.freeBalancePlancks}
					{#if freeBalancePlancks !== undefined && freeBalancePlancks !== null}
						<div>
							<dt>Free balance plancks</dt>
							<dd>
								{String((freeBalancePlancks) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<PolkadotAccountView
						selection={select(EntityType.PolkadotAccount, selection.entitySelector.$account, {})}
						href={
							(selection.entitySelector.$account.accountId !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$account.accountId ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$account.$network.caip2) ?? ''),
							}) : selection.entitySelector.$account.accountId !== undefined && selection.entitySelector.$account.$network !== undefined && selection.entitySelector.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
								accountId: String(selection.entitySelector.$account.accountId ?? ''),
								network: String(selection.entitySelector.$account.$network.slug ?? ''),
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
