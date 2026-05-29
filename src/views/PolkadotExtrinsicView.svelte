<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.PolkadotExtrinsic>
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

	const polkadotExtrinsic = useEntity(
		EntityType.PolkadotExtrinsic,
		entityId,
		{
			hash: {},
			callName: {},
			success: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotExtrinsic}
	{entityId}
	title={`Polkadot Extrinsic ${entityId.extrinsicIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.extrinsicIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotExtrinsic}
			placeholderText={`Loading Polkadot Extrinsic...`}
		>
			{#snippet children(polkadotExtrinsic)}
				<dl>
					{#if polkadotExtrinsic.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={polkadotExtrinsic.hash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if polkadotExtrinsic.callName != null}
						<div>
							<dt>Call Name</dt>
							<dd>{polkadotExtrinsic.callName}</dd>
						</div>
					{/if}

					{#if polkadotExtrinsic.success != null}
						<div>
							<dt>Success</dt>
							<dd>{polkadotExtrinsic.success ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
