<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalIpfsAccess_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalIpfsAccess_Timestamp>>
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

	const globalIpfsAccessTimestamp = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Ipfs_Rest,
		],
		fields: {
			configuredAccessEndpointCount: true,
			reachableAccessEndpointCount: true,
			sourceWindowResourceCount: true,
			localCatalogExampleCount: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived('global IPFS access timestamp')
	const viewDomId = $derived('-global-ipfs-access-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalIpfsAccess_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<GlobalIpfsAccessView
				selection={select(EntityType._GlobalIpfsAccess, selection.entitySelector.$hub)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					<GlobalIpfsAccessView
						selection={select(EntityType._GlobalIpfsAccess, selection.entitySelector.$hub)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<GlobalIpfsAccessView
						selection={select(EntityType._GlobalIpfsAccess, selection.entitySelector.$hub)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary resource={globalIpfsAccessTimestamp}>
						{#snippet Pending()}
							{@const source = prefetched.source ?? selection.entitySelector.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const source = entity.source ?? selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					{@const configuredAccessEndpointCount = prefetched.configuredAccessEndpointCount ?? selection.entitySelector.configuredAccessEndpointCount}
					{#if configuredAccessEndpointCount !== undefined && configuredAccessEndpointCount !== null}
						<div>
							<dt>Configured access endpoints</dt>
							<dd>
								<NumberValue value={Number(configuredAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const configuredAccessEndpointCount = entity.configuredAccessEndpointCount ?? selection.entitySelector.configuredAccessEndpointCount ?? prefetched.configuredAccessEndpointCount}
					{#if configuredAccessEndpointCount !== undefined && configuredAccessEndpointCount !== null}
						<div>
							<dt>Configured access endpoints</dt>
							<dd>
								<NumberValue value={Number(configuredAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					{@const reachableAccessEndpointCount = prefetched.reachableAccessEndpointCount ?? selection.entitySelector.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount !== undefined && reachableAccessEndpointCount !== null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue value={Number(reachableAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reachableAccessEndpointCount = entity.reachableAccessEndpointCount ?? selection.entitySelector.reachableAccessEndpointCount ?? prefetched.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount !== undefined && reachableAccessEndpointCount !== null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue value={Number(reachableAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					{@const sourceWindowResourceCount = prefetched.sourceWindowResourceCount ?? selection.entitySelector.sourceWindowResourceCount}
					{#if sourceWindowResourceCount !== undefined && sourceWindowResourceCount !== null}
						<div>
							<dt>Source window resources</dt>
							<dd>
								<NumberValue value={Number(sourceWindowResourceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const sourceWindowResourceCount = entity.sourceWindowResourceCount ?? selection.entitySelector.sourceWindowResourceCount ?? prefetched.sourceWindowResourceCount}
					{#if sourceWindowResourceCount !== undefined && sourceWindowResourceCount !== null}
						<div>
							<dt>Source window resources</dt>
							<dd>
								<NumberValue value={Number(sourceWindowResourceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					{@const localCatalogExampleCount = prefetched.localCatalogExampleCount ?? selection.entitySelector.localCatalogExampleCount}
					{#if localCatalogExampleCount !== undefined && localCatalogExampleCount !== null}
						<div>
							<dt>Local catalog examples</dt>
							<dd>
								<NumberValue value={Number(localCatalogExampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const localCatalogExampleCount = entity.localCatalogExampleCount ?? selection.entitySelector.localCatalogExampleCount ?? prefetched.localCatalogExampleCount}
					{#if localCatalogExampleCount !== undefined && localCatalogExampleCount !== null}
						<div>
							<dt>Local catalog examples</dt>
							<dd>
								<NumberValue value={Number(localCatalogExampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={globalIpfsAccessTimestamp}>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable ?? selection.entitySelector.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const reachable = entity.reachable ?? selection.entitySelector.reachable ?? prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{String((reachable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
