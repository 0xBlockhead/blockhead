<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
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
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BittensorMetagraph_TimestampsView from '$/views/BittensorMetagraph_TimestampsView.svelte'
	import BittensorNeuronsView from '$/views/BittensorNeuronsView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorSubnet}
	{entityId}
	title={`Subnet #${entityId.netuid}`}
	idDragPlainText={String(entityId.netuid)}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(entityId.netuid)}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={subnet}>
			{#snippet Pending()}
				<span data-row="inline align-center gap-2 wrap">
					<span>Subnet </span>
					{#if Value}
					{@render Value()}
					{/if}
				</span>
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

				{#if open}
					<BittensorMetagraph_TimestampsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.BittensorSubnet,
							entityId,
							fieldName: '$$metagraphTimestamps',
						}}
						id={`${stringify(entityId)}:bittensor-metagraph-snapshots`}
					/>
				{/if}

				{#if open}
					<BittensorNeuronsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.BittensorSubnet,
							entityId,
							fieldName: '$$neurons',
						}}
						id={`${stringify(entityId)}:bittensor-neurons`}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
