<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.CosmosValidator>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const cosmosValidator = useEntity(entityCollectionsContext, EntityType.CosmosValidator,
		entityId,
		({ fields: { consensusPubkey: true, moniker: true, jailed: true, status: true, tokens: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosValidator}
	{entityId}
	title={entityId.operatorAddress}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.operatorAddress}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosValidator}
			placeholderText={`Loading Cosmos Validator...`}
		>
			{#snippet children(cosmosValidator)}
				<dl>
					{#if cosmosValidator.fields.consensusPubkey != null}
						<div>
							<dt>Consensus Pubkey</dt>
							<dd>
								<TruncatedValue
									value={cosmosValidator.fields.consensusPubkey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if cosmosValidator.fields.moniker != null}
						<div>
							<dt>Moniker</dt>
							<dd>{cosmosValidator.fields.moniker}</dd>
						</div>
					{/if}

					{#if cosmosValidator.fields.jailed != null}
						<div>
							<dt>Jailed</dt>
							<dd>{cosmosValidator.fields.jailed ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if cosmosValidator.fields.status != null}
						<div>
							<dt>Status</dt>
							<dd>{cosmosValidator.fields.status}</dd>
						</div>
					{/if}

					{#if cosmosValidator.fields.tokens != null}
						<div>
							<dt>Tokens</dt>
							<dd><NumberValue value={cosmosValidator.fields.tokens} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
