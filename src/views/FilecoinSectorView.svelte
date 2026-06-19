<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinSector>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinSector}
	entitySelector={selection.entitySelector}
	title={`Sector #${selection.entitySelector.sectorNumber.toString()}`}
	idDragPlainText={selection.entitySelector.sectorNumber.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.sectorNumber.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Sector </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { sealedCid: true, activationEpoch: true, expirationEpoch: true } })}
			placeholderText={`Loading Filecoin Sector...`}
		>
			{#snippet children(filecoinSector)}
				<dl>
					{#if filecoinSector.fields.sealedCid != null}
						<div>
							<dt>Sealed CID</dt>
							<dd>
								<TruncatedValue
									value={filecoinSector.fields.sealedCid}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if filecoinSector.fields.activationEpoch != null}
						<div>
							<dt>Activation Epoch</dt>
							<dd><NumberValue value={filecoinSector.fields.activationEpoch} /></dd>
						</div>
					{/if}

					{#if filecoinSector.fields.expirationEpoch != null}
						<div>
							<dt>Expiration Epoch</dt>
							<dd><NumberValue value={filecoinSector.fields.expirationEpoch} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
