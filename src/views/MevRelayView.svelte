<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.MevRelay>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MevRelay>>
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
	const mevRelay = $derived(selection({}))
	const titleFallback = $derived([String((selection.entitySelector.host ?? prefetched.host) ?? '')].filter(Boolean).join(' ') || 'MEV relay')
	const viewDomId = $derived('mev-relay-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevRelay_TimestampsView from '$/views/MevRelay_TimestampsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.host !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/relay/[host]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			host: String(pendingEntity.host ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mevRelay}>
			{#snippet Pending()}
				{[String((selection.entitySelector.host ?? prefetched.host) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.host) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mevRelay}>
			{#snippet Pending()}
				{[String((selection.entitySelector.host ?? prefetched.host) ?? '')].filter(Boolean).join(' ') || title || 'MEV relay'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.host) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={mevRelay}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Host</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									host: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const host = selection.entitySelector.host ?? prefetched.host}
							{#if host !== undefined && host !== null}
								{String((host) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const host = resolvedEntity.host}
							{#if host !== undefined && host !== null}
								{String((host) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									url: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const url = prefetched.url}
							{#if url !== undefined && url !== null}
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const url = resolvedEntity.url}
							{#if url !== undefined && url !== null}
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<MevRelay_TimestampsView
				selection={
						selection[EntityProxyField]<EntityType.MevRelay_Timestamp>('$$timestamps', {
							sources: [
								Source.MevRelay_Rest,
							],
						})
					}
				title='Timestamps'
				emptyText='No relay observations yet.'
				id='MevRelay_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
