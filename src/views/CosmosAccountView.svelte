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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosAccount>
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
	entityType={EntityType.CosmosAccount}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { accountNumber: true, sequence: true, balanceUatom: true } })}
			placeholderText={`Loading Cosmos Account...`}
		>
			{#snippet children(cosmosAccount)}
				<dl>
					{#if cosmosAccount.balanceUatom != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={cosmosAccount.balanceUatom} /> uatom</dd>
						</div>
					{/if}

					{#if cosmosAccount.accountNumber != null}
						<div>
							<dt>Account Number</dt>
							<dd><NumberValue value={cosmosAccount.accountNumber} /></dd>
						</div>
					{/if}

					{#if cosmosAccount.sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd><NumberValue value={cosmosAccount.sequence} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
