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
			selection: EntityProxyResource<typeof schema, EntityType.NearAction>
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
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearAction}
	entitySelector={selection.entitySelector}
	title={`Action #${selection.entitySelector.actionIndex.toString()}`}
	idDragPlainText={selection.entitySelector.actionIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.actionIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Action </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { actionKind: true, methodName: true, depositYoctoNear: true } }),
				)}
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
