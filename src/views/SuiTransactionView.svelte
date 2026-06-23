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
			'digest',
			{
				label: 'kind',
			},
			'sender',
		],
		content: {
			dl: [
				[
					'digest',
					{
						label: 'kind',
					},
					'sender',
					{
						label: 'latest status',
					},
					{
						label: 'latest checkpoint',
					},
					{
						label: 'latest timestamp',
					},
					{
						label: 'latest gas budget/price',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest execution',
					items: [
						{
							label: 'latest checkpoint/source execution observation',
						},
					],
				},
				{
					label: 'Execution history',
					items: [
						{
							label: 'timestamped transaction execution observations',
						},
					],
				},
				{
					label: 'Commands',
					items: [
						{
							label: 'programmable transaction commands',
						},
					],
				},
				{
					label: 'Object changes',
					items: [
						{
							label: 'object effect rows',
						},
					],
				},
				{
					label: 'Balance changes',
					items: [
						{
							label: 'balance delta rows',
						},
					],
				},
				{
					label: 'Events',
					items: [
						{
							label: 'Sui event rows',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiTransaction>
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
	entityType={EntityType.SuiTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
