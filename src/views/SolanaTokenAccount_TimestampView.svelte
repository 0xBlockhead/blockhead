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
			selection: RegisteredEntityProxyResource<EntityType.SolanaTokenAccount_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SolanaTokenAccount_Timestamp>>
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
	const solanaTokenAccountTimestamp = $derived(selection({
		fields: {
			amount: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.slot) ?? '')].filter(Boolean).join(' ') || 'solana token account timestamp')
	const viewDomId = $derived('solana-token-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaTokenAccountTimestamp}>
			{#snippet Pending()}
				{@const slot0 = pendingEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const slot0 = resolvedEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<NumberValue value={Number(slot0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenAccountTimestamp}>
			{#snippet Pending()}
				{@const amount0 = pendingEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amount0 = resolvedEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenAccountTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Token account</dt>
				<dd>
					<SolanaTokenAccountView
						selection={select(EntityType.SolanaTokenAccount, selection.entitySelector.$tokenAccount, {})}
						href={
							(selection.entitySelector.$tokenAccount.tokenAccountPubkey !== undefined && selection.entitySelector.$tokenAccount.$network !== undefined && selection.entitySelector.$tokenAccount.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
								tokenAccountPubkey: String(selection.entitySelector.$tokenAccount.tokenAccountPubkey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$tokenAccount.$network.caip2) ?? ''),
							}) : selection.entitySelector.$tokenAccount.tokenAccountPubkey !== undefined && selection.entitySelector.$tokenAccount.$network !== undefined && selection.entitySelector.$tokenAccount.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-account/[tokenAccountPubkey=stringSegment]', {
								tokenAccountPubkey: String(selection.entitySelector.$tokenAccount.tokenAccountPubkey ?? ''),
								network: String(selection.entitySelector.$tokenAccount.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							decimals: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const decimals = pendingEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const decimals = resolvedEntity.decimals}
					{#if decimals !== undefined && decimals !== null}
						<div>
							<dt>Decimals</dt>
							<dd>
								{String((decimals) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uiAmountString: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uiAmountString = pendingEntity.uiAmountString}
					{#if uiAmountString !== undefined && uiAmountString !== null}
						<div>
							<dt>UI amount</dt>
							<dd>
								{String((uiAmountString) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uiAmountString = resolvedEntity.uiAmountString}
					{#if uiAmountString !== undefined && uiAmountString !== null}
						<div>
							<dt>UI amount</dt>
							<dd>
								{String((uiAmountString) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							state: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const state = pendingEntity.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>State</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const state = resolvedEntity.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>State</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isNative: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isNative = pendingEntity.isNative}
					{#if isNative !== undefined && isNative !== null}
						<div>
							<dt>Native</dt>
							<dd>
								{isNative ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isNative = resolvedEntity.isNative}
					{#if isNative !== undefined && isNative !== null}
						<div>
							<dt>Native</dt>
							<dd>
								{isNative ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatedAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegatedAmount = pendingEntity.delegatedAmount}
					{#if delegatedAmount !== undefined && delegatedAmount !== null}
						<div>
							<dt>Delegated amount</dt>
							<dd>
								{String((delegatedAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatedAmount = resolvedEntity.delegatedAmount}
					{#if delegatedAmount !== undefined && delegatedAmount !== null}
						<div>
							<dt>Delegated amount</dt>
							<dd>
								{String((delegatedAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rentExemptReserveLamports: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rentExemptReserveLamports = pendingEntity.rentExemptReserveLamports}
					{#if rentExemptReserveLamports !== undefined && rentExemptReserveLamports !== null}
						<div>
							<dt>Rent exempt reserve</dt>
							<dd>
								{String((rentExemptReserveLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rentExemptReserveLamports = resolvedEntity.rentExemptReserveLamports}
					{#if rentExemptReserveLamports !== undefined && rentExemptReserveLamports !== null}
						<div>
							<dt>Rent exempt reserve</dt>
							<dd>
								{String((rentExemptReserveLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ownerPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ownerPubkey = pendingEntity.ownerPubkey}
					{#if ownerPubkey !== undefined && ownerPubkey !== null}
						<div>
							<dt>Owner public key</dt>
							<dd>
								{String((ownerPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ownerPubkey = resolvedEntity.ownerPubkey}
					{#if ownerPubkey !== undefined && ownerPubkey !== null}
						<div>
							<dt>Owner public key</dt>
							<dd>
								{String((ownerPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mintAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mintAddress = pendingEntity.mintAddress}
					{#if mintAddress !== undefined && mintAddress !== null}
						<div>
							<dt>Mint address</dt>
							<dd>
								<TruncatedValue value={String((mintAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mintAddress = resolvedEntity.mintAddress}
					{#if mintAddress !== undefined && mintAddress !== null}
						<div>
							<dt>Mint address</dt>
							<dd>
								<TruncatedValue value={String((mintAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatePubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const delegatePubkey = pendingEntity.delegatePubkey}
					{#if delegatePubkey !== undefined && delegatePubkey !== null}
						<div>
							<dt>Delegate public key</dt>
							<dd>
								{String((delegatePubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatePubkey = resolvedEntity.delegatePubkey}
					{#if delegatePubkey !== undefined && delegatePubkey !== null}
						<div>
							<dt>Delegate public key</dt>
							<dd>
								{String((delegatePubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closeAuthorityPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closeAuthorityPubkey = pendingEntity.closeAuthorityPubkey}
					{#if closeAuthorityPubkey !== undefined && closeAuthorityPubkey !== null}
						<div>
							<dt>Close authority public key</dt>
							<dd>
								{String((closeAuthorityPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closeAuthorityPubkey = resolvedEntity.closeAuthorityPubkey}
					{#if closeAuthorityPubkey !== undefined && closeAuthorityPubkey !== null}
						<div>
							<dt>Close authority public key</dt>
							<dd>
								{String((closeAuthorityPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
