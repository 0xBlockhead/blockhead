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
			selector: EntitySelector<typeof schema, EntityType.BeaconSyncCommittee>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const committee = subscribe(EntityType.BeaconSyncCommittee,
		selector,
		{
			sources: [
				Source.Beacon_Rest,
			],
			fields: {
				validatorIndices: true,
			},
		},
	)


	// (Derived)
	const title = $derived(
		titleProp
		?? `Sync committee period ${selector.period.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSyncCommittee}
	entitySelector={selector}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.period}
		</span>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content()}
		{#if open}
			<dl data-column-item="center">
				<div>
					<dt>Validators</dt>
					<dd>
						<ResourceBoundary
							resource={committee}
							placeholderText="Loading sync committee…"
						>
							{#snippet children(committee)}
								{#if committee.fields.validatorIndices !== undefined}
									<NumberValue value={committee.fields.validatorIndices.length} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}
</EntityView>
