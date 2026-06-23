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
				label: 'workchain',
			},
			{
				label: 'shard prefix',
			},
			'seqno',
		],
		content: {
			dl: [
				[
					{
						label: 'workchain',
					},
					{
						label: 'shard prefix',
					},
					'seqno',
					'source',
					{
						label: 'root hash',
					},
					{
						label: 'file hash',
					},
					{
						label: 'timestamp',
					},
					{
						label: 'logical-time range',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Workchain',
					items: [
						{
							label: 'parent workchain identity',
						},
					],
				},
				{
					label: 'Block',
					items: [
						{
							label: 'matching block when root/file hashes resolve',
						},
					],
				},
				{
					label: 'Masterchain reference',
					items: [
						{
							label: 'min ref masterchain seqno',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'raw block id payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonShard_Timestamp>
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
	entityType={EntityType.TonShard_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
