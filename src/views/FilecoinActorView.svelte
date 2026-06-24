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
		'address',
		{
			label: 'actor code CID',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'address',
				{
					label: 'actor code CID',
				},
			],
			[
				'nonce',
				{
					label: 'balance in attoFIL',
				},
				{
					label: 'latest observation row',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped actor state observations',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'Filecoin messages when scoped by source context',
					},
				],
			},
			{
				label: 'Miner',
				items: [
					{
						label: 'Filecoin miner row when the address is a miner actor',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Filecoin network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'StateGetActor',
					},
					{
						label: 'indexer address payloads',
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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinActor>
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
	entityType={EntityType.FilecoinActor}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
