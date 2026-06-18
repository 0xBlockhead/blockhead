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
			selector: EntitySelector<typeof schema, EntityType.PolkadotAccount>
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
	entityType={EntityType.PolkadotAccount}
	entitySelector={selector}
	title={selector.accountId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.accountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.PolkadotAccount,
					selector,
					({ fields: { nonce: true, freeBalancePlancks: true } }),
				)}
			placeholderText={`Loading Polkadot Account...`}
		>
			{#snippet children(polkadotAccount)}
				<dl>
					{#if polkadotAccount.fields.freeBalancePlancks != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={polkadotAccount.fields.freeBalancePlancks} /> plancks</dd>
						</div>
					{/if}

					{#if polkadotAccount.fields.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={polkadotAccount.fields.nonce} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
