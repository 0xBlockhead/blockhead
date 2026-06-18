<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.TronWitness>
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
	entityType={EntityType.TronWitness}
	entitySelector={selector}
	title={selector.address}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.TronWitness, selector, ({ sources: [
					Source.TronGrid_Rest,
				], fields: { url: true, voteCount: true, totalProduced: true, totalMissed: true, latestBlockHeight: true, active: true } }))}
			placeholderText="Loading TRON witness..."
		>
			{#snippet children(witness)}
				<dl>
					{#if witness.fields.active !== undefined}
						<div>
							<dt>Active</dt>
							<dd>{witness.fields.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if witness.fields.voteCount !== undefined}
						<div>
							<dt>Votes</dt>
							<dd><NumberValue value={witness.fields.voteCount} /></dd>
						</div>
					{/if}

					{#if open && witness.fields.latestBlockHeight !== undefined}
						<div>
							<dt>Latest block</dt>
							<dd><NumberValue value={witness.fields.latestBlockHeight} /></dd>
						</div>
					{/if}

					{#if open && witness.fields.totalProduced !== undefined}
						<div>
							<dt>Produced</dt>
							<dd><NumberValue value={witness.fields.totalProduced} /></dd>
						</div>
					{/if}

					{#if open && witness.fields.totalMissed !== undefined}
						<div>
							<dt>Missed</dt>
							<dd><NumberValue value={witness.fields.totalMissed} /></dd>
						</div>
					{/if}

					{#if open && witness.fields.url != null}
						<div>
							<dt>URL</dt>
							<dd>{witness.fields.url}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
