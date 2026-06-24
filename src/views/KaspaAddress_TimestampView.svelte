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
			label: 'address',
		},
		{
			label: 'observed time/source',
		},
		{
			label: 'balance in sompi',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'address',
				},
				{
					label: 'observed time/source',
				},
				{
					label: 'balance in sompi',
				},
				{
					label: 'UTXO count',
				},
				{
					label: 'transaction count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Address',
				items: [
					{
						label: 'parent Kaspa address',
					},
				],
			},
			{
				label: 'UTXO set',
				items: [
					{
						label: 'address UTXO observations at the same observation when available',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'indexed transaction history',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw balance/address payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAddress_Timestamp>
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
	entityType={EntityType.KaspaAddress_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
