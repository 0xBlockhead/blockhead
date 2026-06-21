<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMessage>
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
	entityType={EntityType.FilecoinMessage}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.cid}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.cid}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { method: true, nonce: true, valueAttoFil: true, gasLimit: true } })}
			placeholderText="Loading Filecoin message…"
		>
			{#snippet children(filecoinMessage)}
				<dl>
					{#if filecoinMessage.method != null}
						<div>
							<dt>Method</dt>
							<dd><NumberValue value={filecoinMessage.method} /></dd>
						</div>
					{/if}

					{#if filecoinMessage.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={filecoinMessage.nonce} /></dd>
						</div>
					{/if}

					{#if filecoinMessage.valueAttoFil != null}
						<div>
							<dt>Value</dt>
							<dd><NumberValue value={filecoinMessage.valueAttoFil} /> attoFIL</dd>
						</div>
					{/if}

					{#if filecoinMessage.gasLimit != null}
						<div>
							<dt>Gas Limit</dt>
							<dd><NumberValue value={filecoinMessage.gasLimit} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
