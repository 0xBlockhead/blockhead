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
				label: 'object kind',
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
						label: 'object kind',
					},
					{
						label: 'size',
					},
					{
						label: 'repository context',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Typed body',
					items: [
						{
							label: 'commit/tree/blob/tag body by object kind',
						},
					],
				},
				{
					label: 'Storage',
					items: [
						{
							label: 'loose and packed storage observations',
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
					label: 'Repository',
					items: [
						{
							label: 'repository availability context',
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
			selection: EntityProxyResource<typeof schema, EntityType.GitObject>
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
	entityType={EntityType.GitObject}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
