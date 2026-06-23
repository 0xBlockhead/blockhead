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
			'height',
			'hash',
			{
				label: 'epoch',
			},
		],
		content: {
			dl: [
				[
					'height',
					'hash',
					{
						label: 'parent',
					},
					{
						label: 'epoch id',
					},
					{
						label: 'timestamp',
					},
				],
				[
					{
						label: 'chunk count',
					},
					{
						label: 'parent/chain context',
					},
					{
						label: 'source evidence',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'NearNetwork/Network',
						},
					],
				},
				{
					label: 'Header',
					items: [
						'height',
						'hash',
						{
							label: 'parent',
						},
						{
							label: 'epoch id',
						},
						{
							label: 'timestamp',
						},
					],
				},
				{
					label: 'Chunks',
					items: [
						{
							label: 'NearChunk list',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'RPC block_id height lookup',
						},
						{
							label: 'RPC block_id hash lookup',
						},
						{
							label: 'NearBlocks indexer block lookup',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'NEAR RPC/indexer block payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearBlock>
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
	entityType={EntityType.NearBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
