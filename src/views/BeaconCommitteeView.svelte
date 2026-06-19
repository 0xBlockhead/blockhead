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
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconCommittee>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	
	
	



	// (Derived)
	const title = $derived(
		titleProp
		?? `Committee ${selection.entitySelector.index} in slot ${selection.entitySelector.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconCommittee}
	entitySelector={selection.entitySelector}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
			data-committee-index={String(selection.entitySelector.index)}
		>
			{String(selection.entitySelector.index)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Committee </span>
		<span
			data-badge="small"
			data-committee-index={String(selection.entitySelector.index)}
				>
			{String(selection.entitySelector.index)}
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
							resource={selection({
										sources: [Source.Beacon_Rest],
									},
								).validatorIndices}
							placeholderText="Loading committee…"
						>
							{#snippet children(validatorIndices)}
								{#if validatorIndices !== undefined}
									<NumberValue value={validatorIndices.length} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}
</EntityView>
