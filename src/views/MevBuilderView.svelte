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
			selection: EntityProxyResource<typeof schema, EntityType.MevBuilder>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MevBuilder>>
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

	const mevBuilder = $derived(selection({}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).builderPubkey) ?? '')].filter(Boolean).join(' ') || 'MEV builder')
	const viewDomId = $derived('mev-builder-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevBuilder_TimestampsView from '$/views/MevBuilder_TimestampsView.svelte'
	import MevRelay_ProposerPayloadDeliveredRowsView from '$/views/MevRelay_ProposerPayloadDeliveredRowsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			builderPubkey: String(({ ...selection.entitySelector, ...prefetched }).builderPubkey),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const builderPubkey0 = ({ ...selection.entitySelector, ...prefetched }).builderPubkey}
			{#if builderPubkey0 !== undefined && builderPubkey0 !== null}
				<TruncatedValue value={String(builderPubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={mevBuilder}>
				{#snippet Pending()}
					{@const builderPubkey0 = ({ ...selection.entitySelector, ...prefetched }).builderPubkey}
					{#if builderPubkey0 !== undefined && builderPubkey0 !== null}
						<TruncatedValue value={String(builderPubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const builderPubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).builderPubkey}
					{#if builderPubkey0 !== undefined && builderPubkey0 !== null}
						<TruncatedValue value={String(builderPubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const builderPubkey0 = ({ ...selection.entitySelector, ...prefetched }).builderPubkey}
			{#if builderPubkey0 !== undefined && builderPubkey0 !== null}
				<TruncatedValue value={String(builderPubkey0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={mevBuilder}>
				{#snippet Pending()}
					{@const builderPubkey0 = ({ ...selection.entitySelector, ...prefetched }).builderPubkey}
					{#if builderPubkey0 !== undefined && builderPubkey0 !== null}
						<TruncatedValue value={String(builderPubkey0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const builderPubkey0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).builderPubkey}
					{#if builderPubkey0 !== undefined && builderPubkey0 !== null}
						<TruncatedValue value={String(builderPubkey0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={mevBuilder}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
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
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
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
			<MevBuilder_TimestampsView
				selection={selection[EntityProxyField]<EntityType.MevBuilder_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No builder observations yet.'
				id='MevBuilder_TimestampsView-$$timestamps'
			/>

			<MevRelay_ProposerPayloadDeliveredRowsView
				selection={selection[EntityProxyField]<EntityType.MevRelay_ProposerPayloadDelivered>('$$deliveredPayloads')}
				title='Delivered payloads'
				emptyText='No delivered payloads for this builder yet.'
				id='MevRelay_ProposerPayloadDeliveredRowsView-$$deliveredPayloads'
			/>
		{/if}
	{/snippet}
</EntityView>
