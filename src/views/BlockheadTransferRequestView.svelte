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
				label: 'network',
			},
			{
				label: 'room',
			},
			{
				label: 'from/to accounts',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'room',
					},
					{
						label: 'from/to accounts',
					},
					{
						label: 'allocation count',
					},
					'status',
					{
						label: 'created time',
					},
					{
						label: 'expiry',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Allocations',
					items: [
						{
							label: 'destination/token/amount table',
						},
					],
				},
				{
					label: 'Room',
					items: [
						{
							label: 'parent local room',
						},
					],
				},
				{
					label: 'Execution',
					items: [
						{
							label: 'authorization/submission/outcome rows when linked',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadTransferRequest>
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
	entityType={EntityType.BlockheadTransferRequest}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
