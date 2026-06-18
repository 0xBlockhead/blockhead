<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.SolanaTokenMint>
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
	entityType={EntityType.SolanaTokenMint}
	entitySelector={selector}
	title={selector.mintAddress}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.mintAddress}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.SolanaTokenMint,
					selector,
					({ fields: { supply: true, decimals: true } }),
				)}
			placeholderText={`Loading Solana Token Mint...`}
		>
			{#snippet children(solanaTokenMint)}
				<dl>
					{#if solanaTokenMint.fields.supply != null}
						<div>
							<dt>Supply</dt>
							<dd><NumberValue value={solanaTokenMint.fields.supply} /></dd>
						</div>
					{/if}

					{#if solanaTokenMint.fields.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd><NumberValue value={solanaTokenMint.fields.decimals} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
