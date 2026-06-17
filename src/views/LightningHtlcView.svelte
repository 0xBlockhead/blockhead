<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LightningHtlc>
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
</script>


<EntityView
	entityType={EntityType.LightningHtlc}
	entitySelector={selector}
	title={`HTLC #${selector.htlcIndex}`}
	idDragPlainText={String(selector.htlcIndex)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selector.htlcIndex}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>HTLC </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.LightningHtlc,
		selector,
		({ sources: [
				Source.LightningLnd_Rest,
			], fields: { direction: true, amountMsat: true, expiryHeight: true, hashLock: true, state: true } }),
	)}
			placeholderText="Loading HTLC…"
		>
			{#snippet children(row)}
				<dl>
					{#if row.fields.direction != null}
						<div>
							<dt>Direction</dt>
							<dd>{row.fields.direction}</dd>
						</div>
					{/if}

					{#if row.fields.amountMsat != null}
						<div>
							<dt>Amount</dt>
							<dd>{row.fields.amountMsat.toString()} msat</dd>
						</div>
					{/if}

					{#if row.fields.expiryHeight != null}
						<div>
							<dt>Expiry height</dt>
							<dd>{row.fields.expiryHeight.toString()}</dd>
						</div>
					{/if}

					{#if row.fields.state != null}
						<div>
							<dt>State</dt>
							<dd>{row.fields.state}</dd>
						</div>
					{/if}

					{#if row.fields.hashLock != null}
						<div>
							<dt>Hash lock</dt>
							<dd>
								<TruncatedValue
									value={row.fields.hashLock}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
