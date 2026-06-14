<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NearAction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const nearAction = subscribe(EntityType.NearAction,
		selector,
		({ fields: { actionKind: true, methodName: true, depositYoctoNear: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NearAction}
	entitySelector={selector}
	title={`Action #${selector.actionIndex.toString()}`}
	idDragPlainText={selector.actionIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.actionIndex.toString()}
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
			resource={nearAction}
			placeholderText={`Loading NEAR Action...`}
		>
			{#snippet children(nearAction)}
				<dl>
					{#if nearAction.fields.actionKind != null}
						<div>
							<dt>Action Kind</dt>
							<dd>{nearAction.fields.actionKind}</dd>
						</div>
					{/if}

					{#if nearAction.fields.methodName != null}
						<div>
							<dt>Method Name</dt>
							<dd>{nearAction.fields.methodName}</dd>
						</div>
					{/if}

					{#if nearAction.fields.depositYoctoNear != null}
						<div>
							<dt>Deposit Yocto Near</dt>
							<dd><NumberValue value={nearAction.fields.depositYoctoNear} /> yoctoNEAR</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
