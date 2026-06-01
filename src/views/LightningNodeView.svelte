<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const node = useEntity(
		EntityType.LightningNode,
		entityId,
		{
			$: [
				Source.LightningMempoolSpace_Rest,
				Source.LightningLnd_Rest,
			],
			alias: {},
			capacitySats: {},
			channelCount: {},
			countryCode: {},
			city: {},
			...open && {
				networkAddresses: {},
			},
		},
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
	href={`/network/${entityId.$network.networkSlug}/nodes/${entityId.publicKey}`}
	title={entityId.publicKey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={node}
		>
			{#snippet children(row)}
				{lightningNode.alias ?? entityId.publicKey}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={node}
			placeholderText="Loading node…"
		>
			{#snippet children(row)}
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

					{#if lightningNode.channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd><NumberValue value={lightningNode.channelCount} /></dd>
						</div>
					{/if}

					{#if lightningNode.capacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{lightningNode.capacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if lightningNode.countryCode != null}
						<div>
							<dt>Country</dt>
							<dd>{lightningNode.countryCode}</dd>
						</div>
					{/if}

					{#if lightningNode.city != null}
						<div>
							<dt>City</dt>
							<dd>{lightningNode.city}</dd>
						</div>
					{/if}

					{#each open ? lightningNode.networkAddresses : [] as address}
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
