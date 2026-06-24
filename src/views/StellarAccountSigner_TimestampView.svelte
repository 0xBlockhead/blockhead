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
			label: 'signer',
		},
		'weight',
		{
			label: 'ledger sequence',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'signer',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'ledger sequence',
				},
				'weight',
				'sponsor',
				{
					label: 'active state',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Signer',
				items: [
					{
						label: 'parent Stellar account signer',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'parent Stellar account',
					},
				],
			},
			{
				label: 'Ledger',
				items: [
					{
						label: 'Stellar ledger when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Horizon signer object',
					},
					{
						label: 'RPC ledger entry snapshot',
					},
					{
						label: 'historical account effects when needed',
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
			selection: EntityProxyResource<typeof schema, EntityType.StellarAccountSigner_Timestamp>
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
	entityType={EntityType.StellarAccountSigner_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
