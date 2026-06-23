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
				label: 'node id',
			},
			{
				label: 'subnet',
			},
			{
				label: 'start/end time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'node id',
					},
					{
						label: 'subnet',
					},
					{
						label: 'start/end time',
					},
					{
						label: 'stake',
					},
					{
						label: 'delegation fee',
					},
					{
						label: 'reward owner count',
					},
					{
						label: 'validation transaction id',
					},
					{
						label: 'latest uptime/connected observation',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Delegators',
					items: [
						{
							label: 'delegations under this validation interval',
						},
					],
				},
				{
					label: 'Validation transaction',
					items: [
						{
							label: 'P-Chain validation transaction when resolved',
						},
					],
				},
				{
					label: 'Reward owners',
					items: [
						{
							label: 'reward owner address list',
						},
					],
				},
				{
					label: 'Subnet',
					items: [
						{
							label: 'parent subnet',
						},
					],
				},
				{
					label: 'Linked network',
					items: [
						{
							label: 'member chain/network context',
						},
					],
				},
				{
					label: 'Validator observations',
					items: [
						{
							label: 'timestamped connected/uptime/source observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'validator set payload',
						},
						{
							label: 'uptime payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheValidator>
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
	entityType={EntityType.AvalancheValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
