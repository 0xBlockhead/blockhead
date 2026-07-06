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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalIpfsAccess>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalIpfsAccess>>
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
	const globalIpfsAccess = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived('global IPFS access')
	const viewDomId = $derived('-global-ipfs-access-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IpfsResourcesView from '$/views/IpfsResourcesView.svelte'
	import GlobalIpfsAccess_TimestampsView from '$/views/_GlobalIpfsAccess_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalIpfsAccess}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={href ?? resolve('/(explore)/(ipfs)/ipfs/access')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalIpfsAccess}>
			{#snippet Pending()}
				{title || 'global IPFS access'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalIpfsAccess}>
			{#snippet Pending()}
				{title || 'global IPFS access'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = selection.entitySelector.scope ?? prefetched.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String((scope) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<IpfsResourcesView
				selection={selection[EntityProxyField]<EntityType.IpfsResource>('$$observedResources')}
				title='Observed resources'
				emptyText='No IPFS resources yet.'
				id='IpfsResourcesView-$$observedResources'
			/>

			<GlobalIpfsAccess_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalIpfsAccess_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No IPFS access observations yet.'
				id='_GlobalIpfsAccess_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
