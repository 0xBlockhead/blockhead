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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaAccount>>
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
	const solanaAccount = $derived(selection({
		fields: {
			lamports: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account')
	const viewDomId = $derived('solana-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaAccount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.pubkey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
			network: String(pendingEntity.$network.slug ?? ''),
			accountId: String(pendingEntity.pubkey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaAccount}>
			{#snippet Pending()}
				{@const pubkey0 = pendingEntity.pubkey}
				{#if pubkey0 !== undefined && pubkey0 !== null}
					<TruncatedValue value={String((pubkey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const pubkey0 = resolvedEntity.pubkey}
				{#if pubkey0 !== undefined && pubkey0 !== null}
					<TruncatedValue value={String((pubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaAccount}>
			{#snippet Pending()}
				{@const pubkey0 = pendingEntity.pubkey}
				{#if pubkey0 !== undefined && pubkey0 !== null}
					<TruncatedValue value={String((pubkey0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const pubkey0 = resolvedEntity.pubkey}
				{#if pubkey0 !== undefined && pubkey0 !== null}
					<TruncatedValue value={String((pubkey0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaAccount}>
			{#snippet Pending()}
				{@const lamports0 = pendingEntity.lamports}
				{#if lamports0 !== undefined && lamports0 !== null}
					<span data-text="muted">
						{String((lamports0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const lamports0 = resolvedEntity.lamports}
				{#if lamports0 !== undefined && lamports0 !== null}
					<span data-text="muted">
						{String((lamports0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pubkey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pubkey = pendingEntity.pubkey}
							{#if pubkey !== undefined && pubkey !== null}
								<TruncatedValue value={String((pubkey) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pubkey = resolvedEntity.pubkey}
							{#if pubkey !== undefined && pubkey !== null}
								<TruncatedValue value={String((pubkey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lamports: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lamports = pendingEntity.lamports}
					{#if lamports !== undefined && lamports !== null}
						<div>
							<dt>Lamports</dt>
							<dd>
								{String((lamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lamports = resolvedEntity.lamports}
					{#if lamports !== undefined && lamports !== null}
						<div>
							<dt>Lamports</dt>
							<dd>
								{String((lamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rentEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rentEpoch = pendingEntity.rentEpoch}
					{#if rentEpoch !== undefined && rentEpoch !== null}
						<div>
							<dt>Rent epoch</dt>
							<dd>
								{String((rentEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rentEpoch = resolvedEntity.rentEpoch}
					{#if rentEpoch !== undefined && rentEpoch !== null}
						<div>
							<dt>Rent epoch</dt>
							<dd>
								{String((rentEpoch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							executable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const executable = pendingEntity.executable}
					{#if executable !== undefined && executable !== null}
						<div>
							<dt>Executable</dt>
							<dd>
								{executable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const executable = resolvedEntity.executable}
					{#if executable !== undefined && executable !== null}
						<div>
							<dt>Executable</dt>
							<dd>
								{executable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataEncoding: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataEncoding = pendingEntity.dataEncoding}
					{#if dataEncoding !== undefined && dataEncoding !== null}
						<div>
							<dt>Data encoding</dt>
							<dd>
								{String((dataEncoding) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataEncoding = resolvedEntity.dataEncoding}
					{#if dataEncoding !== undefined && dataEncoding !== null}
						<div>
							<dt>Data encoding</dt>
							<dd>
								{String((dataEncoding) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
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
		</dl>
	{/snippet}
</EntityView>
