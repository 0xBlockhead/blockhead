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
		'$outcome',
		'timestampMs',
		'status',
	],
	content: {
		dl: [
			[
				'$outcome',
				'timestampMs',
				'source',
				'status',
				'finality',
			],
			[
				{
					label: 'transaction hash/id',
				},
				'bridgeTransferId',
				'sourcePayloadHash',
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Outcome',
				items: [
					{
						label: 'BlockheadActionOutcomeView',
					},
				],
			},
			{
				label: 'Public evidence',
				items: [
					{
						label: 'transaction/receipt/bridge transfer rows when resolved outside this local artifact',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadActionOutcome_Timestamp>
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
	entityType={EntityType.BlockheadActionOutcome_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
