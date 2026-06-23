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
				label: 'stored data',
			},
			{
				label: 'observation time',
			},
			{
				label: 'local availability',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'stored data',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'has local block',
					},
					{
						label: 'available locally',
					},
					{
						label: 'download status',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Stored data',
					items: [
						{
							label: 'parent local stored-data row',
						},
					],
				},
				{
					label: 'Dataset',
					items: [
						{
							label: 'Codex dataset when resolved',
						},
					],
				},
				{
					label: 'Node',
					items: [
						{
							label: 'parent Codex storage node state',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: '/data/{cid}/exists',
						},
						{
							label: '/data/{cid}',
						},
						{
							label: '/data/{cid}/network responses',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCodexStoredData_Timestamp>
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
	entityType={EntityType.BlockheadCodexStoredData_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
