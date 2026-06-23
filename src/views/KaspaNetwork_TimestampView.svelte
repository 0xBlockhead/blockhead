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
				label: 'network',
			},
			{
				label: 'observed time/source',
			},
			{
				label: 'virtual DAA score',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'observed time/source',
					},
					{
						label: 'virtual DAA score',
					},
					{
						label: 'virtual blue score',
					},
					{
						label: 'selected parent',
					},
					{
						label: 'pruning point',
					},
					{
						label: 'sink count',
					},
					{
						label: 'block count',
					},
					{
						label: 'transaction count',
					},
					'difficulty',
					{
						label: 'UTXO-index availability',
					},
					{
						label: 'server version',
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
							label: 'parent Kaspa network',
						},
					],
				},
				{
					label: 'DAG head',
					items: [
						{
							label: 'selected parent',
						},
						{
							label: 'pruning point',
						},
						{
							label: 'virtual scores',
						},
						{
							label: 'sink count',
						},
					],
				},
				{
					label: 'Index/server',
					items: [
						{
							label: 'UTXO-index availability',
						},
						{
							label: 'server version',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'getBlockDagInfo/getServerInfo or indexer payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaNetwork_Timestamp>
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
	entityType={EntityType.KaspaNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
