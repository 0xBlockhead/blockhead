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
			label: 'program id',
		},
		'name',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'program id',
				},
				'name',
				{
					label: 'program account',
				},
				{
					label: 'upgrade authority',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Program account',
				items: [
					{
						label: 'executable Solana account',
					},
				],
			},
			{
				label: 'Upgrade authority',
				items: [
					{
						label: 'upgrade authority account',
					},
				],
			},
			{
				label: 'Instructions',
				items: [
					{
						label: 'instructions when reached from transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaProgram>
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
	entityType={EntityType.SolanaProgram}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
