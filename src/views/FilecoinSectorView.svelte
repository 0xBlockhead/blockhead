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
			entityId: EntityId<typeof schema, EntityType.FilecoinSector>
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

	const filecoinSector = useEntity(
		EntityType.FilecoinSector,
		entityId,
		{
			sealedCid: {},
			activationEpoch: {},
			expirationEpoch: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinSector}
	{entityId}
	title={`Sector #${entityId.sectorNumber.toString()}`}
	idDragPlainText={entityId.sectorNumber.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.sectorNumber.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Sector </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={filecoinSector}
			placeholderText={`Loading Filecoin Sector...`}
		>
			{#snippet children(filecoinSector)}
				<dl>
					{#if filecoinSector.sealedCid != null}
						<div>
							<dt>Sealed CID</dt>
							<dd>
								<TruncatedValue
									value={filecoinSector.sealedCid}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if filecoinSector.activationEpoch != null}
						<div>
							<dt>Activation Epoch</dt>
							<dd><NumberValue value={filecoinSector.activationEpoch} /></dd>
						</div>
					{/if}

					{#if filecoinSector.expirationEpoch != null}
						<div>
							<dt>Expiration Epoch</dt>
							<dd><NumberValue value={filecoinSector.expirationEpoch} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
