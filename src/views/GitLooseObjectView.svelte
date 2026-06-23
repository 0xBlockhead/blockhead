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
				label: 'object id',
			},
			{
				label: 'object format',
			},
			{
				label: 'byte source',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'object id',
					},
					{
						label: 'object format',
					},
					{
						label: 'byte source',
					},
					'path',
					{
						label: 'compressed size',
					},
					{
						label: 'observed timestamp',
					},
					{
						label: 'object link',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Object',
					items: [
						{
							label: 'parsed Git object when bytes verify',
						},
					],
				},
				{
					label: 'Verification',
					items: [
						{
							label: 'timestamped byte/object-id verification observations',
						},
					],
				},
				{
					label: 'Storage evidence',
					items: [
						{
							label: 'local clone/object-directory context',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitLooseObject>
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
	entityType={EntityType.GitLooseObject}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
