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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroStealthOutput>
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
	entityType={EntityType.MoneroStealthOutput}
	entitySelector={selection.entitySelector}
	title={`Stealth output #${selection.entitySelector.outputIndex.toString()}`}
	idDragPlainText={selection.entitySelector.outputIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.outputIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Stealth output </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { publicKey: true, commitment: true } })}
			placeholderText={`Loading Monero Stealth Output...`}
		>
			{#snippet children(moneroStealthOutput)}
				<dl>
					{#if moneroStealthOutput.fields.publicKey != null}
						<div>
							<dt>Public Key</dt>
							<dd>
								<TruncatedValue
									value={moneroStealthOutput.fields.publicKey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if moneroStealthOutput.fields.commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue
									value={moneroStealthOutput.fields.commitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
