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
		'$serviceRequest',
		'traceId',
		'settlementTransactionHash',
	],
	content: {
		dl: [
			[
				'$serviceRequest',
				'traceId',
				'settlementTransactionHash',
				'acknowledgementSignature',
				'rewardAmount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Service request',
				items: [
					'$serviceRequest',
				],
			},
			{
				label: 'Settlement transaction',
				items: [
					{
						label: 'EVM transaction when hash resolves on the 0G execution network',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGSettlementTrace>
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
	entityType={EntityType.ZeroGSettlementTrace}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
