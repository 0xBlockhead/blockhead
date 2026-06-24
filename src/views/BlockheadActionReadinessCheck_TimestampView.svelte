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
			label: 'readiness check',
		},
		{
			label: 'observation time',
		},
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'readiness check',
				},
				{
					label: 'observation time',
				},
				'source',
				'status',
				{
					label: 'observed amount',
				},
				{
					label: 'required amount',
				},
				{
					label: 'deficit amount',
				},
				{
					label: 'observed capability status',
				},
				{
					label: 'source payload hash',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Readiness check',
				items: [
					{
						label: 'BlockheadActionReadinessCheckView',
					},
				],
			},
			{
				label: 'Canonical evidence',
				items: [
					{
						label: 'balance/allowance/capability rows when resolved outside this local artifact',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadActionReadinessCheck_Timestamp>
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
	entityType={EntityType.BlockheadActionReadinessCheck_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
