<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BittensorSubnet> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Bittensor_JsonRpc,
		],
	}))
	const bittensorSubnet = $derived(viewSelection({
		fields: {
			name: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), String(selection.entitySelector.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BittensorMetagraph_TimestampsView from '$/views/BittensorMetagraph_TimestampsView.svelte'
	import BittensorNeuronsView from '$/views/BittensorNeuronsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorSubnet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bittensorSubnet}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), String(selection.entitySelector.netuid)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{['netuid ', String(selection.entitySelector.netuid)].filter(Boolean).join(' ') || [(prefetched.name ?? ''), String(selection.entitySelector.netuid)].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Netuid</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.netuid}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={bittensorSubnet}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							subnetInfoByteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetInfoByteLength = entity.subnetInfoByteLength}
					{#if subnetInfoByteLength != null}
						<div>
							<dt>Subnet info bytes</dt>
							<dd>
								<NumberValue
									value={subnetInfoByteLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							dynamicInfoByteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const dynamicInfoByteLength = entity.dynamicInfoByteLength}
					{#if dynamicInfoByteLength != null}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd>
								<NumberValue
									value={dynamicInfoByteLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							hyperparamsByteLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const hyperparamsByteLength = entity.hyperparamsByteLength}
					{#if hyperparamsByteLength != null}
						<div>
							<dt>Hyperparameter bytes</dt>
							<dd>
								<NumberValue
									value={hyperparamsByteLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const metagraphTimestampsResource = selection.$$metagraphTimestamps}
		<ResourceBoundary
			resource={metagraphTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BittensorMetagraph_TimestampsView
						selection={metagraphTimestampsResource}
						countResource={metagraphTimestampsResource.count}
						title='Metagraph observations'
						id='metagraph-timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const neuronsResource = selection.$$neurons}
		<ResourceBoundary
			resource={neuronsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BittensorNeuronsView
						selection={neuronsResource}
						countResource={neuronsResource.count}
						title='Neurons'
						id='neurons'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
