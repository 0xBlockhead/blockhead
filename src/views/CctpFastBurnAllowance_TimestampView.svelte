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
			label: 'observation time',
		},
		'source',
		{
			label: 'allowance in USDC',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'allowance in USDC',
				},
				{
					label: 'Circle last-updated time',
				},
				{
					label: 'request id',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Iris /v2/fastBurn/USDC/allowance response',
					},
				],
			},
			{
				label: 'Related fees',
				items: [
					{
						label: 'fast-transfer burn-fee observations by domain pair/finality threshold',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpFastBurnAllowance_Timestamp>
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
	entityType={EntityType.CctpFastBurnAllowance_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
