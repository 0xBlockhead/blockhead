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
		'$object',
	],
	content: {
		dl: [
			[
				'objectId',
				'objectFormat',
				'$object',
				'byteSize',
				'mime',
				{
					label: 'text sample when safe',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Paths',
				items: [
					{
						label: 'tree entries that reference this blob',
					},
				],
			},
			{
				label: 'Object',
				items: [
					{
						label: 'parent Git object',
					},
				],
			},
			{
				label: 'Content preview',
				items: [
					{
						label: 'local byte preview when available',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'paths',
			label: 'paths',
			field: '$$paths',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.GitBlob>
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
	entityType={EntityType.GitBlob}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
