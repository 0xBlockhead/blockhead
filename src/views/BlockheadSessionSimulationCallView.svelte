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
				label: 'simulation',
			},
			{
				label: 'call path',
			},
			{
				label: 'to address',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'simulation',
					},
					{
						label: 'call path',
					},
					{
						label: 'parent path',
					},
					'depth',
					{
						label: 'call index',
					},
					{
						label: 'call type',
					},
					{
						label: 'from/to addresses',
					},
					'value',
					{
						label: 'selector',
					},
					{
						label: 'gas used',
					},
					'reverted',
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Simulation',
					items: [
						{
							label: 'BlockheadSessionSimulationView',
						},
					],
				},
				{
					label: 'Children',
					items: [
						{
							label: 'nested call rows by parent path',
						},
					],
				},
				{
					label: 'Input/output',
					items: [
						{
							label: 'input selector',
						},
						{
							label: 'input/output data hashes',
						},
						{
							label: 'raw runtime payload when retained',
						},
					],
				},
				{
					label: 'Logs',
					items: [
						{
							label: 'simulation log rows emitted within this call when mapped',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSessionSimulationCall>
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
	entityType={EntityType.BlockheadSessionSimulationCall}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
