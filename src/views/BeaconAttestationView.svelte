<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconAttestation>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const attestation = $derived(selection({
			sources: [Source.Beacon_Rest],
		},
	))

	const aggregationBits = $derived(attestation.aggregationBits)


	// (Derived)
	const title = $derived(
		titleProp
		?? `Attestation ${selection.entitySelector.index} in slot ${selection.entitySelector.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconAttestation}
	entitySelector={selection.entitySelector}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
			data-attestation-index={String(selection.entitySelector.index)}
		>
			{String(selection.entitySelector.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Attestation </span>
		<span
			data-badge="small"
			data-attestation-index={String(selection.entitySelector.index)}
				>
			{String(selection.entitySelector.index)}
		</span>
		</span>
	{/snippet}

	{#snippet Content()}
		{#if open}
			<ResourceBoundary
				resource={attestation.committeeIndex}
				placeholderText="Loading attestation…"
			>
				{#snippet children(committeeIndex)}
					<dl data-column-item="center">
						{#if committeeIndex !== undefined}
							<div>
								<dt>Committee index</dt>
								<dd><NumberValue value={committeeIndex} /></dd>
							</div>
						{/if}

						<div>
							<dt>Aggregation bits</dt>
							<dd>
								<ResourceBoundary
									resource={aggregationBits}
									placeholderText="Loading aggregation bits…"
								>
									{#snippet children(aggregationBits)}
										{#if aggregationBits !== undefined}
											<TruncatedValue
												value={aggregationBits}
												format={TruncatedValueFormat.Abbr}
											/>
										{/if}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
