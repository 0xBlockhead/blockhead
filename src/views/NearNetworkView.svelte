<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.NearNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearNetwork>>
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
	const nearNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.NearRpc_JsonRpc,
		],
		fields: {
			name: true,
			environment: true,
			namespace: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? ''), String((selection.entitySelector.slug ?? prefetched.slug) ?? '')].filter(Boolean).join(' ') || 'near network')
	const viewDomId = $derived('near-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NearNetwork_TimestampsView from '$/views/NearNetwork_TimestampsView.svelte'
	import NearBlocksView from '$/views/NearBlocksView.svelte'
	import NearValidatorsView from '$/views/NearValidatorsView.svelte'
</script>


<EntityView
	entityType={EntityType.NearNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearNetwork}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? ''), String((selection.entitySelector.slug ?? prefetched.slug) ?? '')].filter(Boolean).join(' ') || title || 'near network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.slug) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearNetwork}>
			{#snippet Pending()}
				{[String((prefetched.environment) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? ''), String((selection.entitySelector.slug ?? prefetched.slug) ?? '')].filter(Boolean).join(' ') || title || 'near network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.environment) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.slug) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearNetwork}>
			{#snippet Pending()}
				{@const namespace0 = prefetched.namespace}
				{#if namespace0 !== undefined && namespace0 !== null}
					<span data-text="muted">
						{String((namespace0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const namespace0 = resolvedEntity.namespace}
				{#if namespace0 !== undefined && namespace0 !== null}
					<span data-text="muted">
						{String((namespace0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			NEAR network catalog row with RPC endpoints, runtime observations, blocks, and validator sets from configured NEAR sources.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>RPC endpoints</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.Constants_Internal,
								],
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rpcEndpoints = prefetched.rpcEndpoints}
							{#if rpcEndpoints !== undefined && rpcEndpoints !== null}
								{(rpcEndpoints?.values ?? []).map((value) => String((value.url) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rpcEndpoints = resolvedEntity.rpcEndpoints}
							{#if rpcEndpoints !== undefined && rpcEndpoints !== null}
								{(rpcEndpoints?.values ?? []).map((value) => String((value.url) ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NearNetwork_TimestampsView
				selection={
						selection[EntityProxyField]<EntityType.NearNetwork_Timestamp>('$$timestamps', {
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Observations'
				id='NearNetwork_TimestampsView-$$timestamps'
			/>

			<NearBlocksView
				selection={
						selection[EntityProxyField]<EntityType.NearBlock>('$$blocks', {
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Blocks'
				id='NearBlocksView-$$blocks'
			/>

			<NearValidatorsView
				selection={
						selection[EntityProxyField]<EntityType.NearValidator>('$$validators', {
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Validators'
				id='NearValidatorsView-$$validators'
			/>
		{/if}
	{/snippet}
</EntityView>
