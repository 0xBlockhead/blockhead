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
			label: 'payout',
		},
		{
			label: 'account',
		},
		{
			label: 'observation time',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'payout',
				},
				{
					label: 'account',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'eligible amount',
				},
				{
					label: 'claimed amount',
				},
				{
					label: 'claim status',
				},
				{
					label: 'proof hash',
				},
				{
					label: 'claim transaction',
				},
				{
					label: 'expiry',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Payout',
				items: [
					{
						label: 'parent payout',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'claiming account',
					},
				],
			},
			{
				label: 'Claim transaction',
				items: [
					{
						label: 'EVM transaction when resolved',
					},
				],
			},
			{
				label: 'Proof/source',
				items: [
					{
						label: 'merkle proof hash',
					},
					{
						label: 'event/call payload',
					},
					{
						label: 'or indexer row evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.PayoutClaim_Timestamp>
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
	entityType={EntityType.PayoutClaim_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
