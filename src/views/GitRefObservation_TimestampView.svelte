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
		'$ref',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$ref',
				'timestampMs',
				'source',
				'targetObjectId',
				'peeledObjectId',
				'advertised',
				{
					label: 'protection JSON',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ref',
				items: [
					{
						label: 'parent Git ref',
					},
				],
			},
			{
				label: 'Target',
				items: [
					{
						label: 'target Git object',
					},
				],
			},
			{
				label: 'Protection',
				items: [
					{
						label: 'host-specific branch/tag protection details when captured',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitRefObservation_Timestamp>
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
	entityType={EntityType.GitRefObservation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
