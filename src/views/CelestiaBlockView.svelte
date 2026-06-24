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
			label: 'timestamp',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'height',
				'hash',
				{
					label: 'timestamp',
				},
				{
					label: 'proposer',
				},
				{
					label: 'transaction count',
				},
				{
					label: 'blob count',
				},
				{
					label: 'namespace count',
				},
			],
			[
				{
					label: 'app hash',
				},
				{
					label: 'data hash',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blobs',
				items: [
					{
						label: 'Celestia blobs included at this height',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Celestia network',
					},
				],
			},
			{
				label: 'Consensus evidence',
				items: [
					{
						label: 'CometBFT block/header fields',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'CometBFT height lookup',
					},
					{
						label: 'Celenium/indexer hash lookup when source-backed',
					},
				],
			},
			{
				label: 'DA evidence',
				items: [
					{
						label: 'namespaced blob availability at height',
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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaBlock>
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
	entityType={EntityType.CelestiaBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
