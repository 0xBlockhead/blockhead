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
				label: 'phase kind',
			},
			'success',
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'phase kind',
					},
					'success',
					{
						label: 'exit/action code',
					},
					{
						label: 'gas used',
					},
					{
						label: 'gas fees',
					},
					{
						label: 'storage fees',
					},
					{
						label: 'skipped reason',
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
							label: 'parent transaction',
						},
					],
				},
				{
					label: 'Raw phase',
					items: [
						{
							label: 'raw phase payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonTransactionPhase>
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
	entityType={EntityType.TonTransactionPhase}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
