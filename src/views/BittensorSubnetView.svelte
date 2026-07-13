<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorSubnet>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BittensorSubnet>>
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
	const bittensorSubnet = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Bittensor_JsonRpc,
		],
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? ''), String((pendingEntity.netuid) ?? '')].filter(Boolean).join(' ') || 'Bittensor subnet')
	const viewDomId = $derived('bittensor-subnet-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorMetagraph_TimestampsView from '$/views/BittensorMetagraph_TimestampsView.svelte'
	import BittensorNeuronsView from '$/views/BittensorNeuronsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorSubnet}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bittensorSubnet}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? ''), String((pendingEntity.netuid) ?? '')].filter(Boolean).join(' ') || title || 'Bittensor subnet'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.netuid) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bittensorSubnet}>
			{#snippet Pending()}
				{[String((pendingEntity.netuid) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? ''), String((pendingEntity.netuid) ?? '')].filter(Boolean).join(' ') || title || 'Bittensor subnet'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.netuid) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.netuid) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Netuid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									netuid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const netuid = pendingEntity.netuid}
							{#if netuid !== undefined && netuid !== null}
								<NumberValue value={Number(netuid)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const netuid = resolvedEntity.netuid}
							{#if netuid !== undefined && netuid !== null}
								<NumberValue value={Number(netuid)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetInfoByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetInfoByteLength = pendingEntity.subnetInfoByteLength}
					{#if subnetInfoByteLength !== undefined && subnetInfoByteLength !== null}
						<div>
							<dt>Subnet info bytes</dt>
							<dd>
								<NumberValue value={Number(subnetInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetInfoByteLength = resolvedEntity.subnetInfoByteLength}
					{#if subnetInfoByteLength !== undefined && subnetInfoByteLength !== null}
						<div>
							<dt>Subnet info bytes</dt>
							<dd>
								<NumberValue value={Number(subnetInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dynamicInfoByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dynamicInfoByteLength = pendingEntity.dynamicInfoByteLength}
					{#if dynamicInfoByteLength !== undefined && dynamicInfoByteLength !== null}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd>
								<NumberValue value={Number(dynamicInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dynamicInfoByteLength = resolvedEntity.dynamicInfoByteLength}
					{#if dynamicInfoByteLength !== undefined && dynamicInfoByteLength !== null}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd>
								<NumberValue value={Number(dynamicInfoByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hyperparamsByteLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hyperparamsByteLength = pendingEntity.hyperparamsByteLength}
					{#if hyperparamsByteLength !== undefined && hyperparamsByteLength !== null}
						<div>
							<dt>Hyperparameter bytes</dt>
							<dd>
								<NumberValue value={Number(hyperparamsByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hyperparamsByteLength = resolvedEntity.hyperparamsByteLength}
					{#if hyperparamsByteLength !== undefined && hyperparamsByteLength !== null}
						<div>
							<dt>Hyperparameter bytes</dt>
							<dd>
								<NumberValue value={Number(hyperparamsByteLength)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BittensorMetagraph_TimestampsView
				selection={
						selection.$$metagraphTimestamps({
							sources: [
								Source.Bittensor_JsonRpc,
							],
						})
					}
				title='Metagraph observations'
				id='BittensorMetagraph_TimestampsView-metagraph-timestamps'
			/>

			<BittensorNeuronsView
				selection={
						selection.$$neurons({
							sources: [
								Source.Bittensor_JsonRpc,
							],
						})
					}
				title='Neurons'
				id='BittensorNeuronsView-neurons'
			/>
		{/if}
	{/snippet}
</EntityView>
