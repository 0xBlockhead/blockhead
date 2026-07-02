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
			selection: EntityProxyResource<typeof schema, EntityType.EvmRollup>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmRollup>>
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

	const evmRollup = $derived(selection({
		fields: {
			name: true,
			type: true,
			category: true,
			hostChain: true,
			$settlementNetwork: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || 'EVM rollup')
	const viewDomId = $derived('evm-rollup-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmRollup_TimestampsView from '$/views/EvmRollup_TimestampsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmRollup}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			projectId: String(({ ...selection.entitySelector, ...prefetched }).projectId),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup'}
		{:else}
			<ResourceBoundary resource={evmRollup}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? ''), String((entity.projectId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup'}
		{:else}
			<ResourceBoundary resource={evmRollup}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).name) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).projectId) ?? '')].filter(Boolean).join(' ') || title || 'EVM rollup'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? ''), String((entity.projectId) ?? '')].filter(Boolean).join(' ') || [String((entity.name) ?? ''), String((entity.projectId) ?? '')].filter(Boolean).join(' ') || titleFallback}
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
			<ResourceBoundary resource={evmRollup}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={evmRollup}>
				{#snippet Pending()}
					{@const type = prefetched.type ?? selection.entitySelector.type}
					{#if type !== undefined && type !== null}
						<div>
							<dt>Type</dt>
							<dd>
								{String((type) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const type = entity.type ?? selection.entitySelector.type ?? prefetched.type}
					{#if type !== undefined && type !== null}
						<div>
							<dt>Type</dt>
							<dd>
								{String((type) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmRollup}>
				{#snippet Pending()}
					{@const category = prefetched.category ?? selection.entitySelector.category}
					{#if category !== undefined && category !== null}
						<div>
							<dt>Category</dt>
							<dd>
								{String((category) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const category = entity.category ?? selection.entitySelector.category ?? prefetched.category}
					{#if category !== undefined && category !== null}
						<div>
							<dt>Category</dt>
							<dd>
								{String((category) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmRollup}>
				{#snippet Pending()}
					{@const hostChain = prefetched.hostChain ?? selection.entitySelector.hostChain}
					{#if hostChain !== undefined && hostChain !== null}
						<div>
							<dt>Host chain</dt>
							<dd>
								{String((hostChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const hostChain = entity.hostChain ?? selection.entitySelector.hostChain ?? prefetched.hostChain}
					{#if hostChain !== undefined && hostChain !== null}
						<div>
							<dt>Host chain</dt>
							<dd>
								{String((hostChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$settlementNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null}
						<div>
							<dt>Settlement network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork.entitySelector)}
									prefetched={evmNetwork}
									href={
										(evmNetwork.entitySelector?.caip2 != null && evmNetwork.entitySelector?.caip2?.namespace != null && evmNetwork.entitySelector?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(evmNetwork.entitySelector.caip2.namespace)}:${String(evmNetwork.entitySelector.caip2.reference)}`,
										}) : evmNetwork.entitySelector?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
											networkSlug: String(evmNetwork.entitySelector.slug),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EvmRollup_TimestampsView
				selection={selection[EntityProxyField]<EntityType.EvmRollup_Timestamp>('$$timestamps')}
				title='Timestamps'
				emptyText='No rollup observations yet.'
				id='EvmRollup_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
