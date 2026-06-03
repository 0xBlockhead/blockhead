<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.TronWitness>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const witness = useEntity(
		EntityType.TronWitness,
		entityId,
		{
			$: [
				Source.TronGrid_Rest,
			],
			url: {},
			voteCount: {},
			totalProduced: {},
			totalMissed: {},
			latestBlockHeight: {},
			active: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronWitness}
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
			resource={witness}
			placeholderText="Loading TRON witness..."
		>
			{#snippet children(witness)}
				<dl>
					{#if witness.active !== undefined}
						<div>
							<dt>Active</dt>
							<dd>{witness.active ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if witness.voteCount !== undefined}
						<div>
							<dt>Votes</dt>
							<dd><NumberValue value={witness.voteCount} /></dd>
						</div>
					{/if}

					{#if open && witness.latestBlockHeight !== undefined}
						<div>
							<dt>Latest block</dt>
							<dd><NumberValue value={witness.latestBlockHeight} /></dd>
						</div>
					{/if}

					{#if open && witness.totalProduced !== undefined}
						<div>
							<dt>Produced</dt>
							<dd><NumberValue value={witness.totalProduced} /></dd>
						</div>
					{/if}

					{#if open && witness.totalMissed !== undefined}
						<div>
							<dt>Missed</dt>
							<dd><NumberValue value={witness.totalMissed} /></dd>
						</div>
					{/if}

					{#if open && witness.url != null}
						<div>
							<dt>URL</dt>
							<dd>{witness.url}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
