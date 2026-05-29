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
			entityId: EntityId<typeof schema, EntityType.TronContract>
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

	const contract = useEntity(
		EntityType.TronContract,
		entityId,
		{
			name: {},
			verifyStatus: {},
			isProxy: {},
			...open && {
				compiler: {},
			},
		},
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
					{#if contract.name != null}
						<div>
							<dt>Name</dt>
							<dd>{contract.name}</dd>
						</div>
					{/if}

					{#if contract.verifyStatus != null}
						<div>
							<dt>Verification</dt>
							<dd>{contract.verifyStatus}</dd>
						</div>
					{/if}

					{#if contract.isProxy != null}
						<div>
							<dt>Proxy</dt>
							<dd>{contract.isProxy ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if open && contract.compiler != null}
						<div>
							<dt>Compiler</dt>
							<dd>{contract.compiler}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
