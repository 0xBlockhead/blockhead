<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FilecoinMiner>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const filecoinMiner = subscribe(EntityType.FilecoinMiner,
		entityId,
		({ fields: { peerId: true, qualityAdjustedPower: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMiner}
	{entityId}
	title={entityId.minerAddress}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.minerAddress}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={filecoinMiner}
			placeholderText={`Loading Filecoin Miner...`}
		>
			{#snippet children(filecoinMiner)}
				<dl>
					{#if filecoinMiner.fields.peerId != null}
						<div>
							<dt>Peer ID</dt>
							<dd>
								<TruncatedValue
									value={filecoinMiner.fields.peerId}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if filecoinMiner.fields.qualityAdjustedPower != null}
						<div>
							<dt>Quality Adjusted Power</dt>
							<dd><NumberValue value={filecoinMiner.fields.qualityAdjustedPower} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
