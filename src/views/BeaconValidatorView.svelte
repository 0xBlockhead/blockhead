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
				label: 'validator index',
			},
			{
				label: 'pubkey when resolved',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'validator index',
					},
					{
						label: 'pubkey when resolved',
					},
				],
				[
					{
						label: 'latest validator observation',
					},
					{
						label: 'balance',
					},
					{
						label: 'effective balance',
					},
					{
						label: 'status',
					},
					{
						label: 'slashed flag',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Validator observations',
					items: [
						{
							label: 'state-scoped validator observations',
						},
					],
				},
				{
					label: 'Withdrawals',
					items: [
						{
							label: 'withdrawals for this validator when sourceable',
						},
					],
				},
				{
					label: 'Committees',
					items: [
						{
							label: 'committee rows containing the validator index when bounded by slot/period',
						},
					],
				},
				{
					label: 'Network',
					items: [
						{
							label: 'parent EVM network consensus context',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: '/eth/v1/beacon/states/{state_id}/validators/{validator_id}',
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconValidator>
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
	entityType={EntityType.BeaconValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
