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
			entityId: EntityId<typeof schema, EntityType.NearAction>
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

	const nearAction = useEntity(
		EntityType.NearAction,
		entityId,
		{
			actionKind: {},
			methodName: {},
			depositYoctoNear: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearAction}
	{entityId}
	title={`NEAR Action ${entityId.actionIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.actionIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={nearAction}
			placeholderText={`Loading NEAR Action...`}
		>
			{#snippet children(nearAction)}
				<dl>
					{#if nearAction.actionKind != null}
						<div>
							<dt>Action Kind</dt>
							<dd>{nearAction.actionKind}</dd>
						</div>
					{/if}

					{#if nearAction.methodName != null}
						<div>
							<dt>Method Name</dt>
							<dd>{nearAction.methodName}</dd>
						</div>
					{/if}

					{#if nearAction.depositYoctoNear != null}
						<div>
							<dt>Deposit Yocto Near</dt>
							<dd><NumberValue value={nearAction.depositYoctoNear} /> yoctoNEAR</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
