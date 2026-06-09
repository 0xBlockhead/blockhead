<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.LightningNode>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const node = useEntity(entityCollectionsContext, EntityType.LightningNode,
		entityId,
		({ sources: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			], fields: { alias: true, capacitySats: true, channelCount: true, countryCode: true, city: true, ...(open && ({ networkAddresses: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNode}
	{entityId}
	href={
		'networkSlug' in entityId.$network ?
			`/network/${entityId.$network.networkSlug}/nodes/${entityId.publicKey}`
		:
			`/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/nodes/${entityId.publicKey}`
	}
	title={entityId.publicKey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={node}
		>
			{#snippet children(lightningNode)}
				{lightningNode.fields.alias ?? entityId.publicKey}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={node}
			placeholderText="Loading node…"
		>
			{#snippet children(lightningNode)}
				<dl>
					<div>
						<dt>Public key</dt>
						<dd>
							<TruncatedValue
								value={entityId.publicKey}
								format={TruncatedValueFormat.Abbr}
							/>
						</dd>
					</div>

					{#if lightningNode.fields.channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd><NumberValue value={lightningNode.fields.channelCount} /></dd>
						</div>
					{/if}

					{#if lightningNode.fields.capacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{lightningNode.fields.capacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningNode.fields.countryCode != null}
						<div>
							<dt>Country</dt>
							<dd>{lightningNode.fields.countryCode}</dd>
						</div>
					{/if}

					{#if lightningNode.fields.city != null}
						<div>
							<dt>City</dt>
							<dd>{lightningNode.fields.city}</dd>
						</div>
					{/if}

					{#each open ? lightningNode.fields.networkAddresses?.values ?? [] : [] as address}
						<div>
							<dt>Address</dt>
							<dd><code>{address}</code></dd>
						</div>
					{/each}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
