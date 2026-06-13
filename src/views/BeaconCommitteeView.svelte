<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BeaconCommittee>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const committee = subscribe(EntityType.BeaconCommittee,
		entityId,
		(
			open ?
				{
					sources: [
						Source.Beacon_Rest,
					],
					fields: {
						validatorIndices: true,
					},
				}
			:
				{ fields: {} }
		),
	)


	// (Derived)
	const title = $derived(
		titleProp
		?? `Committee ${entityId.index} in slot ${entityId.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconCommittee}
	{entityId}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
			data-committee-index={String(entityId.index)}
		>
			{String(entityId.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Committee </span>
		<span
			data-badge="small"
			data-committee-index={String(entityId.index)}
				>
			{String(entityId.index)}
		</span>
		</span>
	{/snippet}

	{#snippet Content()}
		{#if open}
			<dl data-column-item="center">
				<div>
					<dt>Validators</dt>
					<dd>
						<ResourceBoundary
							resource={committee}
							placeholderText="Loading committee…"
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
