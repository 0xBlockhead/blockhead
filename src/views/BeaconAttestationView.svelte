<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BeaconAttestation>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const attestation = useEntity(
		EntityType.BeaconAttestation,
		entityId,
		(
			open ?
				{
					$: [
						Source.Beacon_Rest,
					],
					committeeIndex: {},
					aggregationBits: {},
				}
			:
				{}
		),
	)


	// (Derived)
	const title = $derived(
		titleProp
		?? `Attestation ${entityId.index} in slot ${entityId.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconAttestation}
	{entityId}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
			data-attestation-index={String(entityId.index)}
		>
			{String(entityId.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Attestation </span>
		<span
			data-badge="small"
			data-attestation-index={String(entityId.index)}
				>
			{String(entityId.index)}
		</span>
		</span>
	{/snippet}

	{#snippet Content()}
		{#if open}
			<ResourceBoundary
				resource={attestation}
				placeholderText="Loading attestation…"
			>
				{#snippet children(attestation)}
					<dl data-column-item="center">
						{#if attestation.committeeIndex !== undefined}
							<div>
								<dt>Committee index</dt>
								<dd><NumberValue value={attestation.committeeIndex} /></dd>
							</div>
						{/if}

						{#if attestation.aggregationBits !== undefined}
							<div>
								<dt>Aggregation bits</dt>
								<dd>
									<TruncatedValue
										value={attestation.aggregationBits}
										format={TruncatedValueFormat.Abbr}
									/>
								</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
