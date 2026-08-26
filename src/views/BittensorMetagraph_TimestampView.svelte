<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BittensorMetagraph_Timestamp>, 'prefetched'> = $props()

	const bittensorMetagraphTimestamp = $derived(selection({
		fields: {
			metagraphByteLength: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BittensorSubnetView from '$/views/BittensorSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorMetagraph_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bittensorMetagraphTimestamp}>
			{#snippet children(entity)}
				{@const metagraphByteLength = entity.metagraphByteLength}
				{#if metagraphByteLength != null}
					<NumberValue
						value={metagraphByteLength}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Subnet</dt>
				<dd>
					<BittensorSubnetView
						selection={select(EntityType.BittensorSubnet, selection.entitySelector.$subnet)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={bittensorMetagraphTimestamp}
			>
				{#snippet children(entity)}
					{@const metagraphByteLength = entity.metagraphByteLength}
					{#if metagraphByteLength != null}
						<div>
							<dt>Metagraph bytes</dt>
							<dd>
								<NumberValue
									value={metagraphByteLength}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							neuronCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const neuronCount = entity.neuronCount}
					{#if neuronCount != null}
						<div>
							<dt>Neurons</dt>
							<dd>
								<NumberValue
									value={neuronCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
