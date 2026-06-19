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
					{#if cosmosAccount.fields.balanceUatom != null}
						<div>
							<dt>Balance</dt>
							<dd><NumberValue value={cosmosAccount.fields.balanceUatom} /> uatom</dd>
						</div>
					{/if}

					{#if cosmosAccount.fields.accountNumber != null}
						<div>
							<dt>Account Number</dt>
							<dd><NumberValue value={cosmosAccount.fields.accountNumber} /></dd>
						</div>
					{/if}

					{#if cosmosAccount.fields.sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd><NumberValue value={cosmosAccount.fields.sequence} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
