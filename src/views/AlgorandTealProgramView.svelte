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
			label: 'program hash',
		},
		{
			label: 'program kind',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'program hash',
				},
				{
					label: 'program kind',
				},
				{
					label: 'TEAL version',
				},
				{
					label: 'latest bytecode/disassembly availability',
				},
				{
					label: 'application count',
				},
				{
					label: 'transaction count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Applications',
				items: [
					{
						label: 'applications using this approval/clear program',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions carrying or creating the program',
					},
				],
			},
			{
				label: 'Program evidence',
				items: [
					{
						label: 'source-scoped bytecode/disassembly/source-map observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTealProgram>
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
	entityType={EntityType.AlgorandTealProgram}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
