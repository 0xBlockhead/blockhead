<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const polkadotAccount = useEntity(
		EntityType.PolkadotAccount,
		entityId,
		{
			nonce: {},
			freeBalancePlancks: {},
		},
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

	{#snippet Heading()}
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
					{#if polkadotAccount.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={polkadotAccount.nonce} /></dd>
						</div>
					{/if}

					{#if polkadotAccount.freeBalancePlancks != null}
						<div>
							<dt>Free Balance Plancks</dt>
							<dd><NumberValue value={polkadotAccount.freeBalancePlancks} /> plancks</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
