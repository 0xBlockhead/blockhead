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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenMint>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaTokenMint>>
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
	const solanaTokenMint = $derived(selection({
		fields: {
			supply: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.mintAddress) ?? '')].filter(Boolean).join(' ') || 'solana token mint')
	const viewDomId = $derived('solana-token-mint-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenMint}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.mintAddress !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/token-mint/[mintAddress=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			mintAddress: String(pendingEntity.mintAddress ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={solanaTokenMint}>
			{#snippet Pending()}
				{@const mintAddress0 = pendingEntity.mintAddress}
				{#if mintAddress0 !== undefined && mintAddress0 !== null}
					<TruncatedValue value={String((mintAddress0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const mintAddress0 = resolvedEntity.mintAddress}
				{#if mintAddress0 !== undefined && mintAddress0 !== null}
					<TruncatedValue value={String((mintAddress0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTokenMint}>
			{#snippet Pending()}
				{@const mintAddress0 = pendingEntity.mintAddress}
				{#if mintAddress0 !== undefined && mintAddress0 !== null}
					<TruncatedValue value={String((mintAddress0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const mintAddress0 = resolvedEntity.mintAddress}
				{#if mintAddress0 !== undefined && mintAddress0 !== null}
					<TruncatedValue value={String((mintAddress0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTokenMint}>
			{#snippet Pending()}
				{@const supply0 = pendingEntity.supply}
				{#if supply0 !== undefined && supply0 !== null}
					<span data-text="muted">
						{String((supply0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const supply0 = resolvedEntity.supply}
				{#if supply0 !== undefined && supply0 !== null}
					<span data-text="muted">
						{String((supply0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Mint address</dt>
				<dd>
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
								<TruncatedValue value={String((mintAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const mintAddress = resolvedEntity.mintAddress}
							{#if mintAddress !== undefined && mintAddress !== null}
								<TruncatedValue value={String((mintAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							supply: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supply = pendingEntity.supply}
					{#if supply !== undefined && supply !== null}
						<div>
							<dt>Supply</dt>
							<dd>
								{String((supply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supply = resolvedEntity.supply}
					{#if supply !== undefined && supply !== null}
						<div>
							<dt>Supply</dt>
							<dd>
								{String((supply) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
