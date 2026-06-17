<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.SolanaValidator>
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
	entityType={EntityType.SolanaValidator}
	entitySelector={selector}
	title={selector.votePubkey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.votePubkey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.SolanaValidator,
					selector,
					({ fields: { nodePubkey: true, activatedStakeLamports: true, commission: true, delinquent: true } }),
				)}
			placeholderText={`Loading Solana Validator...`}
		>
			{#snippet children(solanaValidator)}
				<dl>
					{#if solanaValidator.fields.nodePubkey != null}
						<div>
							<dt>Node Pubkey</dt>
							<dd>
								<TruncatedValue
									value={solanaValidator.fields.nodePubkey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if solanaValidator.fields.activatedStakeLamports != null}
						<div>
							<dt>Activated Stake Lamports</dt>
							<dd><NumberValue value={solanaValidator.fields.activatedStakeLamports} /> lamports</dd>
						</div>
					{/if}

					{#if solanaValidator.fields.commission != null}
						<div>
							<dt>Commission</dt>
							<dd><NumberValue value={solanaValidator.fields.commission} /></dd>
						</div>
					{/if}

					{#if solanaValidator.fields.delinquent != null}
						<div>
							<dt>Delinquent</dt>
							<dd>{solanaValidator.fields.delinquent ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
