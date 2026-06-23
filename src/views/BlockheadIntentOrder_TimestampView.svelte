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
				label: 'order',
			},
			{
				label: 'observation time',
			},
			'source',
			'status',
		],
		content: {
			dl: [
				[
					{
						label: 'order',
					},
					{
						label: 'observation time',
					},
					'source',
					'status',
					{
						label: 'fill tx',
					},
					{
						label: 'claim tx',
					},
					{
						label: 'gas used',
					},
					{
						label: 'status payload hash',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Order',
					items: [
						{
							label: 'BlockheadIntentOrderView',
						},
					],
				},
				{
					label: 'Status evidence',
					items: [
						{
							label: 'backend-specific status payload retained only when needed',
						},
					],
				},
				{
					label: 'Chain evidence',
					items: [
						{
							label: 'linked transaction/receipt/bridge transfer rows when resolved',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentOrder_Timestamp>
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
	entityType={EntityType.BlockheadIntentOrder_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
