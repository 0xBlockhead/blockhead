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
				label: 'source domain',
			},
			{
				label: 'destination domain',
			},
			{
				label: 'observation time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'source domain',
					},
					{
						label: 'destination domain',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'forward flag',
					},
					{
						label: 'HyperCore deposit flag',
					},
					{
						label: 'fee-row count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Fee rows',
					items: [
						{
							label: 'finality threshold',
						},
						{
							label: 'minimum bps',
						},
						{
							label: 'forward fee estimates',
						},
					],
				},
				{
					label: 'Domains',
					items: [
						{
							label: 'source/destination CCTP domain support rows',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Iris /v2/burn/USDC/fees response',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpBurnFee_Timestamp>
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
	entityType={EntityType.CctpBurnFee_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
