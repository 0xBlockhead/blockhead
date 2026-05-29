<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		entityId: EntityId<typeof schema, EntityType.BittensorSubnet>
		layout?: EntityLayout
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const subnet = useEntity(
		EntityType.BittensorSubnet,
		entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Bittensor_JsonRpc,
			],
			netuid: {},
			name: {},
			subnetInfoByteLength: {},
			dynamicInfoByteLength: {},
			hyperparamsByteLength: {},
			$$metagraphTimestamps: {
				$limit: 1,
			},
			...open && {
				$$neurons: {
					$limit: 8,
				},
			},
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BittensorMetagraph_TimestampView from '$/views/BittensorMetagraph_TimestampView.svelte'
	import BittensorNeuronView from '$/views/BittensorNeuronView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorSubnet}
	{entityId}
	bind:open
	{layout}
>
	{#snippet Title()}
		<ResourceBoundary resource={subnet}>
			{#snippet Pending()}
				Subnet {entityId.netuid}
			{/snippet}

			{#snippet children(subnet)}
				{subnet.name ?? `Subnet ${subnet.netuid}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={subnet}
			placeholderText="Loading Bittensor subnet…"
		>
			{#snippet children(subnet)}
				<dl>
					<div>
						<dt>Netuid</dt>
						<dd><NumberValue value={subnet.netuid} /></dd>
					</div>

					{#if subnet.subnetInfoByteLength !== undefined}
						<div>
							<dt>Subnet info bytes</dt>
							<dd><NumberValue value={subnet.subnetInfoByteLength} /></dd>
						</div>
					{/if}

					{#if subnet.dynamicInfoByteLength !== undefined}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd><NumberValue value={subnet.dynamicInfoByteLength} /></dd>
						</div>
					{/if}

					{#if subnet.hyperparamsByteLength !== undefined}
						<div>
							<dt>Hyperparams bytes</dt>
							<dd><NumberValue value={subnet.hyperparamsByteLength} /></dd>
						</div>
					{/if}
				</dl>

				{#if open && subnet.$$metagraphTimestamps.length > 0}
					<section>
						<h3>Metagraph</h3>

						<ul>
							{#each subnet.$$metagraphTimestamps as metagraph (stringify(metagraph[EntityMetaKey.Id]))}
								<li>
									<BittensorMetagraph_TimestampView
										entityId={metagraph[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryInline}
									/>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if open && subnet.$$neurons?.length > 0}
					<EntitiesList
						collapsible={false}
						entityType={EntityType.BittensorNeuron}
						getKey={(neuronLine) => stringify(neuronLine.value[EntityMetaKey.Id])}
						id={`${stringify(entityId)}:bittensor-neurons`}
						items={subnet.$$neurons.map((value) => ({ value }))}
						open={true}
						showSummary={false}
						title="Neurons"
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Item({ item: neuronLine })}
							<BittensorNeuronView
								entityId={neuronLine.value[EntityMetaKey.Id]}
								layout={EntityLayout.SummaryInline}
							/>
						{/snippet}
					</EntitiesList>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
