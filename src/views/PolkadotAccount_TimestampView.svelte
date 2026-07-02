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
	import { networkByCaip2 } from '$/constants/Network.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotAccount_Timestamp>>
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

	const polkadotAccountTimestamp = $derived(selection({
		fields: {
			freeBalancePlancks: true,
			nonce: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || 'Polkadot account timestamp')
	const viewDomId = $derived('polkadot-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import PolkadotAccountView from '$/views/PolkadotAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAccount_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]/observation/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$account.$network.caip2)].slug),
			accountId: String(({ ...selection.entitySelector, ...prefetched }).$account.accountId),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot account timestamp'}
		{:else}
			<ResourceBoundary resource={polkadotAccountTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot account timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot account timestamp'}
		{:else}
			<ResourceBoundary resource={polkadotAccountTimestamp}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot account timestamp'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.freeBalancePlancks) ?? '')].filter(Boolean).join(' ') || [String((entity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const nonce0 = prefetched.nonce}
			{#if nonce0 !== undefined && nonce0 !== null}
				<span data-text="muted">
					{String((nonce0) ?? '')}
				</span>
			{/if}
			{@const timestampMs1 = prefetched.timestampMs}
			{#if timestampMs1 !== undefined && timestampMs1 !== null}
				<span data-text="muted">
					{String((timestampMs1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotAccountTimestamp}>
				{#snippet Pending()}
					{@const nonce0 = prefetched.nonce}
					{#if nonce0 !== undefined && nonce0 !== null}
						<span data-text="muted">
							{String((nonce0) ?? '')}
						</span>
					{/if}
					{@const timestampMs1 = prefetched.timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<span data-text="muted">
							{String((timestampMs1) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const nonce0 = entity.nonce}
					{#if nonce0 !== undefined && nonce0 !== null}
						<span data-text="muted">
							{String((nonce0) ?? '')}
						</span>
					{/if}
					{@const timestampMs1 = entity.timestampMs}
					{#if timestampMs1 !== undefined && timestampMs1 !== null}
						<span data-text="muted">
							{String((timestampMs1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<PolkadotAccountView
						selection={select(EntityType.PolkadotAccount, selection.entitySelector.$account)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
								networkSlug: String(selection.entitySelector.$account.$network.slug),
								accountId: String(selection.entitySelector.$account.accountId),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
