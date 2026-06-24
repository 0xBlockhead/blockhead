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
			label: 'application',
		},
		{
			label: 'box name',
		},
		{
			label: 'latest value hash',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'application',
				},
				{
					label: 'box name',
				},
				{
					label: 'latest value hash',
				},
				{
					label: 'latest round/source',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Application',
				items: [
					{
						label: 'parent application',
					},
				],
			},
			{
				label: 'Round observations',
				items: [
					{
						label: 'round/source box value observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'box name listing',
					},
					{
						label: 'application box lookup payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandBox>
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
	entityType={EntityType.AlgorandBox}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
