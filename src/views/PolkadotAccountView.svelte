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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotAccount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotAccount>>
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

	const polkadotAccount = $derived(selection({}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).accountId) ?? '')].filter(Boolean).join(' ') || 'Polkadot account')
	const viewDomId = $derived('polkadot-account-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotAccount_TimestampsView from '$/views/PolkadotAccount_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			accountId: String(({ ...selection.entitySelector, ...prefetched }).accountId),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const accountId0 = ({ ...selection.entitySelector, ...prefetched }).accountId}
			{#if accountId0 !== undefined && accountId0 !== null}
				<TruncatedValue value={String(accountId0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotAccount}>
				{#snippet Pending()}
					{@const accountId0 = ({ ...selection.entitySelector, ...prefetched }).accountId}
					{#if accountId0 !== undefined && accountId0 !== null}
						<TruncatedValue value={String(accountId0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const accountId0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).accountId}
					{#if accountId0 !== undefined && accountId0 !== null}
						<TruncatedValue value={String(accountId0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const accountId0 = ({ ...selection.entitySelector, ...prefetched }).accountId}
			{#if accountId0 !== undefined && accountId0 !== null}
				<TruncatedValue value={String(accountId0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotAccount}>
				{#snippet Pending()}
					{@const accountId0 = ({ ...selection.entitySelector, ...prefetched }).accountId}
					{#if accountId0 !== undefined && accountId0 !== null}
						<TruncatedValue value={String(accountId0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const accountId0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).accountId}
					{#if accountId0 !== undefined && accountId0 !== null}
						<TruncatedValue value={String(accountId0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
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
			</span>
		{:else}
			<ResourceBoundary resource={polkadotAccount}>
				{#snippet Pending()}
					<span data-text="muted">
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
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
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
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<PolkadotAccount_TimestampsView
				selection={selection[EntityProxyField]<EntityType.PolkadotAccount_Timestamp>('$$timestamps')}
				title='Account snapshots'
				emptyText='No Polkadot account snapshots.'
				id='PolkadotAccount_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
