<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.PolkadotReferendum>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const polkadotReferendum = subscribe(EntityType.PolkadotReferendum,
		selector,
		({ fields: { track: true, status: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotReferendum}
	entitySelector={selector}
	title={selector.referendumId}
	idDragPlainText={selector.referendumId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selector.referendumId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Referendum </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotReferendum}
			placeholderText={`Loading Polkadot referendum...`}
		>
			{#snippet children(polkadotReferendum)}
				<dl>
					{#if polkadotReferendum.fields.track != null}
						<div>
							<dt>Track</dt>
							<dd>{polkadotReferendum.fields.track}</dd>
						</div>
					{/if}

					{#if polkadotReferendum.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{polkadotReferendum.fields.status}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
