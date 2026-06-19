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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebOutput>
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
	entityType={EntityType.LitecoinMwebOutput}
	entitySelector={selection.entitySelector}
	title={`MWEB Output #${selection.entitySelector.outputIndex.toString()}`}
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
			<span>MWEB Output </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { commitment: true, senderPubkey: true } }),
				)}
			placeholderText={`Loading Litecoin MWEB Output...`}
		>
			{#snippet children(litecoinMwebOutput)}
				<dl>
					{#if litecoinMwebOutput.fields.commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebOutput.fields.commitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if litecoinMwebOutput.fields.senderPubkey != null}
						<div>
							<dt>Sender Pubkey</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebOutput.fields.senderPubkey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
