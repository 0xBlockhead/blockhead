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
				label: 'message',
			},
			{
				label: 'execution tipset key',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'message',
					},
					{
						label: 'execution tipset key',
					},
					'source',
					'height',
					{
						label: 'block CID',
					},
					{
						label: 'exit code',
					},
					{
						label: 'gas used',
					},
					{
						label: 'return-data status',
					},
					{
						label: 'replaced message CID',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Message',
					items: [
						{
							label: 'parent Filecoin message',
						},
					],
				},
				{
					label: 'Tipset',
					items: [
						{
							label: 'execution Filecoin tipset',
						},
					],
				},
				{
					label: 'Execution',
					items: [
						{
							label: 'exit code',
						},
						{
							label: 'return data',
						},
						{
							label: 'gas used',
						},
						{
							label: 'replacement note',
						},
					],
				},
				{
					label: 'Source',
					items: [
						{
							label: 'StateSearchMsg',
						},
						{
							label: 'ChainGetParentReceipts',
						},
						{
							label: 'or indexer payload evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinMessageReceipt>
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
	entityType={EntityType.FilecoinMessageReceipt}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
