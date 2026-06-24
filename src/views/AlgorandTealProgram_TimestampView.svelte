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
			label: 'program',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'program',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'bytecode availability',
				},
				{
					label: 'disassembly availability',
				},
				{
					label: 'source map availability',
				},
				{
					label: 'compile result hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Program',
				items: [
					{
						label: 'parent TEAL program identity',
					},
				],
			},
			{
				label: 'Artifact',
				items: [
					'bytecode',
					'disassembly',
					{
						label: 'source map',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'algod compile/disassemble response',
					},
					{
						label: 'transaction/application payload carrying program bytes',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTealProgram_Timestamp>
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
	entityType={EntityType.AlgorandTealProgram_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
