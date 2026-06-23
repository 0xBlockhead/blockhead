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
				label: 'block number/hash',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'block number',
					},
					'hash',
					{
						label: 'parent',
					},
					{
						label: 'state root',
					},
					{
						label: 'extrinsics root',
					},
					{
						label: 'extrinsic count',
					},
					{
						label: 'event count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Extrinsics',
					items: [
						{
							label: 'extrinsics in this block',
						},
					],
				},
				{
					label: 'Events',
					items: [
						{
							label: 'events in this block',
						},
					],
				},
				{
					label: 'Parent',
					items: [
						{
							label: 'parent Polkadot block',
						},
					],
				},
				{
					label: 'Lookup evidence',
					items: [
						{
							label: 'chain_getBlockHash number lookup',
						},
						{
							label: 'chain_getBlock hash lookup',
						},
						{
							label: 'indexer block payload fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotBlock>
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
	entityType={EntityType.PolkadotBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
