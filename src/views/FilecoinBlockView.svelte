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
				label: 'CID',
			},
			{
				label: 'tipset',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'CID',
					},
					{
						label: 'tipset',
					},
					{
						label: 'miner',
					},
					{
						label: 'ticket VRF proof',
					},
					{
						label: 'win count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Messages',
					items: [
						{
							label: 'Filecoin messages included in the block',
						},
					],
				},
				{
					label: 'Tipset',
					items: [
						{
							label: 'parent Filecoin tipset',
						},
					],
				},
				{
					label: 'Miner',
					items: [
						{
							label: 'producing Filecoin miner',
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
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinBlock>
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
	entityType={EntityType.FilecoinBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
