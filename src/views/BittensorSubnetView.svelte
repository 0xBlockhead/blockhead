<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		selector: EntitySelector<typeof schema, EntityType.BittensorSubnet>
		layout?: EntityLayout
		open?: boolean
	} = $props()

	const subnet = $derived(proxy(EntityType.BittensorSubnet,
		selector,
		({ sources: [
				Source.Constants_Internal,
				Source.Bittensor_JsonRpc,
			], fields: { netuid: true, name: true, subnetInfoByteLength: true, dynamicInfoByteLength: true, hyperparamsByteLength: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BittensorMetagraph_TimestampsView from '$/views/BittensorMetagraph_TimestampsView.svelte'
	import BittensorNeuronsView from '$/views/BittensorNeuronsView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorSubnet}
	entitySelector={selector}
	title={`Subnet #${selector.netuid}`}
	idDragPlainText={String(selector.netuid)}
	bind:open
	{layout}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selector.netuid)}
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
				{subnet.fields.name ?? `Subnet ${subnet.fields.netuid}`}
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
						<dd><NumberValue value={subnet.fields.netuid} /></dd>
					</div>

					{#if subnet.fields.subnetInfoByteLength !== undefined}
						<div>
							<dt>Subnet info bytes</dt>
							<dd><NumberValue value={subnet.fields.subnetInfoByteLength} /></dd>
						</div>
					{/if}

					{#if subnet.fields.dynamicInfoByteLength !== undefined}
						<div>
							<dt>Dynamic info bytes</dt>
							<dd><NumberValue value={subnet.fields.dynamicInfoByteLength} /></dd>
						</div>
					{/if}

					{#if subnet.fields.hyperparamsByteLength !== undefined}
						<div>
							<dt>Hyperparams bytes</dt>
							<dd><NumberValue value={subnet.fields.hyperparamsByteLength} /></dd>
						</div>
					{/if}
				</dl>

				{#if open}
					<BittensorMetagraph_TimestampsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.BittensorSubnet,
							selector,
							fieldName: '$$metagraphTimestamps',
						}}
						id={`${stringify(selector)}:bittensor-metagraph-snapshots`}
					/>
				{/if}

				{#if open}
					<BittensorNeuronsView
						CollapsibleProps={{ canToggle: false }}
						entityFieldReference={{
							entityType: EntityType.BittensorSubnet,
							selector,
							fieldName: '$$neurons',
						}}
						id={`${stringify(selector)}:bittensor-neurons`}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
