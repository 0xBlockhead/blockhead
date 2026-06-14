<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BeaconAttestation>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const attestation = subscribe(EntityType.BeaconAttestation,
		selector,
		(
			open ?
				{
					sources: [
						Source.Beacon_Rest,
					],
					fields: {
						committeeIndex: true,
						aggregationBits: true,
					},
				}
			:
				{ fields: {} }
		),
	)


	// (Derived)
	const title = $derived(
		titleProp
		?? `Attestation ${selector.index} in slot ${selector.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconAttestation}
	entitySelector={selector}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
			data-attestation-index={String(selector.index)}
		>
			{String(selector.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Attestation </span>
		<span
			data-badge="small"
			data-attestation-index={String(selector.index)}
				>
			{String(selector.index)}
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
						{#if attestation.fields.committeeIndex !== undefined}
							<div>
								<dt>Committee index</dt>
								<dd><NumberValue value={attestation.fields.committeeIndex} /></dd>
							</div>
						{/if}

						{#if attestation.fields.aggregationBits !== undefined}
							<div>
								<dt>Aggregation bits</dt>
								<dd>
									<TruncatedValue
										value={attestation.fields.aggregationBits}
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
