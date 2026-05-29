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
	title={entityId.publicKey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={node}
		>
			{#snippet children(row)}
				{row.alias ?? entityId.publicKey}
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

					{#if row.channelCount != null}
						<div>
							<dt>Channels</dt>
							<dd><NumberValue value={row.channelCount} /></dd>
						</div>
					{/if}

					{#if row.capacitySats != null}
						<div>
							<dt>Capacity</dt>
							<dd>{row.capacitySats.toString()} sats</dd>
						</div>
					{/if}

					{#if row.countryCode != null}
						<div>
							<dt>Country</dt>
							<dd>{row.countryCode}</dd>
						</div>
					{/if}

					{#if row.city != null}
						<div>
							<dt>City</dt>
							<dd>{row.city}</dd>
						</div>
					{/if}

					{#if open && row.networkAddresses.length > 0}
						<div>
							<dt>Addresses</dt>
							<dd>{row.networkAddresses.join(', ')}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
