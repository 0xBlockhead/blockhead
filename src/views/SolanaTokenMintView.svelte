<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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

	const solanaTokenMint = $derived(selection({
		fields: {
			supply: true,
			decimals: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).mintAddress) ?? '')].filter(Boolean).join(' ') || 'solana token mint')
	const viewDomId = $derived('solana-token-mint-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTokenMint}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/token-mint/[mintAddress]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			mintAddress: String(({ ...selection.entitySelector, ...prefetched }).mintAddress),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const mintAddress0 = ({ ...selection.entitySelector, ...prefetched }).mintAddress}
			{#if mintAddress0 !== undefined && mintAddress0 !== null}
				<TruncatedValue value={String(mintAddress0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenMint}>
				{#snippet Pending()}
					{@const mintAddress0 = ({ ...selection.entitySelector, ...prefetched }).mintAddress}
					{#if mintAddress0 !== undefined && mintAddress0 !== null}
						<TruncatedValue value={String(mintAddress0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const mintAddress0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).mintAddress}
					{#if mintAddress0 !== undefined && mintAddress0 !== null}
						<TruncatedValue value={String(mintAddress0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const mintAddress0 = ({ ...selection.entitySelector, ...prefetched }).mintAddress}
			{#if mintAddress0 !== undefined && mintAddress0 !== null}
				<TruncatedValue value={String(mintAddress0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenMint}>
				{#snippet Pending()}
					{@const mintAddress0 = ({ ...selection.entitySelector, ...prefetched }).mintAddress}
					{#if mintAddress0 !== undefined && mintAddress0 !== null}
						<TruncatedValue value={String(mintAddress0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const mintAddress0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).mintAddress}
					{#if mintAddress0 !== undefined && mintAddress0 !== null}
						<TruncatedValue value={String(mintAddress0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const supply0 = prefetched.supply}
			{#if supply0 !== undefined && supply0 !== null}
				<span data-text="muted">
					{String((supply0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaTokenMint}>
				{#snippet Pending()}
					{@const supply0 = prefetched.supply}
					{#if supply0 !== undefined && supply0 !== null}
						<span data-text="muted">
							{String((supply0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const supply0 = entity.supply}
					{#if supply0 !== undefined && supply0 !== null}
						<span data-text="muted">
							{String((supply0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={solanaTokenMint}>
				{#snippet Pending()}
					{@const decimals = prefetched.decimals ?? selection.entitySelector.decimals}
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
					{@const decimals = entity.decimals ?? selection.entitySelector.decimals ?? prefetched.decimals}
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
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
