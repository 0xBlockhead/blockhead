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
				label: 'transaction',
			},
			{
				label: 'input index',
			},
			{
				label: 'key image',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transaction',
					},
					{
						label: 'input index',
					},
					{
						label: 'key image',
					},
					{
						label: 'ring status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Ring',
					items: [
						{
							label: 'ring/decoy set for this key image',
						},
					],
				},
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent Monero transaction',
						},
					],
				},
				{
					label: 'Wallet interpretation',
					items: [
						{
							label: 'BlockheadMoneroTransferState only when a connected wallet links this key image',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroKeyImage>
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
	entityType={EntityType.MoneroKeyImage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
