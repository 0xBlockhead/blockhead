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
			label: 'block',
		},
		{
			label: 'extrinsic index',
		},
		'hash',
	],
	content: {
		dl: [
			[
				{
					label: 'block',
				},
				{
					label: 'extrinsic index',
				},
				'hash',
				{
					label: 'signer',
				},
				{
					label: 'pallet',
				},
				{
					label: 'call name',
				},
				'success',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Signer',
				items: [
					{
						label: 'signing Polkadot account',
					},
				],
			},
			{
				label: 'Pallet/call',
				items: [
					{
						label: 'runtime pallet',
					},
					{
						label: 'call metadata',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'events filtered by extrinsic',
					},
				],
			},
			{
				label: 'Block context',
				items: [
					{
						label: 'parent Polkadot block',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotExtrinsic>
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
	entityType={EntityType.PolkadotExtrinsic}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
