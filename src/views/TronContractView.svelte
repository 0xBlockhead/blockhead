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
			entityId: EntityId<typeof schema, EntityType.TronContract>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const contract = useEntity(entityCollectionsContext, EntityType.TronContract,
		entityId,
		({ fields: { name: true, verifyStatus: true, isProxy: true, ...(open && ({ compiler: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronContract}
	{entityId}
	title={entityId.address}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.address}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={contract}
			placeholderText="Loading TRON contract..."
		>
			{#snippet children(contract)}
				<dl data-column-item="center">
					{#if contract.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{contract.fields.name}</dd>
						</div>
					{/if}

					{#if contract.fields.verifyStatus != null}
						<div>
							<dt>Verification</dt>
							<dd>{contract.fields.verifyStatus}</dd>
						</div>
					{/if}

					{#if contract.fields.isProxy != null}
						<div>
							<dt>Proxy</dt>
							<dd>{contract.fields.isProxy ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && contract.fields.compiler != null}
						<div>
							<dt>Compiler</dt>
							<dd>{contract.fields.compiler}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
