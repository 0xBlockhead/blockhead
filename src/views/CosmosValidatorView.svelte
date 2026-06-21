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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosValidator>
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
	entityType={EntityType.CosmosValidator}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.operatorAddress}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.operatorAddress}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { consensusPubkey: true, moniker: true, jailed: true, status: true, tokens: true } })}
			placeholderText={`Loading Cosmos Validator...`}
		>
			{#snippet children(cosmosValidator)}
				<dl>
					{#if cosmosValidator.consensusPubkey != null}
						<div>
							<dt>Consensus Pubkey</dt>
							<dd>
								<TruncatedValue
									value={cosmosValidator.consensusPubkey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if cosmosValidator.moniker != null}
						<div>
							<dt>Moniker</dt>
							<dd>{cosmosValidator.moniker}</dd>
						</div>
					{/if}

					{#if cosmosValidator.jailed != null}
						<div>
							<dt>Jailed</dt>
							<dd>{cosmosValidator.jailed ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if cosmosValidator.status != null}
						<div>
							<dt>Status</dt>
							<dd>{cosmosValidator.status}</dd>
						</div>
					{/if}

					{#if cosmosValidator.tokens != null}
						<div>
							<dt>Tokens</dt>
							<dd><NumberValue value={cosmosValidator.tokens} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
