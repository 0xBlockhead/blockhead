<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'transaction',
			},
			{
				label: 'action index',
			},
			{
				label: 'action kind',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'action index',
					},
					{
						label: 'action kind',
					},
					{
						label: 'method name',
					},
					{
						label: 'deposit',
					},
					{
						label: 'receiver context',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent NEAR transaction',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'action-specific transfer/stake/key/deploy/function-call fields when source-backed',
						},
					],
				},
				{
					label: 'Effects',
					items: [
						{
							label: 'execution outcomes produced by the transaction status payload',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

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
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.NearAction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
