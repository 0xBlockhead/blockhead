<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			entityId: EntityId<typeof schema, EntityType.FilecoinActor>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const filecoinActor = useEntity(entityCollectionsContext, EntityType.FilecoinActor,
		entityId,
		({ fields: { actorCodeCid: true, nonce: true, balanceAttoFil: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinActor}
	{entityId}
	title={entityId.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={filecoinActor}
			placeholderText="Loading Filecoin actor…"
		>
			{#snippet children(filecoinActor)}
				<dl>
					{#if filecoinActor.fields.actorCodeCid != null}
						<div>
							<dt>Actor Code CID</dt>
							<dd>
								<TruncatedValue
									value={filecoinActor.fields.actorCodeCid}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if filecoinActor.fields.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={filecoinActor.fields.nonce} /></dd>
						</div>
					{/if}

					{#if filecoinActor.fields.balanceAttoFil != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={filecoinActor.fields.balanceAttoFil} /> attoFIL</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
