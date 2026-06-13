<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.PolkadotAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const polkadotAccount = subscribe(EntityType.PolkadotAccount,
		entityId,
		({ fields: { nonce: true, freeBalancePlancks: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotAccount}
	{entityId}
	title={entityId.accountId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.accountId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotAccount}
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
