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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SolanaValidator>>
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

	const solanaValidator = $derived(selection({
		fields: {
			delinquent: true,
			nodePubkey: true,
			activatedStakeLamports: true,
			commission: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).votePubkey) ?? '')].filter(Boolean).join(' ') || 'solana validator')
	const viewDomId = $derived('solana-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaValidator}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/validator/[votePubkey]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			votePubkey: String(({ ...selection.entitySelector, ...prefetched }).votePubkey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const votePubkey0 = ({ ...selection.entitySelector, ...prefetched }).votePubkey}
			{#if votePubkey0 !== undefined && votePubkey0 !== null}
				<TruncatedValue value={String(votePubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaValidator}>
				{#snippet Pending()}
					{@const votePubkey0 = ({ ...selection.entitySelector, ...prefetched }).votePubkey}
					{#if votePubkey0 !== undefined && votePubkey0 !== null}
						<TruncatedValue value={String(votePubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const votePubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).votePubkey}
					{#if votePubkey0 !== undefined && votePubkey0 !== null}
						<TruncatedValue value={String(votePubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const votePubkey0 = ({ ...selection.entitySelector, ...prefetched }).votePubkey}
			{#if votePubkey0 !== undefined && votePubkey0 !== null}
				<TruncatedValue value={String(votePubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={solanaValidator}>
				{#snippet Pending()}
					{@const votePubkey0 = ({ ...selection.entitySelector, ...prefetched }).votePubkey}
					{#if votePubkey0 !== undefined && votePubkey0 !== null}
						<TruncatedValue value={String(votePubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const votePubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).votePubkey}
					{#if votePubkey0 !== undefined && votePubkey0 !== null}
						<TruncatedValue value={String(votePubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const delinquent0 = prefetched.delinquent}
			{#if delinquent0 !== undefined && delinquent0 !== null}
				<span data-text="muted">
					{String((delinquent0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={solanaValidator}>
				{#snippet Pending()}
					{@const delinquent0 = prefetched.delinquent}
					{#if delinquent0 !== undefined && delinquent0 !== null}
						<span data-text="muted">
							{String((delinquent0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const delinquent0 = entity.delinquent}
					{#if delinquent0 !== undefined && delinquent0 !== null}
						<span data-text="muted">
							{String((delinquent0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={solanaValidator}>
				{#snippet Pending()}
					{@const nodePubkey = prefetched.nodePubkey ?? selection.entitySelector.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>Node public key</dt>
							<dd>
								<TruncatedValue value={String(nodePubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const nodePubkey = entity.nodePubkey ?? selection.entitySelector.nodePubkey ?? prefetched.nodePubkey}
					{#if nodePubkey !== undefined && nodePubkey !== null}
						<div>
							<dt>Node public key</dt>
							<dd>
								<TruncatedValue value={String(nodePubkey)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaValidator}>
				{#snippet Pending()}
					{@const activatedStakeLamports = prefetched.activatedStakeLamports ?? selection.entitySelector.activatedStakeLamports}
					{#if activatedStakeLamports !== undefined && activatedStakeLamports !== null}
						<div>
							<dt>Activated stake</dt>
							<dd>
								{String((activatedStakeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const activatedStakeLamports = entity.activatedStakeLamports ?? selection.entitySelector.activatedStakeLamports ?? prefetched.activatedStakeLamports}
					{#if activatedStakeLamports !== undefined && activatedStakeLamports !== null}
						<div>
							<dt>Activated stake</dt>
							<dd>
								{String((activatedStakeLamports) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={solanaValidator}>
				{#snippet Pending()}
					{@const commission = prefetched.commission ?? selection.entitySelector.commission}
					{#if commission !== undefined && commission !== null}
						<div>
							<dt>Commission</dt>
							<dd>
								{String((commission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const commission = entity.commission ?? selection.entitySelector.commission ?? prefetched.commission}
					{#if commission !== undefined && commission !== null}
						<div>
							<dt>Commission</dt>
							<dd>
								{String((commission) ?? '')}
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
