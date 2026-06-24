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
			label: 'ring',
		},
		{
			label: 'member index',
		},
		{
			label: 'global output index',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'ring',
				},
				{
					label: 'member index',
				},
				{
					label: 'global output index',
				},
				{
					label: 'transaction hash',
				},
				{
					label: 'output index',
				},
				{
					label: 'public key',
				},
				{
					label: 'commitment',
				},
				{
					label: 'height',
				},
				{
					label: 'unlocked state',
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
						label: 'parent Monero ring',
					},
				],
			},
			{
				label: 'Output',
				items: [
					{
						label: 'stealth output when tx/output is known',
					},
				],
			},
			{
				label: 'Decoy context',
				items: [
					{
						label: 'global output index',
					},
					{
						label: 'get_outs/source payload',
					},
				],
			},
			{
				label: 'Wallet interpretation',
				items: [
					{
						label: 'BlockheadMoneroOutputState only when a connected wallet identifies ownership',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroRingMember>
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
	entityType={EntityType.MoneroRingMember}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
