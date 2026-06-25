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
		'objectId',
		'objectFormat',
		'byteSource',
	],
	content: {
		dl: [
			[
				'objectId',
				'objectFormat',
				'byteSource',
				'path',
				'compressedSizeBytes',
				{
					label: 'observed timestamp',
				},
				'$object',
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
