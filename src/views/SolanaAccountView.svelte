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

	const solanaAccount = $derived(selection({
		fields: {
			lamports: true,
			rentEpoch: true,
			executable: true,
			dataEncoding: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).pubkey) ?? '')].filter(Boolean).join(' ') || 'solana account')
	const viewDomId = $derived('solana-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/account/[pubkey]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			pubkey: String(({ ...selection.entitySelector, ...prefetched }).pubkey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const pubkey0 = ({ ...selection.entitySelector, ...prefetched }).pubkey}
			{#if pubkey0 !== undefined && pubkey0 !== null}
				<TruncatedValue value={String(pubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaAccount}>
				{#snippet Pending()}
					{@const pubkey0 = ({ ...selection.entitySelector, ...prefetched }).pubkey}
					{#if pubkey0 !== undefined && pubkey0 !== null}
						<TruncatedValue value={String(pubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const pubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).pubkey}
					{#if pubkey0 !== undefined && pubkey0 !== null}
						<TruncatedValue value={String(pubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const pubkey0 = ({ ...selection.entitySelector, ...prefetched }).pubkey}
			{#if pubkey0 !== undefined && pubkey0 !== null}
				<TruncatedValue value={String(pubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaAccount}>
				{#snippet Pending()}
					{@const pubkey0 = ({ ...selection.entitySelector, ...prefetched }).pubkey}
					{#if pubkey0 !== undefined && pubkey0 !== null}
						<TruncatedValue value={String(pubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const pubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).pubkey}
					{#if pubkey0 !== undefined && pubkey0 !== null}
						<TruncatedValue value={String(pubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const lamports0 = prefetched.lamports}
			{#if lamports0 !== undefined && lamports0 !== null}
				<span data-text="muted">
					{String((lamports0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaAccount}>
				{#snippet Pending()}
					{@const lamports0 = prefetched.lamports}
					{#if lamports0 !== undefined && lamports0 !== null}
						<span data-text="muted">
							{String((lamports0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const lamports0 = entity.lamports}
					{#if lamports0 !== undefined && lamports0 !== null}
						<span data-text="muted">
							{String((lamports0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={solanaAccount}>
				{#snippet Pending()}
					{@const rentEpoch = prefetched.rentEpoch ?? selection.entitySelector.rentEpoch}
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
					{@const rentEpoch = entity.rentEpoch ?? selection.entitySelector.rentEpoch ?? prefetched.rentEpoch}
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

			<ResourceBoundary resource={solanaAccount}>
				{#snippet Pending()}
					{@const executable = prefetched.executable ?? selection.entitySelector.executable}
					{#if executable !== undefined && executable !== null}
						<div>
							<dt>Executable</dt>
							<dd>
								{String((executable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const executable = entity.executable ?? selection.entitySelector.executable ?? prefetched.executable}
					{#if executable !== undefined && executable !== null}
						<div>
							<dt>Executable</dt>
							<dd>
								{String((executable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaAccount}>
				{#snippet Pending()}
					{@const dataEncoding = prefetched.dataEncoding ?? selection.entitySelector.dataEncoding}
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
					{@const dataEncoding = entity.dataEncoding ?? selection.entitySelector.dataEncoding ?? prefetched.dataEncoding}
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
